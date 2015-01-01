'use strict';

var winston = require('winston');
var CONFIG = require('../config');
var config = require(CONFIG.EVENTS_LOG_CONFIG);
var transports = [];
var log;

for (var i in config.transports) {
  if (config.transports.hasOwnProperty(i)) {
    transports.push(new winston.transports[i](config.transports[i]));
  }
}

if (!transports.length) {
  transports.push(new winston.transports.Console());
}

log = new (winston.Logger)({
  transports: transports
});

log.auto = function auto() {

  var args = Array.prototype.slice.call(arguments, 0); // convert arguments object to regular array
  var error = args.shift(); // remove first (error) argument from the array

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
