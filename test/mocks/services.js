//require('../asserts/services');



var path = require('path');
var noop = function () {};

var filesystemFixture = {
  '/app/api/services' : {
    one: noop,
    two: noop
  },
  '/app/config/services': {
    one: {}
  }
};
for (var pathName in filesystemFixture) {
  filesystemFixture[path.normalize(pathName)] = filesystemFixture[pathName];
}


function Service(config) {
  this.config = config;
}

var fsStub = {
  readdirSync: function (pathStr) {
    if (filesystemFixture[pathStr]) {
      return Object.keys(filesystemFixture[pathStr]);
    } else {
      throw 'EFIXTURE_ENOENT: ' + pathStr;
    }
  }
};


module.exports.Service = Service;

module.exports.modules = {
  fs: fsStub,
  '/app/api/services/one': Service,
  '/app/api/services/two': Service,
  '/app/config/services/one': 1,
  '../config': {
    BASE_DIR: path.normalize('/app'),
    APSI_DIR: path.normalize('/app/node_modules/app'),
    APPLICATION_SERVICES_DIR: path.normalize('/app/api/services'),
    APPLICATION_SERVICES_CONFIG_DIR: path.normalize('/app/config/services')
  }
};
for (var pathName in module.exports.modules) {
  module.exports.modules[path.normalize(pathName)] = module.exports.modules[pathName];
}
