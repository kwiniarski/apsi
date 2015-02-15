/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 *
 * Middleware witch extends response object with additional properties to handle response by unifying its format.
 * In general Spiral API will respond only if client accepts "application/json" format. Otherwise 406 status will
 * be returned with empty response. Other statuses are handled by Spiral blueprints so there should be no need to
 * think of them. However if you would like to trigger any of those errors manually you should require errors
 * module.
 *
 */

'use strict';

var errors = require('../lib/errors')
  , RequestError = errors.RequestError;

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
      writable: true,
      value: function ok(data) {
        return res
          .status(200)
          .json(data);
      }
    },
    // 201 Created
    created: {
      writable: true,
      value: function created(location) {
        return res
          .location(location)
          .status(201)
          .end();
      }
    },
    // 204 No Content
    noContent: {
      writable: true,
      value: function noContent() {
        return res
          .status(204)
          .end();
      }
    },

    error: {
      writable: true,
      value: function error(code, message) {
        if (typeof RequestError[code] === 'function') {
          next(RequestError[code](message));
        }
        else if (typeof code === 'number') {
          next(new RequestError(code, message));
        }
        else {
          next(RequestError.BadRequest(code));
        }
      }
    },

    createdOrNoContent: {
      writable: true,
      value: function createdOrNoContent(locationUrl) {
        return locationUrl
          ? res.location(locationUrl).status(201).end()
          : res.status(204).end();
      }
    },

    okOrNotFound: {
      writable: true,
      value: function okOrNotFound(data) {
        return data
          ? res.status(200).json(data)
          : next(RequestError.NotFound());
      }
    }

  });

  next();
};
