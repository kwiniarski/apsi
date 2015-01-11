/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var sinon = require('sinon');

module.exports = sinon.spy(function (req, res, next) {
  next();
});
