'use strict';
var path = require('path');
module.exports = {
  BASE_DIR: path.normalize('/app'),
  APSI_DIR: path.normalize('/app/node_modules/app'),
  APPLICATION_MODELS_DIR: path.normalize('/app/api/models'),
  APPLICATION_SERVICES_DIR: path.normalize('/app/api/services'),
  APPLICATION_SERVICES_CONFIG_DIR: path.normalize('/app/config/services'),
  CONTROLLERS_DIR: path.normalize('/app/api/controllers'),
  CONTROLLERS_CONFIG: path.normalize('/app/config/controllers'),
  EVENTS_LOG_CONFIG: path.normalize('/app/config/events-log'),
  ACCESS_LOG_CONFIG: path.normalize('/app/config/access-log')
};