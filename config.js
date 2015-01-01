var pathJoin = require('path').join;
var baseDir = process.cwd();
module.exports = {
  BASE_DIR: baseDir,
  APPLICATION_SERVICES_DIR: pathJoin(baseDir, 'api/services'),
  APPLICATION_SERVICES_CONFIG_DIR: pathJoin(baseDir, 'config/services'),
  CONTROLLERS_DIR: pathJoin(baseDir, 'api/controllers'),
  CONTROLLERS_CONFIG: pathJoin(baseDir, 'config/controllers'),
  EVENT_LOG_CONFIG: pathJoin(baseDir, 'config/event-log'),
  ACCESS_LOG_CONFIG: pathJoin(baseDir, 'config/access-log'),
  APSI_DIR: __dirname
};
