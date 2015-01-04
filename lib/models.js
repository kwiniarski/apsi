'use strict';

var support = require('./support')
  , path = require('path')
  , lodash = require('lodash')
  , Sequelize = require('sequelize')
  , CONFIG = require('../config')
  , config = require(CONFIG.MODELS_CONFIG)
  , eventsLog = require('./log/events')
  , db = {}

  , options = lodash.extend({
      logging: eventsLog.auto
    }, config.options || {})

  , conn = config.connection
  , sequelize = new Sequelize(conn.database, conn.user, conn.password, options);


function isModel(file) {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}

function importModel(file) {
  /* jshint -W024 */
  var model = sequelize.import(path.resolve(CONFIG.MODELS_DIR, file));
  /* jshint +W024 */
  db[model.name] = model;
}

support
  .loadFiles(CONFIG.MODELS_DIR)
  .filter(isModel)
  .forEach(importModel);

for (var modelName in db) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
}

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db);

