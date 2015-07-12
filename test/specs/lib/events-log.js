/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var sinon = require('sinon');
var winston = require('winston');
var path = require('path');
var logConfig = path.resolve(__dirname, '../../example/config/events-log');
var fakes = {};
var log = null;
var setupHelper = function (eventsLogFixture) {
  var object, transport, _ref;
  if (!eventsLogFixture) {
    eventsLogFixture = '../../example/config/events-log';
  }
  mockery.disable();
  mockery.registerSubstitute(logConfig, path.resolve(__dirname, eventsLogFixture));
  mockery.enable({
    warnOnUnregistered: false,
    useCleanCache: true
  });
  _ref = winston.transports;
  for (transport in _ref) {
    object = _ref[transport];
    fakes[transport] = sinon.stub(object.prototype, 'log').returns();
  }
  log = require('../../../lib/log/events');
};

describe('Events log provider', function () {
  afterEach(function () {
    var fake, object;
    for (fake in fakes) {
      object = fakes[fake];
      object.restore();
    }
    mockery.deregisterSubstitute(logConfig);
    mockery.disable();
  });
  describe('with empty configuration', function () {
    beforeEach(function () {
      setupHelper('../../fixtures/config/events-log');
    });
    it('should be configured with Console transport', function () {
      log.info('test');
      expect(fakes.Console).to.have.been.calledWith('info', 'test');
      expect(fakes.File).to.have.not.been.called;
    });
  });
  describe('when configured with Config and File transports', function () {
    beforeEach(function () {
      setupHelper();
    });
    it('should send message using both transports', function () {
      log.info('test config');
      expect(fakes.Console).to.have.been.calledWith('info', 'test config');
      expect(fakes.File).to.have.been.calledWith('info', 'test config');
    });
  });
  describe('#auto method', function () {
    beforeEach(function () {
      setupHelper();
    });
    it('should log error when first argument is not null', function () {
      log.auto('Error message');
      expect(fakes.Console).to.have.been.calledWith('error', 'Error message');
      expect(fakes.File).to.have.been.calledWith('error', 'Error message');
    });
    it('should log error with detail if first argument is an instance of Error', function () {
      var err;
      try {
        throw new Error('Error message');
      }
      catch (_error) {
        err = _error;
        log.auto(err);
      }
      expect(fakes.Console).to.have.been.calledOnce;
    });
    it('should log info from all arguments expect first if it is null', function () {
      log.auto(null, 'Info', {});
      expect(fakes.Console).to.have.been.calledWith('info', 'Info', {});
      expect(fakes.File).to.have.been.calledWith('info', 'Info', {});
    });
  });
});
