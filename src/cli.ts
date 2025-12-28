import { Command, type OptionValues } from 'commander';
import { logger } from './log.ts';
import { getVersion } from './utils.ts';

/**
 * Handles parsing of CLI arguments.
 * @internal
 */
export async function handleCli() {
	const program = new Command('node-sfv');

	program
		.version(await getVersion())
		.configureOutput({
			writeOut: (message: string) => logger.log(message),
			writeErr: (message: string) => logger.error(message),
		})
		.argument('<file...>', 'files to hash')
		.option('-o, --outfile <file>', 'writes SFV file', false)
		.option('-w, --winsfv', 'enables WinSFV compatibility', false);

	program.parse();

	const args = program.args;
	const options = program.opts();

	logger.debug({ args, options });

	return {
		args,
		options,
	};
}
