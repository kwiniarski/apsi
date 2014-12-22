'use strict';
var path = require('path');
module.exports = {
  BASE_DIR: path.normalize('/app'),
  APSI_DIR: path.normalize('/app/node_modules/app'),
  APPLICATION_SERVICES_DIR: path.normalize('/app/api/services'),
  APPLICATION_SERVICES_CONFIG_DIR: path.normalize('/app/config/services'),
  APPLICATION_LOG_CONFIG: path.normalize('/app/config/log')
};
