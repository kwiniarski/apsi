'use strict';

var os = require('os');
var path = require('path');
var chai = require('chai');
var utils = require('chai/lib/chai/utils');
var mockery = require('mockery');

/* jshint -W030 */
utils.addMethod(chai.Assertion.prototype, 'readOnly', function (property) {
  var descriptor = Object.getOwnPropertyDescriptor(this._obj, property);
  new chai.Assertion(descriptor.writable).to.be.false;
});
utils.addMethod(chai.Assertion.prototype, 'memberFunctions', function (members) {
  var check = true;
  for (var i = 0, j = members.length; i < j; i++) {
    check = check
      && typeof members[i] === 'function'
      && typeof this._obj[i] === 'function'
      && members[i].toString() === this._obj[i].toString();
  }
  new chai.Assertion(check).to.be.true;
});
/* jshint +W030 */

chai.use(require('sinon-chai'));
chai.use(require('chai-http'));
chai.request.addPromises(require('bluebird').Promise);
chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.request = chai.request;
global.mockery = mockery;

mockery.registerSubstitute('../../config', '../../test/fixtures/config');
mockery.registerSubstitute('../config', '../test/fixtures/config');
mockery.registerSubstitute('./support', '../test/mocks/support');

global.createServerAndSyncDatabase = function (done) {
  var server = require('../lib/server')
    , models = server.models;

  models.sequelize.sync({
    force: true
  }).then(function () {
    models.products.bulkCreate([
      { title: 'Aliquam rutrum molestie rutrum.' },
      { title: 'Nulla laoreet.' }
    ]);
  }).then(function () {
    models.users.bulkCreate([
      { name: 'John Brown', email: 'j.brown@gmail.com' },
      { name: 'Mark Down', email: 'mark.down@yahoo.com' }
    ]);
  }).done(function () {
    server.start(done);
  });

  return server;
};
