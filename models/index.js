'use strict';

var support = require('./../lib/support');
var path = require('path');
var _ = require('lodash');
var Sequelize = require('sequelize');
var CONFIG = require('../config');
var config = require(CONFIG.MODELS_CONFIG);
var models = support.loadModules(CONFIG.MODELS_DIR);
var eventsLog = require('./../lib/log/events');
var db = {};
var options = _.extend({
  logging: eventsLog.debug,
}, config.options || {});
var conn = config.connection;
var sequelize = new Sequelize(conn.database, conn.user, conn.password, options);
var debug = require('debug')('spiral:model');

function isModel(file) {
  return (file.indexOf('.') !== 0)
    && (!/index\.js$/.test(file))
    && (/\.js/i.test(file));
}

function importModel(moduleData) {
  try {
    var model = require(moduleData.file)(sequelize, Sequelize);
    db[model.name] = _.defaults(model, moduleData);
    debug('register: %s (%s)', model.name, model.path);
  }
  catch (error) {
    eventsLog.error('Cannot load model', moduleData.file, error.stack);
  }
}

for (var i in models) {
  if (isModel(models[i].file)) {
    importModel(models[i]);
  }
}

for (var modelName in db) {
  if ('associate' in db[modelName]) {
    db[modelName].associate.call(db[modelName], db);
    debug('associate: %s', modelName);
  }
}

Object.defineProperties(module.exports, {
  sequelize: {
    value: sequelize
  },
  Sequelize: {
    value: Sequelize
  }
});

module.exports = _.extend(module.exports, db);

