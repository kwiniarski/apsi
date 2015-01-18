'use strict'

sinon = require 'sinon'
middleware = require '../../../middleware/response'

res = null
next = null

describe 'response middleware', ->

  beforeEach ->
    res =
      end: sinon.spy -> res
      json: sinon.spy -> res
      status: sinon.spy -> res
      location: sinon.spy -> res
    next = sinon.spy()
    middleware { _startedAt: process.hrtime() }, res, next

    expect(next).to.have.been.called

  describe 'total response time duration', ->

    it 'should be present if request contains coresponding property', ->
      expect(res._finishedAt).to.be.above 0

  describe 'ok method', ->

    it 'should be function', ->
      expect(res.ok).to.be.a 'function'

    it 'should end request as application/json with 200 status', ->
      res.ok
        test: 'Lorem ipsum'

      expect(res.status).to.have.been.calledWith 200
      expect(res.json).to.have.been.calledWith
        test: 'Lorem ipsum'

  describe 'created method', ->

    it 'should be a function', ->
      expect(res.created).to.be.a 'function'

    it 'should end request with 201 status and location header', ->
      res.created '/resource'

      expect(res.status).to.have.been.calledWith 201
      expect(res.location).to.have.been.calledWith '/resource'
      expect(res.end).to.have.been.called

  describe 'noContent method', ->

    it 'should be a function', ->
      expect(res.noContent).to.be.a 'function'

    it 'should end request with 204', ->
      res.noContent()

      expect(res.status).to.have.been.calledWith 204
      expect(res.end).to.have.been.called
