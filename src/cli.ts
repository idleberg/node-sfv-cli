import meta from '../package.json';

import {
  compareSFV,
  getSFVLine,
  printTitle,
  setComment,
  writeSFV
} from './util.js';

import program from 'commander';

program
  .version(meta.version)
  .description(meta.description)
  .arguments('[options] <file ...>')
  .usage('[options] <file ...>')
  .option('-f, --fail-fast', 'aborts verifying after first mismatch', false)
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

    const sfvFiles = files.filter(file => file.endsWith('.sfv'));

    if (files.length && files.length === sfvFiles.length) {
      return await validationMode();
    } else {
      return await creationMode();
    }
  } else {
    program.help();
  }
})();

async function creationMode() {
  let sfvFile = await getSFVLine(files, program.print, program.failFast);

  sfvFile.unshift(setComment(program.winsfv));
  sfvFile = sfvFile.filter(line => line);

  const outputString = program.sortx
    ? sfvFile.sort().join(lineBreak)
    : sfvFile.join(lineBreak);

  if (!program.print) {
    if (program.output) {
      await writeSFV(program.output, outputString);
    }

    console.timeEnd(completedIn);
  } else {
    console.log(outputString);
  }
}

async function validationMode() {
  try {
    await compareSFV(files, program.failFast);
  } catch (e) {
    console.error(`\n🔥 Failing fast due to mismatch`);
    process.exit();
  }

  return console.timeEnd(completedIn);
}
