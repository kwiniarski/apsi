'use strict'

fs = require 'fs-extra'
sinon = require 'sinon'

describe 'Support module', ->

  fsStub = null
  support = null

  beforeEach ->
    fsStub = sinon.stub fs, 'readdirSync'
    fsStub.withArgs('dirOne').returns ['one', 'two']
    fsStub.throws 'STUB_ERROR'

    registerMock 'fs-extra', fs

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    support = require '../../lib/support'

  afterEach ->
    fsStub.restore()
    mockery.deregisterAll()
    mockery.disable()

  describe '#loadFiles helper', ->
    it 'should list files from directory', ->
      expect(support.loadFiles('dirOne')).to.be.an 'array';

  describe '#listFiles helper', ->
    it 'should list files from directory', ->
      expect(support.listFiles('dirOne')).to.be.an 'object';

  describe '#isCamelCase', ->
    it 'should return true if string is camel cased', ->
      expect(support.isCamelCase('lowerCamelCase')).to.be.true
      expect(support.isCamelCase('UpperCamelCase')).to.be.true

  describe '#camelCaseToDash', ->
    it 'should return string with dashes instead camel case', ->
      expect(support.camelCaseToDash('lowerCamelCase')).to.eql 'lower-camel-case'
      expect(support.camelCaseToDash('UpperCamelCase')).to.eql 'upper-camel-case'

  describe '#dashToCamelCase', ->
    it 'should return string with dashes instead camel case', ->
      expect(support.dashToCamelCase('lower-camel-case')).to.eql 'lowerCamelCase'

