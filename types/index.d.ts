declare module '*.json' {
	// biome-ignore lint/suspicious/noExplicitAny: Not in the domain of this package
	const value: any;
	export default value;
}

export interface FlagOptions {
	algorithm?: string;
	comment?: string;
	failFast?: boolean;
	format?: boolean;
	print?: boolean;
	output?: string;
	sort?: string;
	winsfv?: boolean;
}

export interface DateObject {
	year: string;
	month: string;
	day: string;
	hours: string;
	minutes: string;
	seconds: string;
}

export interface SFVObject {
	checksum: string;
	file: string;
}
