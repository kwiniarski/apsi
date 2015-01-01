/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 *
 * Middleware witch extends response object with additional
 * properties.
 *
 */

'use strict';

var STATUS_CODES = require('http').STATUS_CODES;

module.exports = function (req, res, next) {

  var finishedAt = null;

  if (req && req._startedAt) {
    var diff = process.hrtime(req._startedAt);
    finishedAt = diff[0] * 1e9 + diff[1];
  }

  Object.defineProperties(res, {
    _finishedAt: {
      value: finishedAt
    },

    formatOutputData: {
      value: function (data) {
        return {
          errors: [],
          data: data
        };
      }
    },

    // 200 OK
    ok: {
      value: function ok(data) {
        return res
          .status(200)
          .format({
            'application/json': function () {
              res.json(data);
            },
            'default': function () {
              var error = new Error();
              error.status = 406;
              error.name = STATUS_CODES[error.status];
              error.type = 'html';

              return next(error);
            }
          });
      }
    },
    // 201 Created
    created: {
      value: function created(data, location) {
        return res
          .status(201)
          .location(location)
          .json(data);
      }
    },
    // 400 Bad Request
    badRequest: {
      value: function badRequest(err) {
        var error = err || new Error();
        error.status = 400;
        error.name = STATUS_CODES[error.status];

        return next(error);
      }
    },
    // 401 Unauthorized
    unauthorized: {

    },
    // 403 Forbidden
    forbidden: {

    },
    // 404 Not Found
    notFound: {
      value: function notFound() {
        var error = new Error();
        error.status = 404;
        error.name = STATUS_CODES[error.status];

        return next(error);
      }
    },
    // 405 Method Not Allowed
    methodNotAllowed: {
      value: function methodNotAllowed() {
        var error = new Error();
        error.status = 405;
        error.name = STATUS_CODES[error.status];

        return next(error);
      }
    },
    // 500 InternalServerError
    internalServerError: {

    },
    // 501 Not Implemented
    notImplemented: {

    }

  });


  next();
};
