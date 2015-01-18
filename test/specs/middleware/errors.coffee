'use strict'

sinon = require 'sinon'
RequestError = require('../../../lib/errors').RequestError

describe 'error middleware', ->

  next = null
  middleware = null

  beforeEach ->
    next = sinon.spy()
    middleware = require '../../../middleware/errors'

  describe 'methodNotAllowed method', ->

    it 'should call Method Not Allowed error constructor', ->
      middleware.methodNotAllowed null, null, next

      expect(next).to.have.been.calledOnce
      expect(next.args[0][0]).to.be.an.instanceof(RequestError).and.have.property 'status', 405

  describe 'notFound method', ->

    it 'should call Not Found error constructor', ->
      middleware.notFound null, null, next

      expect(next).to.have.been.calledOnce
      expect(next.args[0][0]).to.be.an.instanceof(RequestError).and.have.property 'status', 404
