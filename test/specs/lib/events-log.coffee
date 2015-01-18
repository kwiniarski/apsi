'use strict'

sinon = require 'sinon'
winston = require 'winston'
path = require 'path'

logConfig = path.resolve __dirname, '../../example/config/events-log'

fakes = {}
log = null

setupHelper = (eventsLogFixture = '../../example/config/events-log') ->
  mockery.registerSubstitute logConfig, path.resolve(__dirname, eventsLogFixture)
  mockery.enable
    warnOnUnregistered: false
    useCleanCache: true

  fakes[transport] = sinon.stub(object.prototype, 'log').returns() for transport, object of winston.transports

  log = require '../../../lib/log/events'

describe 'Events log provider', ->

  afterEach ->
    object.restore() for fake, object of fakes

    mockery.deregisterSubstitute logConfig
    mockery.disable()

  describe 'with empty configuration', ->

    beforeEach -> setupHelper '../../fixtures/config/events-log'

    it 'should be configured with Console transport', ->
      log.info 'test'
      expect(fakes.Console).to.have.been.calledWith 'info', 'test'
      expect(fakes.File).to.have.not.been.called

  describe 'when configured with Config and File transports', ->

    beforeEach -> setupHelper()

    it 'should send message using both transports', ->
      log.info 'test config'
      expect(fakes.Console).to.have.been.calledWith 'info', 'test config'
      expect(fakes.File).to.have.been.calledWith 'info', 'test config'

  describe '#auto method', ->

    beforeEach -> setupHelper()

    it 'should log error when first argument is not null', ->
      log.auto 'Error message'
      expect(fakes.Console).to.have.been.calledWith 'error', 'Error message'
      expect(fakes.File).to.have.been.calledWith 'error', 'Error message'

    it 'should log error with detail if first argument is an instance of Error', ->
      try
        throw new Error 'Error message'
      catch err
        log.auto err

      expect(fakes.Console).to.have.been.calledOnce

    it 'should log info from all arguments expect first if it is null', ->
      log.auto null, 'Info', {}
      expect(fakes.Console).to.have.been.calledWith 'info', 'Info', {}
      expect(fakes.File).to.have.been.calledWith 'info', 'Info', {}

