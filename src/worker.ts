import { fromFile } from 'simple-file-verification';

export default async ({ file }: { file: string }) => {
	const startTime = performance.now();
	const fileHash = await fromFile(file);
	const endTime = performance.now();

	return {
		checksum: fileHash,
		duration: (endTime - startTime).toFixed(2),
	};
};
