/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 *
 * Middleware witch extends response object with additional properties to handle response by unifying its format.
 * In general Surf API will respond only if client accepts "application/json" format. Otherwise 406 status will
 * be returned with empty response. Other statuses are handled by Surf blueprints so there should be no need to
 * think of them. However if you would like to trigger any of those errors manually you should require errors
 * module.
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
    }


  });


  next();
};
