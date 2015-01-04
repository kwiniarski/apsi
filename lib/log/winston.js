/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var winston = require('winston');

module.exports = function createFromConfiguration(config) {
  var transports = [];

  for (var i in config.transports) {
    if (config.transports.hasOwnProperty(i)) {
      transports.push(new winston.transports[i](config.transports[i]));
    }
  }

  if (!transports.length) {
    transports.push(new winston.transports.Console());
  }

  return new (winston.Logger)({
    transports: transports
  });
};


