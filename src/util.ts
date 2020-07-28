import meta from '../package.json';

import { createReadStream, promises as fs } from 'fs';
import crc32 from 'buffer-crc32';
import cyclic32 from 'cyclic-32';
import ora from 'ora';
import terminalLink from 'terminal-link';
import chalk from 'chalk';

import { DateObject, SFVObject } from '../types/util';

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

async function checksumFromStream(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe( cyclic32.createHash() )
      .on('error', (err) => reject(err))
      .on('data', buffer => resolve(buffer.toString('hex').toUpperCase()));
  });
}

async function checksumFromBuffer(inputStream: Buffer): Promise<string> {
  const checksum = crc32(inputStream);

  if (!isValidChecksum(checksum)) {
    throw Error('Not a valid checksum');
  }

  return bufferToString(checksum);
}

async function checksumFromFile(inputFile: string): Promise<string> {
  const fileBuffer = await fs.readFile(inputFile);

  return checksumFromBuffer(fileBuffer);
}

async function compareSFV(files: string[], failFast = false): Promise<void> {
  await Promise.all( files.map(async file => {

    const sfvFile = await readSFV(file);

    console.log('Verifying files:');

    await Promise.all(sfvFile.map(async ({file, crc32}) => {
      const spinner = ora(file).start();
      const actualCRC = await checksumFromFile(file);

      if (crc32 === actualCRC) {
        spinner.succeed(`${file} ${chalk.blue(crc32)}`);
      } else {
        spinner.fail(`${file} ${chalk.red(crc32)} (actual: ${chalk.blue(actualCRC)})`);

        if (failFast) throw 'Failing fast';
      }
    }));
  }));
}

async function createSFV(files: string[], printOutput: boolean): Promise<string[]> {
  if (!printOutput) {
    const checksum = (files.length === 1)
      ? 'checksum'
      : 'checksums';

    console.log(`Calculating ${checksum}:`);
  }

  return await Promise.all(files.map( async file => {
    let spinner;
    let checksum;

    if (!printOutput) {
      spinner = ora(`${file}`).start();
    }

    try {
      checksum = await checksumFromStream(file);
      if (!printOutput) spinner.succeed(`${file} ${chalk.blue(checksum)}`);
    } catch (e) {
      if (!printOutput) spinner.fail(`${file} ${chalk.dim(e)}`);
    }

    return `${file} ${checksum}`;
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

function isValidChecksum(checksum: Buffer): boolean {
  return Buffer.isBuffer(checksum) && checksum.length === 4;
}

function parseSFV(input: string | string[]): SFVObject[] {
  const lines = Array.isArray(input)
    ? stripComments(input)
    : stripComments(input.split('\n'));

  return lines.map(line => {
    const [file, crc32] = line
      .trim()
      .split(/^(.*)\s+(\w{8})$/g)
      .filter(item => item);

    return file && crc32
      ? {
        file,
        crc32
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

  console.log(`${linkedTitle}\n`);
}

async function readSFV(filePath: string): Promise<SFVObject[]> {
  const fileContents = (await fs.readFile(filePath)).toString();

  return parseSFV(fileContents.toString());
}

function setComment(useWinSFV: boolean): string {
  const {
    year, month, day,
    hours, minutes, seconds
  } = getDate();

  return useWinSFV
    ? `; Generated by WIN-SFV32 v1.1a on ${year}-${month}-${day} at ${hours}:${minutes}.${seconds}\n;`
    : `; ${meta.name} v${meta.version} | ${meta.homepage}\n;`;
}

function stripComments(lines: string[]): string[] {
  return lines.filter(line =>
    !line
      .trim()
      .startsWith(';')
  )
}

async function writeSFV(fileName: string, fileContents: string): Promise<void> {
  const outputFile = fileName.endsWith('.sfv')
    ? fileName
    : `${fileName}.sfv`;

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
  compareSFV,
  checksumFromBuffer,
  checksumFromFile,
  checksumFromStream,
  createSFV,
  getDate,
  isValidChecksum,
  parseSFV,
  printTitle,
  readSFV,
  setComment,
  stripComments,
  writeSFV
};
