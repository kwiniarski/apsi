/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = function (sequelize, Sequelize) {

  var roles;

  roles = sequelize.define('roles', {
    name: Sequelize.STRING
  }, {
    classMethods: {
      associate: function(models) {
        roles.belongsToMany(models.users, {
          through: 'user_roles'
        });
      }
    }
  });

  return roles;

};

