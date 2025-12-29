import { bgCyan } from 'kleur/colors';
import logSymbols from 'log-symbols';

/**
 * Styles logging messages with colored prefixes.
 * @internal
 */
export const logger = {
	debug: (...args: unknown[]) => {
		if (process.env.NODE_DEBUG) {
			console.log();
			console.debug(bgCyan(' DEBUG '), ...args);
			console.log();
		}
	},
	error: (...args: unknown[]) => console.error(logSymbols.error, ...args),
	info: (...args: unknown[]) => console.info(logSymbols.info, ...args),
	log: (...args: unknown[]) => console.log(...args),
	success: (...args: unknown[]) => console.log(logSymbols.success, ...args),
	warn: (...args: unknown[]) => console.warn(logSymbols.warning, ...args),
};
