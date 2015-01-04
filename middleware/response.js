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

var RequestError = require('../lib/errors').RequestError;

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

    // 200 OK
    ok: {
      value: function ok(data) {
        return res
          .status(200)
          .json(data);
      }
    },
    // 201 Created
    created: {
      value: function created(location) {
        return res
          .location(location)
          .status(201)
          .end();
      }
    },
    // 204 No Content
    noContent: {
      value: function deleted() {
        return res
          .status(204)
          .end();
      }
    }
  });

  next();
};
