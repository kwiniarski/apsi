/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function (req, res, next) {
  req._startedAt = process.hrtime();
  next();
};
