'use strict';

var path = require('path');
var sinon = require('sinon');
var fs = require('fs');
var fsStub = {};

function Service(config) {
  this.config = config;
}

module.exports.install = function () {
  fsStub = sinon.stub(fs, 'readdirSync');
  fsStub.withArgs(path.normalize('/app/api/services')).returns(['one', 'two']);
  fsStub.withArgs(path.normalize('/app/config/services')).returns(['one']);
  fsStub.throws('EFIXTURE_ENOENT');

  return fsStub;
};

module.exports.uninstall = function () {
  fsStub.restore();
};

module.exports.modules = {
  fs: fs,
  '/app/api/services/one': Service,
  '/app/api/services/two': Service,
  '/app/config/services/one': 1,
  '../config': require('../fixtures/config')
};

module.exports.Service = Service;


