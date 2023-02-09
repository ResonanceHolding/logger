'use strict';

const Logger = require('./lib');

module.exports = {
  Logger,
  /**
   * @name ThrottleParams
   * @property {number} maxLength seconds
   * @property {number} delay seconds
   */

  /**
   * Initialize logger (if wasn't called - logger will be initialized
   * automatically with default parameters, such as logLevel = 'all',
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
  Init: (...args) => Logger.init(...args),

  /**
   * Prints pretty error to stderr and if Sentry initialized - sends error
   * to Sentry
   * @param  {...any} args
   */
  Err: (...args) => Logger.err(...args),

  /**
   * Prints pretty message to stdout.
   * @param  {...any} args
   */
  Log: (...args) => Logger.log(...args),

  /**
   * Prints pretty message to stdout. If Sentry initialized - sends message
   * to Sentry
   * @param  {...any} args
   */
  Debug: (...args) => Logger.debug(...args),

  /**
   * Prints pretty message to stdout.
   * @param  {...any} args
   */
  Info: (...args) => Logger.info(...args),
};
