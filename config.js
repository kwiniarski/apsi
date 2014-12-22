var pathJoin = require('path').join;
var baseDir = process.cwd();
module.exports = {
  BASE_DIR: baseDir,
  APPLICATION_SERVICES_DIR: pathJoin(baseDir, 'api/services'),
  APPLICATION_SERVICES_CONFIG_DIR: pathJoin(baseDir, 'config/services'),
  APPLICATION_LOG_CONFIG: pathJoin(baseDir, 'config/log'),
  APSI_DIR: __dirname
};
