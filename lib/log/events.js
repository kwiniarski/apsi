'use strict';

var winston = require('./winston');
var CONFIG = require('../../config');
var config = require(CONFIG.EVENTS_LOG_CONFIG);
var log = winston(config);
var slice = Array.prototype.slice;

log.config = config;

log.auto = function auto() {

  // convert arguments object to regular array
  var args = slice.call(arguments, 0);
  // remove first (error) argument from the array
  var error = args.shift();

  /**
   * Otherwise it can be used as a callback to the any node compatible
   * function (where error is the first argument).
   * @example fs.writeFile(name, data, log.auto);
   */
  if (error) {
    if (error instanceof Error) {
      log.error(error.message, config.includeStackTraces ? error.stack : null);
    }
    else {
      log.error(error);
    }
  }
  else {
    log.info.apply(log, args);
  }
};

module.exports = log;
