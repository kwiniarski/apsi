/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var eventsLog = require('../lib/log/events');
var env = require('../config').ENV;
var _ = require('lodash');

module.exports = function errorsHandler(err, req, res, next) {

  if (!err.status) {
    err.status = 500;
  }

  var meta = {
    requestId: req._uuid,
    error: err,
  };

  if (eventsLog.config.includeStackTraces === true) {
    meta.error.stackTrace = _.trim(err.stack);
  }

  // Log error
  eventsLog.error(err.name, meta);

  // Print output
  if (env === 'production') {
    delete err.stack;
  }

  res.status(err.status).json(err);

};
