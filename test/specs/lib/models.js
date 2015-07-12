/* globals expect, mockery, syncDatabase */
/* jshint -W030 */

'use strict';

var server = null;
var models = null;

describe('Models provider', function () {
  before(function () {
    this.timeout(5000);
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    server = require('../../../index');
    models = server.models;
    return syncDatabase().then(function () {
      return server.start();
    });
  });
  after(function () {
    mockery.disable();
    return server.stop();
  });
  it('should return defined models', function () {
    expect(models).to.have.property('products');
    expect(models).to.have.property('users');
  });
  it('should return formated output from find(All) methods', function (done) {
    return models.users.findById(1).then(function (res) {
      expect(res).to.have.property('name', 'John Brown');
      expect(res).to.have.property('email', 'j.brown@gmail.com');
      return res;
    }).then(function (res) {
      expect(res).to.have.property('id', 1);
      expect(res).to.have.property('avatar', null);
      done();
    });
  });
});
