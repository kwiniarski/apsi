/* globals expect, mockery */
/* jshint -W030 */

'use strict';

var support = require('../../../lib/support');
var CONFIG = require('../../fixtures/config');

describe('Support module', function () {
  describe('#loadFiles helper', function () {
    it('should list files from directory', function () {
      expect(support.loadFiles(CONFIG.MODELS_DIR)).to.be.an('array').and.have.length(7);
    });
  });
  describe('#loadModules helper', function () {
    it('should require selected files with additional metadata', function () {
      var modules;
      modules = support.loadModules(CONFIG.MODELS_DIR);
      expect(modules).to.be.an('object');
      expect(modules).to.contain.key('groupNames');
      expect(modules['groupNames']).to.have.property('name', 'groupNames');
      expect(modules['groupNames']).to.have.property('path', 'group/names');
      expect(modules['groupNames']).to.have.property('file');
    });
    it('should throw error when cannot read directory', function () {
      var error;
      try {
        support.loadModules('dirNotExists');
      }
      catch (_error) {
        error = _error;
      }
      expect(error).to.be.not.undefined;
    });
  });
  describe('#isCamelCase', function () {
    it('should return true if string is camel cased', function () {
      expect(support.isCamelCase('lowerCamelCase')).to.be["true"];
      expect(support.isCamelCase('UpperCamelCase')).to.be["true"];
    });
  });
  describe('#camelCaseToDash', function () {
    it('should return string with dashes instead camel case', function () {
      expect(support.camelCaseToDash('lowerCamelCase')).to.eql('lower-camel-case');
      expect(support.camelCaseToDash('UpperCamelCase')).to.eql('upper-camel-case');
    });
  });
  describe('#dashToCamelCase', function () {
    it('should return string with dashes instead camel case', function () {
      expect(support.dashToCamelCase('lower-camel-case')).to.eql('lowerCamelCase');
    });
  });
  describe('#stringToArray', function () {
    it('should convert string to where coma sign separates elements', function () {
      expect(support.stringToArray('a')).to.eql(['a']);
      expect(support.stringToArray('a,b')).to.eql(['a', 'b']);
      expect(support.stringToArray('a, b')).to.eql(['a', 'b']);
      expect(support.stringToArray('a , b')).to.eql(['a', 'b']);
    });
  });
});
