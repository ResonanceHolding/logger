'use strict';

const Sentry = require('@sentry/node');

class Logger {
  #errors = null;

  constructor() {
    this.logLevel = [];
    this.init();
    this.isSentry = false;
    this.#errors = new Map();
    this.errorsLength;
    this.errorsThrottleTime;
  }

  init(logLevel = 'all', sentryConfig = null, throttleParams = { maxLength: 15, delay: 15 }) {
    if (sentryConfig) {
      Sentry.init(sentryConfig);
      this.isSentry = true;
    }

    if (throttleParams) {
      this.errorsLength = throttleParams.maxLength;
      this.errorsThrottleTime = throttleParams.delay;
    }

    switch (logLevel.toLowerCase()) {
      case 'error':
        this.logLevel = ['error'];
        break;

      case 'info':
        this.logLevel = ['error', 'info'];
        break;

      case 'debug':
        this.logLevel = ['error', 'info', 'debug'];
        break;

      default:
        this.logLevel = ['error', 'info', 'debug', 'log'];
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
    if (this.logLevel.includes('log'))
      console.log(`${this.now()} -> log -> `, ...args);
  }

  err(...args) {
    const messagesAmount = this.isThrottledError(args);
    if (!messagesAmount) return;

    const amountString = messagesAmount > 1
      ? ` \x1b[1m\x1b[37m${messagesAmount} times during ${this.errorsThrottleTime}\x1b[41m\x1b[37ms ->`
      : '';

    if (this.isSentry) {
      let msg = messagesAmount > 1
      ? `${messagesAmount} times during ${this.errorsThrottleTime} ->`
      : '';

      Sentry.captureException(msg + JSON.stringify(args, null, 2));
    }

    if (this.logLevel.includes('error'))
      console.log(
        '\x1b[41m\x1b[37m%s -> error ->%s\x1b[0m \x1b[31m',
        `${this.now()}`,
        amountString,
        ...args,
        '\x1b[0m'
      );
  }

  info(...args) {
    if (this.logLevel.includes('info'))
      console.log(
        '\x1b[44m\x1b[37m%s -> info ->\x1b[0m \x1b[34m%s\x1b[0m',
        `${this.now()}`,
        ...args
      );
  }

  debug(...args) {
    if (this.logLevel.includes('debug'))
      console.log(
        '\x1b[42m\x1b[37m%s -> debug ->\x1b[0m \x1b[32m%s\x1b[0m',
        `${this.now()}`,
        ...args
      );
  }

  isThrottledError(e) {
    const key = JSON.stringify(e);

    let amount = this.#errors.get(key)?.amount ?? 1;

    // if error has been recently captured
    if (this.#errors.has(key)) {
      const span = new Date().getTime() - this.#errors.get(key).time;

      // if error captured before throttle delay passed
      if (span < this.errorsThrottleTime * 1000) {
        this.#errors.get(key).amount += 1;
        return null;
      }
    }

    // error hasn't been captured before or has been captured log ago, add it to the map
    this.#errors.set(key, {
      time: new Date().getTime(),
      amount
    });

    if ([this.#errors.keys()].length > this.errorsLength) {   // if errors map is bigger than size limit
      let oldestError = [...this.#errors.keys()][0];
      this.#errors.forEach((value, key) => {
        if (value < this.#errors.get(oldestError))
          oldestError = key;
      });

      this.#errors.delete(oldestError);
    }

    return amount;
  }
}

module.exports = new Logger();
