/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var RequestError = require('../lib/errors').RequestError;

module.exports = {
  methodNotAllowed: function (req, res, next) {
    return next(RequestError.MethodNotAllowed());
  },
  notFound: function (req, res, next) {
    return next(RequestError.NotFound());
  }
};
