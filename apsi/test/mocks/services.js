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

function Service(config) {
  this.config = config;
}

var pathStub = {
  resolve: function() {
    return [].slice.call(arguments).join('/');
  },
  join: function() {
    return path.join.apply(path, arguments);
  }
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

var processStub = {
  cwd: function () {
    return '/app';
  }
}

module.exports.Service = Service;

module.exports.modules = {
  fs: fsStub,
  path: pathStub,
  '/app/api/services/one': Service,
  '/app/api/services/two': Service,
  '/app/node_modules/app/services/three': Service,
  '/app/config/services/one': 1,
  '/app/config/services/two': 2
};

module.exports.globals = {
  __dirname: '/app/node_modules/app/services',
  process: processStub
};
