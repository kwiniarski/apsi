/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var eventsLog = require('../lib/log/events')
  , env = require('../config').ENV;

module.exports = function errorsHandler(err, req, res, next) {

  var status = err.status || 500
    , error = {
        status: status,
        code: err.code,
        message: err.message,
        stack: err.stack
      };

  res.status(status);
  res.json(env === 'development' ? error : {
    status: error.status,
    code: error.code,
    message: error.message
  });

  eventsLog.error(err.message, error);
};
