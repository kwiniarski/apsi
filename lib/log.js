/* jshint -W098 */

'use strict';

//var colors = require('colors/safe');
var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;
var Console = winston.transports.Console;
var CONFIG = require('../config');
var config = require(CONFIG.APPLICATION_LOG_CONFIG);

var logger;
var transports = [];
var slice = Array.prototype.slice;

transports.push(new winston.transports.Console());

for (var i in config) {
  if (config.hasOwnProperty(i)) {
    transports.push(new winston.transports[i](config[i]));
  }
}

logger = new (winston.Logger)({
  transports: transports
});

logger.auto = function auto() {
  var args = slice.call(arguments, 0); // convert arguments object to regular array
  var error = args.shift(); // remove first (error) argument from the array

  /**
   * Otherwise it can be used as a callback to the any node compatible
   * function (where error is the first argument).
   * @example fs.writeFile(name, data, log.fs);
   */
  if (error) {
    if (error instanceof Error) {
      logger.error(error.message, error.stack);
    } else {
      logger.error(error);
    }
  } else {
    logger.info.apply(logger, args);
  }
};

logger.http = function http(req, res, next) {

  req._startAt = process.hrtime();
  req._startTime = new Date();
  res.on('finish', function () {
    var ms;
    var size;
    var level = 'info';
    var status = this.statusCode;
    var url = req.originalUrl || req.url;

    if (res._header && req._startAt) {
      var diff = process.hrtime(req._startAt);
      ms = ((diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3) || 0) + ' ms';
    }

    if (res._headers) {
      size = res._headers['content-length'] || 0;
    }

    if (status > 399 && status < 500) {
      level = 'warn';
    } else if (status >= 500) {
      level = 'error';
    }

    logger[level](req.method + ' ' + url + ' ' + status + ' ' + ms + ' - ' + size);
  });
  next();
};

module.exports = logger;

