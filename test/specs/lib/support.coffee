'use strict'

support = require '../../../lib/support'
CONFIG = require '../../fixtures/config'

describe 'Support module', ->

  describe '#loadFiles helper', ->
    it 'should list files from directory', ->
      expect(support.loadFiles(CONFIG.MODELS_DIR)).to.be.an('array').and.have.length(7);

  describe '#loadModules helper', ->
    it 'should require selected files with additional metadata', ->
      modules = support.loadModules CONFIG.MODELS_DIR

      expect(modules).to.be.an 'object'
      expect(modules).to.contain.key 'groupNames'
      expect(modules['groupNames']).to.have.property 'name', 'groupNames'
      expect(modules['groupNames']).to.have.property 'path', 'group/names'
      expect(modules['groupNames']).to.have.property 'file'

    it 'should throw error when cannot read directory', ->
      try support.loadModules 'dirNotExists' catch error
      expect(error).to.be.not.undefined

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

