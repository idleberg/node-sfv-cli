interface DateObject {
  year: string;
  month: string;
  day: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface SFVObject {
  crc32: string;
  file: string;
}

export {
  DateObject,
  SFVObject
}
