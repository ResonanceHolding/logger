'use strict';

const Logger = require('./lib');

module.exports = {
  Logger,
  Err: (...args) => Logger.err(...args),
  Log: (...args) => Logger.log(...args),
  Debug: (...args) => Logger.debug(...args),
  Info: (...args) => Logger.info(...args),
  Init: (...args) => Logger.init(...args),
};
