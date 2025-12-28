import { access, constants, writeFile } from 'node:fs/promises';
import { normalize as normalizePath } from 'node:path';
import { logger } from './log.ts';
import type { SFVObject } from './types.js';

const REGEX_SFV_LINE = /^(.*)\s+(\w{8})$/g;

export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await access(filePath, constants.F_OK);
	} catch {
		return false;
	}

	return true;
}

/**
 * Loads version from package manifest.
 * @internal
 */
export async function getVersion(): Promise<string> {
	const module = await import('../package.json', {
		with: { type: 'json' },
	});

	return module.default.version ?? 'development';
}

export function parseSFV(input: string): SFVObject[] {
	const lines = input.split('\n');
	const sfvArray = [] as SFVObject[];

	for (const line of lines) {
		const [file, checksum] = line.trim().split(REGEX_SFV_LINE).filter(Boolean);

		if (file && checksum) {
			sfvArray.push({
				file: normalizePath(file.trim()),
				checksum,
			});
		}
	}

	return sfvArray;
}

export function separateFiles(files: string[]) {
	const sfvFiles: string[] = [];
	const otherFiles: string[] = [];

	for (const file of files) {
		if (file.endsWith('.sfv')) {
			sfvFiles.push(file);
		} else {
			otherFiles.push(file);
		}
	}

	return [sfvFiles, otherFiles];
}

export function stripComments(lines: string[]): string[] {
	return lines.filter((line) => !line.trim().startsWith(';'));
}

export function truncate(num: number): number {
	return Math.trunc(num * 1_000) / 1_000;
}

export async function writeSFV(outFile: string, files: SFVObject[]) {
	const contents = generateSFV(files);

	try {
		await writeFile(outFile, contents, 'utf-8');
	} catch {
		logger.error(`Failed to write file "${outFile}"`);
		return;
	}

	logger.success(`Write output file "${outFile}"`);
}

function generateSFV(entries: SFVObject[]) {
	const longestString = getLongestString(entries.map((item) => item.file));
	const output: string[] = [];

	for (const { file, checksum } of entries) {
		output.push(`${file}${' '.repeat(longestString - file.length + 1)}${checksum}`);
	}

	return output.join('\n');
}

function getLongestString(input: string[]): number {
	return Math.max(...input.map((x) => x.length));
}
