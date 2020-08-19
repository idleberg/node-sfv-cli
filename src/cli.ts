import meta from '../package.json';

import {
  compareSFV,
  calculateChecksum,
  printTitle,
  setComment,
  softThrow,
  writeSFV
} from './util.js';

import program from 'commander';

program
  .version(meta.version)
  .description(meta.description)
  .arguments('[options] <file ...>')
  .usage('[options] <file ...>')
  .option('-a, --algorithm [algorithm]', 'specifies hashing algorithm')
  .option('-F, --fail-fast', 'stops execution after first error', false)
  .option('-o, --output <file>', 'specifies output file')
  .option('-p, --print', 'prints SFV file to stdout', false)
  .option('-s, --sort', 'sorts output', false)
  .option('-w, --winsfv', 'enables WinSFV compatibility', false)
  .parse(process.argv);

const completedIn = '\n✨ Completed in';
const lineBreak = program.winsfv
  ? '\r\n'
  : '\n';
const files = program.args;

(async () => {
  if (!program.print) console.time(completedIn)

  if (files.length) {
    if (!program.print) printTitle();

    const sfvFiles = files.filter(file => file.endsWith('.sfv') || file.endsWith('.sfvx'));

    if (sfvFiles.length) {
      return await validationMode();
    } else {
      return await creationMode();
    }
  } else {
    program.help();
  }
})();

async function creationMode() {
  if (program.algorithm && program.winsfv) softThrow('The algorithm and WinSFV options can\'t be combined', true);

  const algorithm = program.algorithm
  ? program.algorithm
  : 'crc32';

  const options = {
    algorithm: algorithm === true ? 'sha1' : algorithm || 'crc32',
    failFast: program.failFast,
    print: program.print
  };

  let sfvFile = (await calculateChecksum(files, options)).filter(item => item);

  if (!sfvFile.length) softThrow('Aborting, empty SFV file', true);

  sfvFile.unshift(setComment(program.winsfv));
  sfvFile = sfvFile.filter(line => line);

  const outputString = program.sort
    ? sfvFile.sort().join(lineBreak)
    : sfvFile.join(lineBreak);

  if (program.output) {
    const writeOptions: FlagOptions = {
      algorithm,
      print: program.print
    }

    await writeSFV(program.output, outputString, writeOptions);
  }

  if (!program.print) {
    console.timeEnd(completedIn);
  } else {
    console.log(outputString);
  }
}

async function validationMode() {
  try {
    await compareSFV(files, program.failFast);
  } catch (e) {
    softThrow('Failing fast due to mismatch');
  }

  return console.timeEnd(completedIn);
}
