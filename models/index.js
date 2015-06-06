'use strict';

var support = require('./../lib/support')
  , path = require('path')
  , _ = require('lodash')
  , Sequelize = require('sequelize')
  , CONFIG = require('../config')
  , config = require(CONFIG.MODELS_CONFIG)
  , models = support.loadModules(CONFIG.MODELS_DIR)
  , eventsLog = require('./../lib/log/events')
  , db = {}

  , options = _.extend({
      logging: eventsLog.debug
    }, config.options || {})

  , conn = config.connection
  , sequelize = new Sequelize(conn.database, conn.user, conn.password, options);


function isModel(file) {
  return (file.indexOf('.') !== 0) && (!/index\.js$/.test(file)) && (/\.js/i.test(file));
}

function importModel(moduleData) {
  try {
    var model = require(moduleData.file)(sequelize, Sequelize);
    db[model.name] = _.defaults(model, moduleData);
    eventsLog.debug('model registered', model.name);
  }
  catch (error) {
    eventsLog.error('Cannot load model', moduleData.file);
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
    eventsLog.debug('model associated', modelName);
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

