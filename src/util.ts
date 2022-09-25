import meta from '../package.json';

import { fromFile as checksumFromFile } from 'simple-file-verification';
import { normalize as normalizePath } from 'node:path';
import { promises as fs } from 'node:fs';
import ora from 'ora';
import pc from "picocolors"
import terminalLink from 'terminal-link';

async function compareSFV(sfvFiles: string[], failFast = false): Promise<void> {
  const filesNoun = sfvFiles.length === 1 ? 'file' : 'files';
  console.log(`\nVerifying ${filesNoun}:`);

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
        spinner.fail(`${file} ${pc.red(checksum)} ${pc.dim(e)}`);

        if (failFast) {
          throw 'Failing fast'
        } else {
          return;
        }
      }

      if (checksum === actualChecksum) {
        spinner.succeed(`${file} ${pc.blue(checksum)}`);
      } else {
        spinner.fail(`${file} ${pc.red(checksum)} (actual: ${pc.blue(actualChecksum)})`);

        if (failFast) throw 'Failing fast';
      }
    }));
  }));
}

function detectHash(algorithm: string): string {
	if (algorithm.includes(':')) {
		const prefix = algorithm.split(':').at(0);

		if (isSupportedAlgorithm(prefix)) {
			return prefix;
		}

		throw Error('Unsupported hashing algorithm');
	}

	// Legacy format
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

async function calculateChecksum(files: string[], options: FlagOptions): Promise<string[]> {
  if (!options.print) {
    const checksum = (files.length === 1)
      ? 'checksum'
      : 'checksums';

    console.log(`\nCalculating ${checksum}:`);
  }

  const longestString = getLongestString(files);

  return await Promise.all(files.map( async file => {
    let spinner;
    let checksum;

    if (!options.print) {
      spinner = ora(`${file}`).start();
    }

    try {
      checksum = await checksumFromFile(file, slugify(options.algorithm));
      if (!options.print) spinner.succeed(`${file} ${pc.blue(checksum)}`);
    } catch (e) {
      if (options.failFast) {
        spinner.fail(`${file} ${pc.dim(e)}`)
        softThrow('Failing fast to error', true);
      }
      if (!options.print) spinner.fail(`${file} ${pc.dim(e)}`);
    }

    return file && checksum
      ? options.format
        ? `${normalizePath(file)}${' '.repeat(longestString - file.length + 1)}${checksum}`
        : `${normalizePath(file)} ${checksum}`
      : null;
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

function getLongestString(input: string[]): number {
  const map = input.map(x => normalizePath(x).length);
  const max = map.indexOf(Math.max(...map));

  return input[max].length;
}

function isSupportedAlgorithm(algorithm: string): boolean {
  return ['md5', 'sha1', 'sha256', 'sha512'].includes(slugify(algorithm));
}

function slugify(algorithm: string): string {
  return algorithm.replace('-', '').toLowerCase();
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
        file: normalizePath(file),
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

function setComment(options: FlagOptions = {}): string {
  options = {
    comment: '',
    winsfv: false,
    ...options
  };

  if (options.winsfv) {
    const {
      year, month, day,
      hours, minutes, seconds
    } = getDate();

    return `; Generated by WIN-SFV32 v1.1a on ${year}-${month}-${day} at ${hours}:${minutes}.${seconds}\r\n;`;
  }

  return options.comment?.length
    ? `; ${String(options.comment)}\n;`
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

async function writeSFV(fileName: string, fileContents: string, options: FlagOptions): Promise<void> {
  const fileExtension = options.algorithm === 'crc32'
    ? '.sfv'
    : '.sfvx';

  const outputFile = fileName.endsWith(fileExtension)
    ? fileName
    : `${fileName}${fileExtension}`;

  let spinner;

  if (!options.print) {
    console.log('\nWriting output:');
    spinner = ora(outputFile).start();
  }

  try {
    await fs.writeFile(outputFile, fileContents);
    if (!options.print) spinner.succeed(outputFile);
  } catch (e) {
    if (!options.print) spinner.fail(`${outputFile} ${pc.dim(e)}`);
  }
}

export {
  calculateChecksum,
  compareSFV,
  detectHash,
  getDate,
  getLongestString,
  isSupportedAlgorithm,
  parseSFV,
  printTitle,
  readSFV,
  setComment,
  stripComments,
  softThrow,
  writeSFV
};
