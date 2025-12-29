import { handleCli } from './cli.ts';
import { calculate, verify } from './crc32.ts';
import { logger } from './log.ts';
import { getVersion, separateFiles, writeSFV } from './utils.ts';

async function main() {
	const { args, options } = await handleCli();
	const [sfvFiles, otherFiles] = separateFiles(args);

	const startTime = performance.now();

	const version = await getVersion();
	logger.log(`node-sfv v${version}`);

	if (sfvFiles?.length) {
		await verify(sfvFiles);
	}

	if (otherFiles?.length) {
		const results = await calculate(otherFiles);

		if (options.outfile) {
			await writeSFV(options.outfile, results);
		}
	}

	const endTime = performance.now();
	const duration = (endTime - startTime).toFixed(2);

	logger.log(`\n✨ Completed in ${duration}ms`);
}

await main();
