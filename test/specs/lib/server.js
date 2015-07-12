/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');

describe('Server core', function () {
  var server;
  server = null;
  before(function () {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
    server = require('../../../index');
  });
  after(function () {
    mockery.disable();
  });
  it('should expose services when required', function () {
    expect(server).to.have.property('services');
  });
  it('should expose models when required', function () {
    expect(server).to.have.property('models');
  });
  it('should expose events log when required', function () {
    expect(server).to.have.property('log');
  });
  it('should expose application object when required', function () {
    expect(server).to.have.property('application');
  });
  it('should start application on selected port', function () {
    server.hooks.afterStart = sinon.spy(server.hooks.afterStart);
    server.hooks.afterStop = sinon.spy(server.hooks.afterStop);
    return server.start().tap(function () {
      expect(server.hooks.afterStart).to.have.been.calledOnce;
    }).then(server.stop).tap(function () {
      expect(server.hooks.afterStop).to.have.been.calledOnce;
    });
  });
});

