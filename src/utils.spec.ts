import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fileExists, getVersion, parseSFV, separateFiles, stripComments, truncate, writeSFV } from './utils.ts';

describe('fileExists', () => {
	const testFile = join(process.cwd(), 'test-file-exists.tmp');

	beforeEach(() => {
		// Create a test file
		writeFileSync(testFile, 'test content');
	});

	afterEach(() => {
		// Clean up
		try {
			rmSync(testFile);
		} catch {
			// Ignore if file doesn't exist
		}
	});

	it('should return true for existing file', async () => {
		const exists = await fileExists(testFile);
		expect(exists).toBe(true);
	});

	it('should return false for non-existing file', async () => {
		const exists = await fileExists('/non/existent/file.txt');
		expect(exists).toBe(false);
	});
});

describe('getVersion', () => {
	it('should return version from package.json', async () => {
		const version = await getVersion();

		expect(version).toMatch(/^\d+\.\d+\.\d+/);
	});

	it('should return a string', async () => {
		const version = await getVersion();

		expect(typeof version).toBe('string');
	});
});

describe('parseSFV', () => {
	it('should parse valid SFV content', () => {
		const input = 'file1.txt 12345678\nfile2.txt ABCDEF12';
		const result = parseSFV('/path/to/test.sfv', input);

		expect(result).toHaveLength(2);
		expect(result[0]).toEqual({ file: '/path/to/file1.txt', checksum: '12345678' });
		expect(result[1]).toEqual({ file: '/path/to/file2.txt', checksum: 'ABCDEF12' });
	});

	it('should handle paths with spaces', () => {
		const input = 'my file.txt 12345678';
		const result = parseSFV('/path/to/test.sfv', input);

		expect(result).toHaveLength(1);
		expect(result[0]?.file).toBe('/path/to/my file.txt');
	});

	it('should skip invalid lines', () => {
		const input = 'valid.txt 12345678\ninvalid line\nanother.txt ABCD1234';
		const result = parseSFV('/path/to/test.sfv', input);

		expect(result).toHaveLength(2);
		expect(result[0]?.file).toBe('/path/to/valid.txt');
		expect(result[1]?.file).toBe('/path/to/another.txt');
	});

	it('should handle empty input', () => {
		const result = parseSFV('/path/to/test.sfv', '');
		expect(result).toEqual([]);
	});

	it('should handle input with only whitespace', () => {
		const result = parseSFV('/path/to/test.sfv', '   \n  \n  ');
		expect(result).toEqual([]);
	});

	it('should reject checksums not exactly 8 characters', () => {
		const input = 'file1.txt 1234567\nfile2.txt 123456789';
		const result = parseSFV('/path/to/test.sfv', input);

		expect(result).toEqual([]);
	});

	it('should trim whitespace from lines', () => {
		const input = '  file.txt 12345678  \n\t another.txt ABCD1234\t';
		const result = parseSFV('/path/to/test.sfv', input);

		expect(result).toHaveLength(2);
		expect(result[0]?.file).toBe('/path/to/file.txt');
	});

	it('should resolve relative paths correctly', () => {
		const input = 'subdir/file.txt 12345678\n./another.txt ABCD1234\n../parent.txt 11111111';
		const result = parseSFV('/home/user/downloads/test.sfv', input);

		expect(result).toHaveLength(3);
		expect(result[0]?.file).toBe('/home/user/downloads/subdir/file.txt');
		expect(result[1]?.file).toBe('/home/user/downloads/another.txt');
		expect(result[2]?.file).toBe('/home/user/parent.txt');
	});
});

