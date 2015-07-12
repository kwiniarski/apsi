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
var debug = require('../lib/log/debug')('spiral:model');

function isModel(file) {
  return (file.indexOf('.') !== 0)
    && (!/index\.js$/.test(file))
    && (/\.js/i.test(file));
}

function hasAssociations(model) {
  return (model.associations && model.associations instanceof Array);
}

function associate(db, model) {
  model.associations.forEach(function (association) {
    model[association.type](db[association.model],
      Object.create(association.options || null));
    debug('associated %s %s %s', model.name,
      association.type,
      association.model,
      association.options);
  });
}

function importModel(moduleData) {
  try {
    var model = require(moduleData.file)(sequelize, Sequelize);
    db[model.name] = _.defaults(model, moduleData);
    debug('register: %s (%s)', model.name, model.path);
  }
  catch (error) {
    console.log(error.stack);
    process.exit(-1);
  }
}

for (var i in models) {
  if (isModel(models[i].file)) {
    importModel(models[i]);
  }
}

for (var modelName in db) {
  var model = db[modelName];
  if (hasAssociations(model)) {
    associate(db, model);
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

