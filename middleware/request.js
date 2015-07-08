/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var uuid = require('node-uuid');

module.exports = function (req, res, next) {
  req._uuid = uuid.v1();
  req._startedAt = process.hrtime();
  next();
};
