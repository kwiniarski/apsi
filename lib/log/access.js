'use strict';

var morgan = require('morgan');
var winston = require('./winston');
var CONFIG = require('../../config');
var config = require(CONFIG.ACCESS_LOG_CONFIG);
var log = require('./events');

config.level = config.level || 'error';

if (config.transports) {
  for (var i in config.transports) {
    if (config.transports[i].level && config.transports[i].level !== 'info') {
      log.warn('Access log transport "%s" has invalid log level "%s". ' +
        'Swithing to "info".',
        i, config.transports[i].level);

      config.transports[i].level = 'info';
    }
  }
}

module.exports = morgan(config.format || 'combined', {
  skip: function (req, res) {
    if (config.level === 'error') {
      return res.statusCode < 500;
    }
    else if (config.level === 'warn') {
      return res.statusCode < 400;
    }
    else {
      return false;
    }
  },
  stream: {
    write: winston(config).info
  }
});
