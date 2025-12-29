import { readFile } from 'node:fs/promises';
import { normalize, relative } from 'node:path';
import { blue, grey, red } from 'kleur/colors';
import { Listr } from 'listr2';
import { Piscina } from 'piscina';
import { logger } from './log.ts';
import type { SFVObject } from './types.js';
import { fileExists, parseSFV } from './utils.ts';

const WORKER_URL = import.meta.WORKER_URL || './worker.ts';

const piscina = new Piscina({
	filename: new URL(WORKER_URL, import.meta.url).href,
});

export async function calculateChecksums(files: SFVObject[]): Promise<SFVObject[]> {
	const checksums: Array<{ file: string; checksum: string }> = [];

	const normalizedFiles = Array.from(
		new Set(
			files.map(({ checksum, file }) => {
				return {
					file,
					checksum,
				};
			}),
		),
	);

	const tasks = new Listr(
		normalizedFiles.map(({ checksum, file }) => ({
			title: file,
			task: async (_ctx, task) => {
				const result = await piscina.run({ file });

				if (typeof checksum === 'undefined' || checksum === result.checksum) {
					task.title = `${file} ${blue(result.checksum)} ${grey(`${result.duration}ms`)}`;
				} else {
					task.title = `${file} ${red(checksum)} (actual ${blue(result.checksum)}) ${grey(`${result.duration}ms`)}`;
				}

				// TODO handle mismatches in verify mode
				checksums.push({ file, checksum: result.checksum });
			},
		})),
		{ concurrent: true },
	);

	await tasks.run();

	return checksums.sort((a, z) => a.file.localeCompare(z.file));
}

export async function verify(sfvFiles: string[]) {
	for (const sfvFile of sfvFiles) {
		logger.log(`\nVerifying checksums in "${sfvFile}":`);

		if (!(await fileExists(sfvFile))) {
			logger.error('File not found');
			continue;
		}

		const fileContents = await readFile(sfvFile, 'utf-8');
		const parsed = parseSFV(sfvFile, fileContents);

		if (Object.keys(parsed).length === 0) {
			logger.error('File is empty');
			continue;
		}

		await calculateChecksums(parsed);
	}
}

export async function calculate(sfvFiles: string[]): Promise<SFVObject[]> {
	const inputFiles: SFVObject[] = sfvFiles.map((file) => {
		return {
			file,
		};
	});

	logger.log('\nCalculating checksums:');

	return await calculateChecksums(inputFiles);
}
