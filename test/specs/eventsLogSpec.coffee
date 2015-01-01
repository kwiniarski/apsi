'use strict'

sinon = require 'sinon'
winston = require 'winston'

configFixture = require '../fixtures/config'
eventsLogConfigFixture = require '../fixtures/config/events-log'

fakes = []
log = null

setupHelper = (eventsLogFixture = {}) ->
  mockery.enable
    warnOnUnregistered: false
    warnOnReplace: false
    useCleanCache: true

  registerMock '../config', configFixture
  registerMock '/app/config/events-log', eventsLogFixture

  fakes[transport] = sinon.stub(object.prototype, 'log').returns() for transport, object of winston.transports

  log = require '../../lib/events-log'

describe 'Events log provider', ->

  afterEach ->

    mockery.deregisterAll()
    mockery.disable()

    object.restore() for fake, object of fakes

  describe 'with empty configuration', ->

    beforeEach -> setupHelper()

    it 'should be configured with Console transport', ->
      log.info 'test'
      expect(fakes.Console).to.have.been.calledWith 'info', 'test'
      expect(fakes.File).to.have.not.been.called

  describe 'when configured with Config and File transports', ->

    beforeEach -> setupHelper eventsLogConfigFixture

    it 'should send message using both transports', ->
      log.info 'test config'
      expect(fakes.Console).to.have.been.calledWith 'info', 'test config'
      expect(fakes.File).to.have.been.calledWith 'info', 'test config'

  describe '#auto method', ->

    beforeEach -> setupHelper eventsLogConfigFixture

    it 'should log error when first argument is not null', ->
      log.auto 'Error message'
      expect(fakes.Console).to.have.been.calledWith 'error', 'Error message'
      expect(fakes.File).to.have.been.calledWith 'error', 'Error message'

    it 'should log info from all arguments expect first if it is null', ->
      log.auto null, 'Info', {}
      expect(fakes.Console).to.have.been.calledWith 'info', 'Info', {}
      expect(fakes.File).to.have.been.calledWith 'info', 'Info', {}

