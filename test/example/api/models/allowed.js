/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('allowed', {
    name: Sequelize.STRING
  });

};

