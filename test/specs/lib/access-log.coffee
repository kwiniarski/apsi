'use strict'

sinon = require 'sinon'
winston = require 'winston'

requestMock = require '../../mocks/express-request'
responseMock = require '../../mocks/express-response'
nextMock = require '../../mocks/express-next'

fakes = []
log = null

onFinishedStub = sinon.stub().callsArg 1

describe.skip 'Access log provider', ->

  beforeEach ->
    mockery.registerMock 'on-finished', onFinishedStub
    mockery.enable
      warnOnUnregistered: false
      useCleanCache: true

    fakes[transport] = sinon.stub(object.prototype, 'log').returns() for transport, object of winston.transports

    log = require '../../../lib/log/access'

  afterEach ->
    object.restore() for fake, object of fakes
    mockery.disable()


  it 'should log request data', ->
    req = requestMock 'POST', '/index/add'
    res = responseMock 200

    log req, res, nextMock

    expect(nextMock).to.have.been.called
    expect(fakes.Console).to.have.been.calledOnce


