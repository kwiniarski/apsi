'use strict';

mock = require './mocks/log'
mockery = require 'mockery'
sinon = require 'sinon'
winston = require 'winston'
Console = winston.transports.Console
File = winston.transports.File
consoleTransport = null
fileTransport = null
log = null

describe 'Log', ->

  beforeEach ->
    setup mock.modules
    consoleTransport = sinon.spy Console.prototype, 'log'
    fileTransport = sinon.spy File.prototype, 'log'
    log = require '../lib/log'
    log.info 'test'

  afterEach ->
    consoleTransport.restore()
    fileTransport.restore()
    reset()

  it 'should be an instance of Winston Logger', ->
    expect(log).to.be.an.instanceOf winston.Logger

  it 'should be configured only with Console transport if there is no configuration', ->
    expect(consoleTransport).to.have.been.calledWith 'info', 'test'
    expect(fileTransport).to.have.not.been.called

  it.skip 'should be accessable before services or routes are initialized', ->
  it.skip 'should accept transport from configuration file', ->



