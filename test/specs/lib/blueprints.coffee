'use strict'

sinon = require 'sinon'
blueprints = require '../../../lib/blueprints'

describe 'Blueprints provider', ->

  blueprint = null
  model = null
  req = null
  res = null

  beforeEach ->
    model =
      then: sinon.spy()
      bulkCreate: sinon.spy -> model
      create: sinon.spy -> model
      update: sinon.spy -> model
      upsert: sinon.spy -> model
      find: sinon.spy -> model
      findOne: sinon.spy -> model
      findAll: sinon.spy -> model
      destroy: sinon.spy -> model

    blueprint = blueprints.getDefaultActions model, 'resources'

    req = require('../../mocks/express-request')()
    res = require('../../mocks/express-response')()

    require('../../../middleware/request') req, res, ->
    require('../../../middleware/response') req, res, ->

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

    it 'should be able to update single query with given id', ->
      req.params.id = 1;
      req.body = {}
      blueprint.update.fn req
      expect(model.upsert).to.have.been.calledWith id: 1

    it 'should be able to update multiple resources which meet given criteria', ->
      req.query =
        active: 1
      req.body = {}
      blueprint.update.fn req
      expect(model.update).to.have.been.calledWith {}, where: active: 1

  describe 'find request handler', ->

    it 'should be configured as a GET method', ->
      expect(blueprint.find.methods).to.have.members ['get']

    it 'should be able to retrieve single resource with given id', ->
      req.params.id = 1;
      blueprint.find.fn req
      expect(model.findOne).to.have.been.calledWith 1

    it 'should be able to retrieve multiple resources which meet given criteria', ->
      req.query =
        active: 1
      blueprint.find.fn req
      expect(model.findAll).to.have.been.calledWith where: active: 1


  describe 'destroy request handler', ->
    it 'should be configured as a DELETE method', ->
      expect(blueprint.destroy.methods).to.have.members ['delete']

    it 'should be able to destroy single resource with given id', ->
      req.params.id = 1;
      blueprint.destroy.fn req
      expect(model.destroy).to.have.been.calledWith where: id: 1

    it 'should be able to destroy multiple resources which meet given criteria', ->
      req.params.id = 1;
      blueprint.destroy.fn req
      expect(model.destroy).to.have.been.calledWith where: id: 1
