var path = require('path');
module.exports = {
  BASE_DIR: process.cwd(),
  APSI_DIR: __dirname,
  APSI_SERVICES_DIR: path.resolve(__dirname, 'src/services')
};
