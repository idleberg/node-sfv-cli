import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
	const isProduction = options.watch !== true;

	return {
		target: 'node20',
		clean: isProduction,
		dts: isProduction,
		define: {
			'import.meta.WORKER_URL': JSON.stringify('./worker.mjs'),
		},
		entry: {
			cli: 'src/index.ts',
			worker: 'src/worker.ts',
		},
		external: [
			// ensure we always read the current version from the manifests
			'../deno.json',
			'../package.json',
		],
		format: ['esm'],
		minify: isProduction,
		outDir: 'bin',
	};
});
