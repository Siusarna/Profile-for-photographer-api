export default class ParseConfig {
  static parseTime (time: string) {
    let result: number;
    if (time.includes('m')) {
      result = Number(time.slice(0, time.length - 1)) * 60 * 1000; // minute convert to milisecond
    } else if (time.includes('s')) {
      result = Number(time.slice(0, time.length - 1)) * 1000; // second convert to milisecond
    }
    return result;
  }
}
