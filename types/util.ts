interface CalculateOptions {
  algorithm: string;
  failFast: boolean;
  print: boolean;
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

export {
  CalculateOptions,
  DateObject,
  SFVObject
}
