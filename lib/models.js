'use strict';

var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var Sequelize = require('sequelize');

var cwd = process.cwd();
var dir = path.resolve(cwd, 'api/models');
var db = {};

module.exports = function (config, services) {

  var logInfo = console.log;
//console.log(services.log);
  if (services && services.log && typeof services.log.info === 'function') {
    logInfo = services.log.info;
  }

  var options = lodash.extend({
    logging: logInfo
  }, config.options);
  var sequelize = new Sequelize(config.connection, options);


  function isModel(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  }

  function importModel(file) {
    /* jshint -W024 */
    var model = sequelize.import(path.resolve(dir, file));
    /* jshint +W024 */
    db[model.name] = model;
  }

  function associateModel(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  }

  fs
  .readdirSync(dir)
  .filter(isModel)
  .forEach(importModel);

  Object
  .keys(db)
  .forEach(associateModel);

  return lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
  }, db);

};
