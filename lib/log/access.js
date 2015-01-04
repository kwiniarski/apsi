'use strict';

var morgan = require('morgan')
  , winston = require('./winston')
  , CONFIG = require('../../config')
  , config = require(CONFIG.ACCESS_LOG_CONFIG)
  , log = winston(config);

module.exports = morgan(config.format || 'combined', {
  stream: {
    write: function (line) {
      log.info(line);
    }
  }
});
