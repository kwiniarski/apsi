'use strict';

mocks     = require './mocks/services'
mockery   = require 'mockery'

describe 'Route', ->

  describe 'when blueprints are used for the resource model', ->

    describe 'GET /resources route', ->
      it 'should be created'
      it 'should return subset of all resources'

    describe 'GET /resources/:id route', ->
      it 'should be created'

    describe 'POST /resources/ route', ->
      it 'should be created'

    describe 'PUT /resources/:id route', ->
      it 'should be created'

    describe 'DELETE /resources/:id route', ->
      it 'should be created'

  describe 'when controller is created for the resource model', ->
    it 'should extend blueprint routes overwriting them if needed'

