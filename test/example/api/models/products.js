/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function (sequelize, Sequelize) {

  var products;

  products = sequelize.define('products', {
    title: Sequelize.STRING
  });

  return products;

};

