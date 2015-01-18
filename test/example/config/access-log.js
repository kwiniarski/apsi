/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

var devNull = require('dev-null');

module.exports = {
  transports: {
    Console: {
      silent: true
    },
    File: {
      silent: true,
      stream: devNull()
    }
  }
};

