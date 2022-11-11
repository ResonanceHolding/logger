'use strict';

class Logger {
  constructor() {
    this.debugLevel = [];
    this.init();
  }

  init(debugLevel = 'all') {
    switch (debugLevel.toLowerCase()) {
      case 'error':
        this.debugLevel = ['error'];
        break;

      case 'info':
        this.debugLevel = ['error', 'info'];
        break;

      case 'debug':
        this.debugLevel = ['error', 'info', 'debug'];
        break;

      default:
        this.debugLevel = ['error', 'info', 'debug', 'log'];
        break;
    }
  }

  now() {
    const format = (num, count = 2) => {
      if (count === 2) return num > 9 ? `${num}` : `0${num}`;
      const len = num.toString().length;
      return `${'0'.repeat(count - len)}${num}`;
    };
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = format(date.getUTCMonth() + 1, 2);
    const day = format(date.getUTCDate(), 2);
    const hour = format(date.getUTCHours(), 2);
    const minute = format(date.getUTCMinutes(), 2);
    const second = format(date.getUTCSeconds(), 2);
    const millisecond = format(date.getUTCMilliseconds(), 3);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}:${millisecond}`;
  }

  log(...args) {
    if (this.debugLevel.includes('log'))
      console.log(`${this.now()} -> log -> `, ...args);
  }

  err(...args) {
    if (this.debugLevel.includes('error'))
      console.log(
        '\x1b[41m\x1b[37m%s -> error ->\x1b[0m \x1b[31m%s\x1b[0m',
        `${this.now()}`,
        ...args
      );
  }

  info(...args) {
    if (this.debugLevel.includes('info'))
      console.log(
        '\x1b[44m\x1b[37m%s -> info ->\x1b[0m \x1b[34m%s\x1b[0m',
        `${this.now()}`,
        ...args
      );
  }

  debug(...args) {
    if (this.debugLevel.includes('debug'))
      console.log(
        '\x1b[42m\x1b[37m%s -> debug ->\x1b[0m \x1b[32m%s\x1b[0m',
        `${this.now()}`,
        ...args
      );
  }
}

module.exports = new Logger();
