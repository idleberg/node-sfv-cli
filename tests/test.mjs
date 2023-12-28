import { execa } from 'execa';
import { hash } from 'hasha';
import { promises as fs, constants} from 'node:fs';
import { resolve } from 'node:path';
import { rimraf } from 'rimraf';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import which from 'which';

const CLI_SCRIPT = resolve(process.cwd(), 'bin/cli.js')

async function fileExists(filePath) {
	try {
		await fs.access(filePath, constants.F_OK);
	} catch (error) {
		return false;
	}

	return true;
}

// Tests
test('cksfv is installed', async () => {

	const ckSfvPath = await which('cksfv');

	const actual = ckSfvPath && await fileExists(ckSfvPath);
	const expected = true;

	if (!actual) {
		console.log('Make sure cksfv is installed and in your PATH environment variable');
	}

	assert.is(actual, expected);
});

test('CRC32: Read', async () => {
	const outName = await hash(String(Date.now()))

	await execa('node', [CLI_SCRIPT, 'screenshot.png', '-o', `${outName}.sfv`]);
	const ckSFV = (await execa('cksfv', ['-g', `${outName}.sfv`]));
	await rimraf(`${outName}.sfv`);

	const actual = ckSFV.exitCode;
	const expected = 0;

	assert.is(actual, expected);
});

test('CRC32: Write', async () => {
	const nodeSFV = (await execa('node', [CLI_SCRIPT, '-p', 'screenshot.png']));
	const ckSFV = (await execa('cksfv', ['-c', 'screenshot.png']));

	const actual = nodeSFV.stdout.trim().slice(-8);
	const expected = ckSFV.stdout.trim().slice(-8);

	assert.is(actual, expected);
});

test('MD5: Write', async () => {
	const md5sum = (await execa('md5sum', ['screenshot.png']));
	const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'md5', '-p', 'screenshot.png']));

	const actual = nodeSFV.stdout.trim().slice(-32);
	const expected = md5sum.stdout.trim().slice(0, 32).toUpperCase();

	assert.is(actual, expected);
});

test('SHA-1: Write', async () => {
	const sha1sum = (await execa('sha1sum', ['screenshot.png']));
	const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha1', '-p', 'screenshot.png']));

	const actual = nodeSFV.stdout.trim().slice(-40);
	const expected = sha1sum.stdout.trim().slice(0, 40).toUpperCase();

	assert.is(actual, expected);
});

test('SHA-256: Write', async () => {
	const sha256sum = (await execa('sha256sum', ['screenshot.png']));
	const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha256', '-p', 'screenshot.png']));

	const actual = nodeSFV.stdout.trim().slice(-64);
	const expected = sha256sum.stdout.trim().slice(0, 64).toUpperCase();

	assert.is(actual, expected);
});

test('SHA-512: Write', async () => {
	const sha512sum = (await execa('sha512sum', ['screenshot.png']));
	const nodeSFV = (await execa('node', [CLI_SCRIPT, '-a', 'sha512', '-p', 'screenshot.png']));

	const actual = nodeSFV.stdout.trim().slice(-128);
	const expected = sha512sum.stdout.trim().slice(0, 128).toUpperCase();

	assert.is(actual, expected);
});

test.run();
