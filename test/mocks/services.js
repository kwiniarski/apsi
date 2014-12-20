var path = require('path');
var noop = function () {};

var filesystemFixture = {
  '/app/api/services' : {
    one: noop,
    two: noop
  },
  '/app/node_modules/app/services': {
    one: noop,
    three: noop,
  },
  '/app/config/services': {
    one: {},
    two: {}
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
}


module.exports.Service = Service;

module.exports.modules = {
  fs: fsStub,
  //path: pathStub,
  '/app/api/services/one': Service,
  '/app/api/services/two': Service,
  '/app/node_modules/app/services/three': Service,
  '/app/config/services/one': 1,
  '/app/config/services/two': 2,
  '../../config': {
    BASE_DIR: path.normalize('/app'),
    APSI_DIR: path.normalize('/app/node_modules/app'),
    APSI_SERVICES_DIR: path.normalize('/app/node_modules/app/services')
  }
};
for (var pathName in module.exports.modules) {
  module.exports.modules[path.normalize(pathName)] = module.exports.modules[pathName];
}
