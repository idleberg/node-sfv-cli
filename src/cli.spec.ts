import { afterEach, describe, expect, it } from 'vitest';
import { handleCli } from './cli.ts';

describe('handleCli', () => {
	const originalArgv = process.argv;

	afterEach(() => {
		process.argv = originalArgv;
	});

	it('should parse single file argument', async () => {
		process.argv = ['node', 'cli.js', 'test.txt'];

		const { args, options } = await handleCli();

		expect(args).toEqual(['test.txt']);
		expect(options).toBeDefined();
	});

	it('should parse multiple file arguments', async () => {
		process.argv = ['node', 'cli.js', 'file1.txt', 'file2.mkv', 'file3.sfv'];

		const { args } = await handleCli();

		expect(args).toEqual(['file1.txt', 'file2.mkv', 'file3.sfv']);
	});

	it('should parse --outfile option', async () => {
		process.argv = ['node', 'cli.js', 'test.txt', '--outfile', 'output.sfv'];

		const { args, options } = await handleCli();

		expect(args).toEqual(['test.txt']);
		expect(options.outfile).toBe('output.sfv');
	});

	it('should parse -o short option', async () => {
		process.argv = ['node', 'cli.js', 'test.txt', '-o', 'output.sfv'];

		const { args: _, options } = await handleCli();

		expect(options.outfile).toBe('output.sfv');
	});

	it('should handle multiple files with output option', async () => {
		process.argv = ['node', 'cli.js', 'file1.txt', 'file2.txt', '-o', 'checksums.sfv'];

		const { args, options } = await handleCli();

		expect(args).toEqual(['file1.txt', 'file2.txt']);
		expect(options.outfile).toBe('checksums.sfv');
	});

	it('should handle files with spaces in names', async () => {
		process.argv = ['node', 'cli.js', 'my file.txt', 'another file.mkv'];

		const { args } = await handleCli();

		expect(args).toContain('my file.txt');
		expect(args).toContain('another file.mkv');
	});

	it('should handle paths with special characters', async () => {
		process.argv = ['node', 'cli.js', './path/to/file.txt', '../parent/file.sfv'];

		const { args } = await handleCli();

		expect(args).toEqual(['./path/to/file.txt', '../parent/file.sfv']);
	});

	it('should default outfile to false when not provided', async () => {
		process.argv = ['node', 'cli.js', 'test.txt'];

		const { options } = await handleCli();

		expect(options.outfile).toBe(false);
	});
});
