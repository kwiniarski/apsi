/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = {
  connection: {
    database: 'test_spiral',
    user: process.env.USER,
    password: ''
  },
  options: {
    dialect: 'mysql',
    logging: false
  }
};