describe('separateFiles', () => {
	it('should separate .sfv files from other files', () => {
		const files = ['file1.txt', 'archive.sfv', 'file2.mkv', 'another.sfv'];
		const [sfvFiles, otherFiles] = separateFiles(files);

		expect(sfvFiles).toEqual(['archive.sfv', 'another.sfv']);
		expect(otherFiles).toEqual(['file1.txt', 'file2.mkv']);
	});

	it('should handle empty array', () => {
		const [sfvFiles, otherFiles] = separateFiles([]);

		expect(sfvFiles).toEqual([]);
		expect(otherFiles).toEqual([]);
	});

	it('should handle only .sfv files', () => {
		const files = ['archive1.sfv', 'archive2.sfv'];
		const [sfvFiles, otherFiles] = separateFiles(files);

		expect(sfvFiles).toEqual(['archive1.sfv', 'archive2.sfv']);
		expect(otherFiles).toEqual([]);
	});

	it('should handle only non-.sfv files', () => {
		const files = ['file1.txt', 'file2.mkv'];
		const [sfvFiles, otherFiles] = separateFiles(files);

		expect(sfvFiles).toEqual([]);
		expect(otherFiles).toEqual(['file1.txt', 'file2.mkv']);
	});

	it('should be case-sensitive', () => {
		const files = ['archive.SFV', 'archive.Sfv', 'archive.sfv'];
		const [sfvFiles, otherFiles] = separateFiles(files);

		expect(sfvFiles).toEqual(['archive.sfv']);
		expect(otherFiles).toEqual(['archive.SFV', 'archive.Sfv']);
	});
});

describe('stripComments', () => {
	it('should remove lines starting with semicolon', () => {
		const lines = ['; This is a comment', 'file.txt 12345678', '; Another comment'];
		const result = stripComments(lines);

		expect(result).toEqual(['file.txt 12345678']);
	});

	it('should handle lines with leading whitespace', () => {
		const lines = ['  ; Comment with spaces', 'file.txt 12345678', '\t; Tab comment'];
		const result = stripComments(lines);

		expect(result).toEqual(['file.txt 12345678']);
	});

	it('should keep lines with semicolons not at the start', () => {
		const lines = ['file;name.txt 12345678', '; Real comment'];
		const result = stripComments(lines);

		expect(result).toEqual(['file;name.txt 12345678']);
	});

	it('should handle empty array', () => {
		const result = stripComments([]);
		expect(result).toEqual([]);
	});

	it('should keep empty lines', () => {
		const lines = ['', 'file.txt 12345678', ''];
		const result = stripComments(lines);

		expect(result).toEqual(['', 'file.txt 12345678', '']);
	});
});

describe('truncate', () => {
	it('should truncate to 3 decimal places', () => {
		expect(truncate(1.23456789)).toBe(1.234);
		expect(truncate(5.6789)).toBe(5.678);
	});

	it('should handle whole numbers', () => {
		expect(truncate(42)).toBe(42);
		expect(truncate(0)).toBe(0);
	});

	it('should handle negative numbers', () => {
		expect(truncate(-1.23456)).toBe(-1.234);
		expect(truncate(-0.9999)).toBe(-0.999);
	});

	it('should handle numbers with fewer than 3 decimal places', () => {
		expect(truncate(1.2)).toBe(1.2);
		expect(truncate(3.45)).toBe(3.45);
	});

	it('should truncate, not round', () => {
		expect(truncate(1.9999)).toBe(1.999);
		expect(truncate(2.5555)).toBe(2.555);
	});
});

describe('writeSFV', () => {
	const testOutputFile = join(process.cwd(), 'test-output.sfv');

	afterEach(() => {
		try {
			rmSync(testOutputFile);
		} catch {
			// Ignore if file doesn't exist
		}
	});

	it('should write SFV file with proper formatting', async () => {
		const files = [
			{ file: 'file1.txt', checksum: '12345678' },
			{ file: 'file2.txt', checksum: 'ABCDEF12' },
		];

		await writeSFV(testOutputFile, files);

		const exists = await fileExists(testOutputFile);
		expect(exists).toBe(true);
	});

	it('should align checksums when files have different lengths', async () => {
		const files = [
			{ file: 'a.txt', checksum: '12345678' },
			{ file: 'very-long-filename.txt', checksum: 'ABCDEF12' },
		];

		await writeSFV(testOutputFile, files);

		const exists = await fileExists(testOutputFile);
		expect(exists).toBe(true);
	});

	it('should handle empty files array', async () => {
		await writeSFV(testOutputFile, []);

		const exists = await fileExists(testOutputFile);
		expect(exists).toBe(true);
	});
});
