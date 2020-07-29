import meta from '../package.json';

import { createReadStream, promises as fs } from 'fs';
import cyclic32 from 'cyclic-32';
import hasha from 'hasha';
import ora from 'ora';
import terminalLink from 'terminal-link';
import chalk from 'chalk';

import { DateObject, SFVObject, CalculateOptions } from '../types/util';

function bufferToString(inputBuffer: Buffer): string {
  const outputString = [];

  inputBuffer.forEach(item =>
    outputString.push(
      item
        .toString(16)
        .toUpperCase()
        .padStart(2, '0')
    )
  );

  return outputString.join('');
}

async function checksumFromStream(stream: NodeJS.ReadableStream, algorithm: string): Promise<string> {
  const hashingFunction = algorithm === 'crc32'
    ? cyclic32.createHash()
    : hasha.stream({algorithm});

  return new Promise((resolve, reject) => {
    stream
      .pipe(hashingFunction)
      .on('error', (err) => reject(err))
      .on('data', buffer => resolve(buffer.toString('hex').toUpperCase()));
  });
}

async function checksumFromFile(inputFile: string, algorithm: string): Promise<string> {
  await fs.access(inputFile);

  return await checksumFromStream(createReadStream(inputFile), algorithm);
}

async function compareSFV(sfvFiles: string[], failFast = false): Promise<void> {
  console.log('\nVerifying files:');

  await Promise.all( sfvFiles.map(async sfvFile => {
    const sfvContents = await readSFV(sfvFile);

    await Promise.all(sfvContents.map(async ({file, checksum}) => {
      const spinner = ora(file).start();
      let actualChecksum;

      const algorithm = sfvFile.endsWith('.sfvx')
        ? detectHash(checksum)
        : 'crc32';

      try {
         actualChecksum = await checksumFromFile(file, algorithm);
      } catch (e) {
        spinner.fail(`${file} ${chalk.red(checksum)} ${chalk.dim(e)}`);

        if (failFast) {
          throw 'Failing fast'
        } else {
          return;
        }
      }

      if (checksum === actualChecksum) {
        spinner.succeed(`${file} ${chalk.blue(checksum)}`);
      } else {
        spinner.fail(`${file} ${chalk.red(checksum)} (actual: ${chalk.blue(actualChecksum)})`);

        if (failFast) throw 'Failing fast';
      }
    }));
  }));
}

function detectHash(algorithm: string): string {
  switch (algorithm.length) {
    case 8:
      return 'crc32';

    case 32:
      return 'md5';

    case 40:
      return 'sha1';

    case 64:
      return 'sha256';

    case 128:
      return 'sha512';

    default:
      throw Error('Unsupported hashing algorithm');
  }
}

async function calculateChecksum(files: string[], options: CalculateOptions): Promise<string[]> {
  if (!options.print) {
    const checksum = (files.length === 1)
      ? 'checksum'
      : 'checksums';

    console.log(`\nCalculating ${checksum}:`);
  }

  return await Promise.all(files.map( async file => {
    let spinner;
    let checksum;

    if (!options.print) {
      spinner = ora(`${file}`).start();
    }

    try {
      checksum = await checksumFromFile(file, options.algorithm);
      if (!options.print) spinner.succeed(`${file} ${chalk.blue(checksum)}`);
    } catch (e) {
      if (options.failFast) {
        spinner.fail(`${file} ${chalk.dim(e)}`)
        softThrow('Failing fast to error', true);
      }
      if (!options.print) spinner.fail(`${file} ${chalk.dim(e)}`);
    }

    return file && checksum
      ? `${file} ${checksum}`
      : '';
  }));
}

function getDate(): DateObject {
  const date = new Date();

  return {
    year: date.getFullYear().toString(),
    month: date.getMonth().toString().padStart(2, '0'),
    day: date.getMonth().toString().padStart(2, '0'),
    hours: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    seconds: date.getSeconds().toString().padStart(2, '0')
  }
}

function isSupportedAlgorithm(algorithm: string): boolean {
  return ['md5', 'sha1', 'sha256', 'sha512'].includes(algorithm.replace('-', '').toLowerCase());
}

function parseSFV(input: string | string[], isSFV = true): SFVObject[] {
  const lines = Array.isArray(input)
    ? stripComments(input)
    : stripComments(input.split('\n'));

  const regex = isSFV
   ? /^(.*)\s+(\w{8})$/g
   : /^(.*)\s+(\w{32,128})$/g

  return lines.map(line => {
    const [file, checksum] = line
      .trim()
      .split(regex)
      .filter(item => item);

    return file && checksum
      ? {
        file,
        checksum
      }
      : null;
  }).filter(item => item);
}

function printTitle(): void {
  const title = `${meta.name} v${meta.version}`;
  const linkedTitle = terminalLink(title, meta.homepage, {
      fallback() {
        return `${title} | ${meta.homepage}`;
      }
    });

  console.log(linkedTitle);
}

async function readSFV(filePath: string): Promise<SFVObject[]> {
  const fileContents = (await fs.readFile(filePath)).toString();
  const isSFV = filePath.endsWith('.sfvx')
    ? false
    : true;

  return parseSFV(fileContents.toString(), isSFV);
}

function setComment(useWinSFV: boolean): string {
  const {
    year, month, day,
    hours, minutes, seconds
  } = getDate();

  return useWinSFV
    ? `; Generated by WIN-SFV32 v1.1a on ${year}-${month}-${day} at ${hours}:${minutes}.${seconds}\r\n;`
    : `; ${meta.name} v${meta.version} | ${meta.homepage}\n;`;
}

function softThrow(message: string, newLine = false): void {
  process.on('exit', () => {
    const prefix = newLine
      ? '\n'
      : '';

    console.log(`${prefix}🔥 ${message}`);
  });

  process.exit(1);
}

function stripComments(lines: string[]): string[] {
  return lines.filter(line =>
    !line
      .trim()
      .startsWith(';')
  )
}

async function writeSFV(fileName: string, fileContents: string, algorithm: string): Promise<void> {
  const fileExtension = algorithm === 'crc32'
    ? '.sfv'
    : '.sfvx';

  const outputFile = fileName.endsWith(fileExtension)
    ? fileName
    : `${fileName}${fileExtension}`;

  console.log('\nWriting output:');
  const spinner = ora(outputFile).start();

  try {
    await fs.writeFile(outputFile, fileContents);
    spinner.succeed(outputFile);
  } catch (e) {
    spinner.fail(`${outputFile} ${chalk.dim(e)}`);
  }
}

export {
  bufferToString,
  calculateChecksum,
  compareSFV,
  checksumFromFile,
  checksumFromStream,
  detectHash,
  getDate,
  isSupportedAlgorithm,
  parseSFV,
  printTitle,
  readSFV,
  setComment,
  stripComments,
  softThrow,
  writeSFV
};
