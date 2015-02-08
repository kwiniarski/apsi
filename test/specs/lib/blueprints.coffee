'use strict'

sinon = require 'sinon'
blueprints = require '../../../lib/blueprints'

describe.only 'Blueprints provider', ->

  blueprint = null
  model = null
  req = null
  res = null
#  next = null

  beforeEach ->
    model =
      then: sinon.spy()
      bulkCreate: sinon.spy -> model
      create: sinon.spy -> model
      upsert: sinon.spy -> model
      find: sinon.spy -> model
      findAll: sinon.spy -> model
      destroy: sinon.spy -> model

    blueprint = blueprints.getDefaultActions model, 'resources'

    req = require('../../mocks/express-request')()
    res = require('../../mocks/express-response')()
#    next = sinon.spy ->

    require('../../../middleware/request') req, res, ->
    require('../../../middleware/response') req, res, ->

#    req.params = [1]

#    res.created = sinon.spy res.created
#    res.ok = sinon.spy res.ok
#    res.noContent = sinon.spy res.noContent

  describe 'create request handler', ->
    it 'should be configured as a POST method', ->
      expect(blueprint.create.methods).to.have.members ['post']

    it 'should bulk create records when data is send as an array', ->
      req.body = [];
      blueprint.create.fn req
      expect(model.bulkCreate).to.have.been.calledWith [];

    it 'should create record when data is send as an object', ->
      req.body = {};
      blueprint.create.fn req

      expect(model.create).to.have.been.calledWith {};
      expect(model.then).to.have.been.calledOnce;
      expect(model.then.firstCall.args[0]({id:1})).to.be.equal '/resources/1';

  describe 'update request handler', ->
    it 'should be configured as a PUT method', ->
      expect(blueprint.update.methods).to.have.members ['put']

  describe 'find request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.find.methods).to.have.members ['get']

  describe 'findAll request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.findAll.methods).to.have.members ['get']

  describe 'destroy request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.destroy.methods).to.have.members ['delete']
