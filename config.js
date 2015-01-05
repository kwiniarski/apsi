var pathJoin = require('path').join;
var baseDir = process.cwd();
module.exports = {
  BASE_DIR: baseDir,
  APPLICATION_SERVICES_DIR: pathJoin(baseDir, 'api/services'),
  APPLICATION_SERVICES_CONFIG_DIR: pathJoin(baseDir, 'config/services'),
  CONTROLLERS_DIR: pathJoin(baseDir, 'api/controllers'),
  CONTROLLERS_CONFIG: pathJoin(baseDir, 'config/controllers'),
  EVENTS_LOG_CONFIG: pathJoin(baseDir, 'config/events-log'),
  ACCESS_LOG_CONFIG: pathJoin(baseDir, 'config/access-log'),
  MODELS_DIR: pathJoin(baseDir, 'api/models'),
  MODELS_CONFIG: pathJoin(baseDir, 'config/models'),
  POLICIES_CONFIG: pathJoin(baseDir, 'config/policies'),
  POLICIES_DIR: pathJoin(baseDir, 'api/policies'),
  APSI_DIR: __dirname
};
