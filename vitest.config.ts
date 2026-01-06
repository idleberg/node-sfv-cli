import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['e2e/*.spec.ts', 'src/*.spec.ts'],
		coverage: {
			exclude: ['src/index.ts', 'e2e/*'],
			include: ['src/*.ts'],
		},
		// Hide all CLI output in tests
		onConsoleLog: () => false,
	},
});
