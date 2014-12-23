'use strict';

mock = require './mocks/log'
winston = require 'winston'
spy = {}
log = null

describe 'Log provider', ->

  afterEach ->
    mock.uninstall()
    reset()

  describe 'with empty configuration', ->

    beforeEach ->
      setup mock.emptyConfig
      spy = mock.install()
      log = require '../lib/log'
      log.info 'test'

    it 'should be an instance of Winston Logger', ->
      expect(log).to.be.an.instanceOf winston.Logger

    it 'should be configured with Console transport', ->
      expect(spy.Console).to.have.been.calledWith 'info', 'test'
      expect(spy.File).to.have.not.been.called

  describe 'when configured with Config and File transports', ->

    beforeEach ->
      setup mock.config
      spy = mock.install()
      log = require '../lib/log'
      log.info 'test'

    it 'should send message using both transports', ->
      expect(spy.Console).to.have.been.calledWith 'info', 'test'
      expect(spy.File).to.have.been.calledWith 'info', 'test'
