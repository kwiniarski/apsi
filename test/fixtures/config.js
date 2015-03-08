'use strict';
var path = require('path')
  , fakePaths = {
      BASE_DIR: '../example',
      APSI_DIR: '../../',
      SERVICES_DIR: '../example/api/services',
      SERVICES_CONFIG_DIR: '../example/config/services',
      CONTROLLERS_DIR: '../example/api/controllers',
      CONTROLLERS_CONFIG: '../example/config/controllers',
      EVENTS_LOG_CONFIG: '../example/config/events-log',
      ACCESS_LOG_CONFIG: '../example/config/access-log',
      MODELS_DIR: '../example/api/models',
      MODELS_CONFIG: '../example/config/models',
      POLICIES_CONFIG: '../example/config/policies',
      POLICIES_DIR: '../example/api/policies'
    };

for (var i in fakePaths) {
  module.exports[i] = path.resolve(__dirname, fakePaths[i]);
}

