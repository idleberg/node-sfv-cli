import meta from '../package.json';

import {
  checksumFromBuffer,
  compareSFV,
  createChecksum,
  printTitle,
  setComment,
  writeSFV
} from './util.js';

import chalk from 'chalk';
import getStdin from 'get-stdin';
import ora from 'ora';
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
  .option('-w, --winsfv', 'writes WinSFV compatible comment', false)
  .parse(process.argv);

(async () => {
  const completedIn = '\n✨ Completed in';
  const lineBreak = program.winsfv
    ? '\r\n'
    : '\n';

  if (!program.print) console.time(completedIn)

  const stdIn = await getStdin.buffer();
  const files = program.args;

  if (!files.length && !stdIn.length) {
    return program.help();
  }

  if (files.length > 0) {
    if (!program.print) printTitle();

    const sfvFiles = files.filter(file => file.endsWith('.sfv'));

    if (files.length && files.length === sfvFiles.length) {
      try {
        await compareSFV(files, program.failFast);
      } catch (e) {
        console.error(`${lineBreak}🔥 Aborting due to mismatch`);
        process.exit();
      }

      return console.timeEnd(completedIn);
    } else {
      let sfvFile = await createChecksum(files, program.print);

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

  } else if (stdIn.length > 0) {
    printTitle();

    const spinner = ora('<stdin>').start();
    const checksum = await checksumFromBuffer(stdIn);

    spinner.succeed(`<stdin> ${chalk.blue(checksum)}`);

    return console.timeEnd(completedIn);
  }
})();
