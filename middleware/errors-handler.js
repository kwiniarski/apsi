/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var eventsLog = require('../lib/log/events')
  , env = require('../config').ENV
  , _ = require('lodash');

module.exports = function errorsHandler(err, req, res, next) {

  if (!err.status) {
    err.status = 500;
  }

  // Log error
  eventsLog.error(err.message, {
    error: err.stack || err.toString(),
    request: _.pick(req, function (v) {
      return _.isString(v) || _.isNumber(v) || _.isBoolean(v) || _.isDate(v) || _.isNull(v);
    })
  });

  // Print output
  if (env === 'production') {
    delete err.stack;
  }

  res.status(err.status).json(err);

};
