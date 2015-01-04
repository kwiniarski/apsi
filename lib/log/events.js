'use strict';

var winston = require('./winston')
  , CONFIG = require('../../config')
  , config = require(CONFIG.EVENTS_LOG_CONFIG)
  , log = winston(config)
  , slice = Array.prototype.slice;

log.auto = function auto() {

  var args = slice.call(arguments, 0) // convert arguments object to regular array
    , error = args.shift(); // remove first (error) argument from the array

  /**
   * Otherwise it can be used as a callback to the any node compatible
   * function (where error is the first argument).
   * @example fs.writeFile(name, data, log.fs);
   */
  if (error) {
    if (error instanceof Error) {
      log.error(error.message, error.stack);
    } else {
      log.error(error);
    }
  } else {
    log.info.apply(log, args);
  }
};

module.exports = log;
