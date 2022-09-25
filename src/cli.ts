import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promises as fs } from 'node:fs';
import glob from 'globby';
import program from 'commander';

import {
	compareSFV,
	calculateChecksum,
	printTitle,
	setComment,
	softThrow,
	writeSFV
} from './util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { description, version } = JSON.parse(
	await fs.readFile(resolve(__dirname, '../package.json'), 'utf8')
);

program
	.version(version)
	.description(description)
	.arguments('[options] <file ...>')
	.usage('[options] <file ...>')
	.option('-a, --algorithm [algorithm]', 'specifies hashing algorithm')
	.option('-c, --comment <string>', 'adds custom comment to output')
	.option('-F, --fail-fast', 'stops execution after first error', false)
	.option('-f, --format', 'aligns checksums', false)
	.option('-o, --output <file>', 'specifies output file')
	.option('-p, --print', 'prints SFV file to stdout', false)
	.option('-s, --sort', 'sorts output', false)
	.option('-w, --winsfv', 'enables WinSFV compatibility', false)
	.parse(process.argv);

const completedIn = '\n✨ Completed in';
const lineBreak = program.winsfv
	? '\r\n'
	: '\n';

const files = await glob(program.args);

if (files.length) {
	if (!program.print) printTitle();

	const sfvFiles = files.filter(file => file.endsWith('.sfv') || file.endsWith('.sfvx'));
	const otherFiles = files.filter(file => !file.endsWith('.sfv') && !file.endsWith('.sfvx'));

	if (sfvFiles.length) {
		await validationMode(files);
	}

	if (otherFiles.length) {
		await creationMode(otherFiles);
	}
} else {
	program.help();
}

async function creationMode(files) {
	if (!program.print) console.time(completedIn)

	if (program.algorithm && program.winsfv) softThrow('The algorithm and WinSFV flags can\'t be combined', true);
	if (program.comment && program.winsfv) softThrow('The comment and WinSFV flags can\'t be combined', true);

	const algorithm = program.algorithm
	? program.algorithm
	: 'crc32';

	const options = {
		algorithm: algorithm === true ? 'sha1' : algorithm || 'crc32',
		comment: program.comment || '',
		failFast: program.failFast,
		format: program.format,
		print: program.print
	};

	const sfvFile = (await calculateChecksum(files, options)).filter(item => item);

	if (!sfvFile.length) softThrow('Aborting, empty SFV file', true);

	sfvFile.unshift(setComment({comment: program.comment, winsfv: program.winsfv}));

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

async function validationMode(files) {
	if (!program.print) console.time(completedIn)

	try {
		await compareSFV(files, program.failFast);
	} catch (e) {
		softThrow('Failing fast due to mismatch');
	}

	return console.timeEnd(completedIn);
}
