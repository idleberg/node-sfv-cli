import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import workerFunction from './worker.ts';

describe('worker', () => {
	const testDir = join(process.cwd(), 'test-worker');
	const testFile = join(testDir, 'test.txt');

	beforeEach(() => {
		mkdirSync(testDir, { recursive: true });
	});

	afterEach(() => {
		try {
			rmSync(testDir, { recursive: true });
		} catch {}
	});

	it('should calculate CRC32 checksum for a file', async () => {
		writeFileSync(testFile, 'Hello World');

		const result = await workerFunction({ file: testFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/i);
		expect(result.checksum).toBe('4A17B156'); // Known CRC32 for "Hello World"
	});

	it('should return checksum in uppercase hex format', async () => {
		writeFileSync(testFile, 'test content');

		const result = await workerFunction({ file: testFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
		expect(result.checksum).toBe(result.checksum.toUpperCase());
	});

	it('should measure and return duration', async () => {
		writeFileSync(testFile, 'test');

		const result = await workerFunction({ file: testFile });

		expect(result.duration).toBeDefined();
		expect(typeof result.duration).toBe('string');
		expect(Number.parseFloat(result.duration)).toBeGreaterThanOrEqual(0);
	});

	it('should format duration with 2 decimal places', async () => {
		writeFileSync(testFile, 'test');

		const result = await workerFunction({ file: testFile });

		expect(result.duration).toMatch(/^\d+\.\d{2}$/);
	});

	it('should handle empty files', async () => {
		writeFileSync(testFile, '');

		const result = await workerFunction({ file: testFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
		expect(result.checksum).toBe('00000000'); // CRC32 of empty file
	});

	it('should handle binary files', async () => {
		const binaryData = Buffer.from([0x00, 0xff, 0xaa, 0x55]);
		writeFileSync(testFile, binaryData);

		const result = await workerFunction({ file: testFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
	});

	it('should produce consistent checksums for same content', async () => {
		const content = 'Consistent content test';
		writeFileSync(testFile, content);

		const result1 = await workerFunction({ file: testFile });
		const result2 = await workerFunction({ file: testFile });

		expect(result1.checksum).toBe(result2.checksum);
	});

	it('should produce different checksums for different content', async () => {
		writeFileSync(testFile, 'content A');
		const result1 = await workerFunction({ file: testFile });

		writeFileSync(testFile, 'content B');
		const result2 = await workerFunction({ file: testFile });

		expect(result1.checksum).not.toBe(result2.checksum);
	});

	it('should handle large files efficiently', async () => {
		// Create a 1MB file
		const largeContent = Buffer.alloc(1024 * 1024, 'x');
		writeFileSync(testFile, largeContent);

		const startTime = performance.now();
		const result = await workerFunction({ file: testFile });
		const endTime = performance.now();

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
		expect(Number.parseFloat(result.duration)).toBeLessThan(5000); // Should complete in < 5s
		expect(endTime - startTime).toBeLessThan(5000);
	});

	it('should throw error for non-existent file', async () => {
		await expect(workerFunction({ file: '/path/to/nonexistent.txt' })).rejects.toThrow();
	});

	it('should handle files with unicode content', async () => {
		writeFileSync(testFile, '你好世界 🌍 Привет мир');

		const result = await workerFunction({ file: testFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
	});

	it('should handle files with special names', async () => {
		const specialFile = join(testDir, 'file with spaces & special!.txt');
		writeFileSync(specialFile, 'content');

		const result = await workerFunction({ file: specialFile });

		expect(result.checksum).toMatch(/^[A-F0-9]{8}$/);
	});

	describe('known test vectors', () => {
		it('should match CRC32 for "123456789"', async () => {
			writeFileSync(testFile, '123456789');

			const result = await workerFunction({ file: testFile });

			// Standard CRC32 test vector
			expect(result.checksum).toBe('CBF43926');
		});

		it('should match CRC32 for "The quick brown fox jumps over the lazy dog"', async () => {
			writeFileSync(testFile, 'The quick brown fox jumps over the lazy dog');

			const result = await workerFunction({ file: testFile });

			expect(result.checksum).toBe('414FA339');
		});
	});

	describe('performance characteristics', () => {
		it('should include processing time in duration', async () => {
			writeFileSync(testFile, 'test');

			const result = await workerFunction({ file: testFile });
			const duration = Number.parseFloat(result.duration);

			// Duration should be a reasonable positive number
			expect(duration).toBeGreaterThan(0);
			expect(duration).toBeLessThan(1000); // Should be < 1 second for small file
		});

		it('should report accurate timing', async () => {
			const content = Buffer.alloc(100 * 1024, 'x'); // 100KB
			writeFileSync(testFile, content);

			const externalStart = performance.now();
			const result = await workerFunction({ file: testFile });
			const externalEnd = performance.now();

			const reportedDuration = Number.parseFloat(result.duration);
			const actualDuration = externalEnd - externalStart;

			// Reported duration should be close to actual (within 50ms overhead)
			expect(reportedDuration).toBeLessThanOrEqual(actualDuration + 50);
			expect(reportedDuration).toBeGreaterThan(0);
		});
	});
});
