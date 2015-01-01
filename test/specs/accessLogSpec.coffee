'use strict'

sinon = require 'sinon'
winston = require 'winston'

configFixture = require '../fixtures/config'
accessLogConfigFixture = require '../fixtures/config/access-log'
requestMock = require '../mocks/express-request'
responseMock = require '../mocks/express-response'
nextMock = require '../mocks/express-next'

fakes = []
log = null

onFinishedStub = sinon.stub()

describe 'Access log provider', ->

  beforeEach ->

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    registerMock '../config', configFixture
    registerMock '/app/config/access-log', accessLogConfigFixture
    registerMock 'on-finished', onFinishedStub.callsArg 1

    fakes[transport] = sinon.stub(object.prototype, 'log').returns() for transport, object of winston.transports

    log = require '../../lib/access-log'

  afterEach ->

    mockery.deregisterAll()
    mockery.disable()

    object.restore() for fake, object of fakes

  it 'should log request data', ->
    req = requestMock 'POST', '/index/add'
    res = responseMock 200

    log req, res, nextMock

    expect(nextMock).to.have.been.called
    expect(fakes.Console).to.have.been.calledOnce


