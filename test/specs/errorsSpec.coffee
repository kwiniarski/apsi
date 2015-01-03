'use strict';

errors = require '../../lib/errors'
RequestError = errors.RequestError
requestError = null
error = null

describe 'RequestError', ->

  beforeEach ->
    requestError = new RequestError()
    error = new Error 'Application error'

  describe 'constructor', ->

    it 'should extend Error object', ->
      expect(requestError).to.be.an.instanceof RequestError
      expect(requestError).to.be.an.instanceof Error

  describe 'status code', ->

    it 'should default to 500 Internal Server Error', ->
      expect(requestError).to.have.property 'status', 500

    it 'should default to 500 Internal Server Error when status code is ommited', ->
      requestError = RequestError error
      expect(requestError).to.have.property 'status', 500
      expect(requestError).to.have.property 'name', 'Internal Server Error'
      expect(requestError).to.have.property 'message', 'Application error'

  describe 'error message', ->

    it 'should default to passed HTTP status code if not provided directly', ->
      expect((RequestError 404).toString()).to.equal 'Not Found: Not Found'

    it 'should be accepted as a string', ->
      expect((RequestError 404, 'Resource not found').toString()).to.equal 'Not Found: Resource not found'

    it 'should be accepted as an Error instance', ->
      requestError = RequestError 404, error
      expect(requestError.toString()).to.equal 'Not Found: Application error'
      expect(requestError.stack).to.contain 'Error: Application error'

  describe 'status methods', ->

    it 'should have NotFound static method', ->
      requestError = RequestError.NotFound();
      expect(requestError).to.have.property 'status', 404;
      expect(requestError.toString()).to.equal 'Not Found: Not Found'
