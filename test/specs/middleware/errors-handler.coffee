'use strict'

sinon = require 'sinon'

describe 'errors-handler middleware', ->

  req = null
  res = null
  middleware = null

  beforeEach ->
    req = require('../../mocks/express-request')()
    res = require('../../mocks/express-response')()

    res.status = sinon.spy res.status
    res.json = sinon.spy res.json

    middleware = require '../../../middleware/errors-handler'

  describe 'status code support', ->
    it 'should set status code from error object', ->
      error = new Error 'Request error'
      error.status = 501
      middleware error, req, res

      expect(res.status).to.have.been.calledWith 501
      expect(res.json).to.have.been.calledWith error

    it 'should have default status code 500', ->
      error = new Error 'Request error'
      middleware error, req, res

      expect(res.status).to.have.been.calledWith 500


