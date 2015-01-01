'use strict';

var morgan = require('morgan');
var winston = require('winston');
var CONFIG = require('../config');
var config = require(CONFIG.ACCESS_LOG_CONFIG);
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

module.exports = morgan(config.format || 'combined', {
  stream: {
    write: function (line) {
      log.info(line);
    }
  }
});
