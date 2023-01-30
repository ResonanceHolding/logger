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
  Err: (...args) => Logger.err(...args),
  Log: (...args) => Logger.log(...args),
  Debug: (...args) => Logger.debug(...args),
  Info: (...args) => Logger.info(...args),
};
