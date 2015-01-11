/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var path = require('path')
  , middleware = [
    'access-log',
    'body-parser',
    'request',
    'response',
    'routes',
    'errors-handler'
  ];

module.exports = middleware.map(function (file) {
  return require(path.join(__dirname, file));
});
