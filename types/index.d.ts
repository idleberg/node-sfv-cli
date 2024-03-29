declare module '*.json' {
	const value: any;
	export default value;
}

interface FlagOptions {
	algorithm?: string;
	comment?: string;
	failFast?: boolean;
	format?: boolean;
	print?: boolean;
	output?: string;
	sort?: string;
	winsfv?: boolean;
}

interface DateObject {
	year: string;
	month: string;
	day: string;
	hours: string;
	minutes: string;
	seconds: string;
}

interface SFVObject {
	checksum: string;
	file: string;
}
