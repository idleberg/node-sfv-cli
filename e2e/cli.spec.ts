import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { execa } from 'execa';
import { rimraf } from 'rimraf';
import stripAnsi from 'strip-ansi';
import { beforeAll, describe, expect, it } from 'vitest';
import which from 'which';

const CLI_SCRIPT = resolve(process.cwd(), 'bin/cli.mjs');

describe('CLI Integration Tests', () => {
	// Abusing the test suite to check for external dependency
	beforeAll(async () => {
		try {
			await which('cksfv');
		} catch {
			throw Error('Make sure cksfv is installed and in your PATH environment variable');
		}
	});

	it('CRC32: Read', async () => {
		const outName = randomUUID();

		await execa('node', [CLI_SCRIPT, 'screenshot.png', '-o', `${outName}.sfv`]);
		const ckSFV = await execa('cksfv', ['-g', `${outName}.sfv`]);
		await rimraf(`${outName}.sfv`);

		expect(ckSFV.exitCode).toBe(0);
	});

	it('CRC32: Write', async () => {
		const nodeSFV = await execa('node', [CLI_SCRIPT, 'screenshot.png']);
		const ckSFV = await execa('cksfv', ['-c', 'screenshot.png']);

		const checksumLine = stripAnsi(nodeSFV.stdout.split('\n')[4] || '');

		const actual = checksumLine.split(' ').at(-2);
		const expected = ckSFV.stdout.trim().slice(-8);

		expect(actual).toBe(expected);
	});
});
