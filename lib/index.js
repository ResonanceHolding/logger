'use strict';

const Sentry = require('@sentry/node');

/**
 * Logger for simple and pretty console output, also can be used with Sentry.
 * Has implemented error throttling mechanism, so if any error is thrown too
 * freequently it won't print out it to the console, such as sending it to
 * Sentry, but after throttling delay it will show how many times this error
 * was thrown during that period of time.
 */
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

  /**
   * @name ThrottleParams
   * @property {number} maxLength seconds
   * @property {number} delay seconds
   */

  /**
   * Initialize logger (if wasn't called - logger will be initialized
   * automaticly with default parameters, such as logLevel = 'all', 
   * throttleParams = { maxLength: 15, delay: 15 }). 
   * 
   * Initialization method can be called as Logger class method or via
   * functional wrapper (Init). Both of them are optional.
   * 
   * All of the params are optional
   * @param {string} logLevel 'all' | 'error' | 'info' | 'debug'
   * @param {Sentry.NodeOptions} sentryConfig
   * @param {ThrottleParams} throttleParams
   * @param {*} tags object with tags name as keys and values as values
   */
  init({
    logLevel = 'all', 
    sentryConfig = null, 
    throttleParams = { maxLength: 15, delay: 15 }, 
    tags = null
  } = {}) {
    console.log({
      logLevel, 
      sentryConfig, 
      throttleParams, 
      tags
    });
    if (sentryConfig) {
      if (!sentryConfig.environment) throw new Error('Sentry environment must be specified');

      sentryConfig.environment = sentryConfig.environment.toLowerCase();

      if (sentryConfig.environment !== 'local') {
        Sentry.init({
          ...sentryConfig
        });
        if (tags)
          Sentry.setTags(tags);

        this.isSentry = true;
      }
    }

    if (throttleParams) {
      this.errorsLength = throttleParams.maxLength ?? 15;
      this.errorsThrottleTime = throttleParams.delay ?? 15;
    }

    console.log(this);

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
