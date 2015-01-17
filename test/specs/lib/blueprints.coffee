'use strict'

sinon = require 'sinon'
blueprints = require '../../../lib/blueprints'

describe 'Blueprints provider', ->

  blueprint = null
  model = null
  req = null
  res = null
  next = null

  beforeEach ->
    model =
      done: sinon.stub()
      create: sinon.spy -> model
      upsert: sinon.spy -> model
      find: sinon.spy -> model
      findAll: sinon.spy -> model
      destroy: sinon.spy -> model

    blueprint = blueprints.getDefaultActions model, 'resources'

    req = require('../../mocks/express-request')()
    res = require('../../mocks/express-response')()
    next = sinon.spy ->

    require('../../../middleware/request') req, res, ->
    require('../../../middleware/response') req, res, ->

    req.params = [1]

    res.created = sinon.spy res.created
    res.ok = sinon.spy res.ok
    res.noContent = sinon.spy res.noContent

  describe 'create request handler', ->
    it 'should be configured as a POST method', ->
      expect(blueprint.create.methods).to.have.members ['post']

    it 'should finalize valid request', ->
      model.done.yields null, { id: 1 }
      blueprint.create.fn(req, res, next)

      expect(model.create).to.have.been.calledOnce
      expect(next).to.have.been.not.called
      expect(res.created).to.have.been.calledWith '/resources/1'

    it 'should fail request on error', ->
      model.done.yields 'error'
      blueprint.create.fn(req, res, next)

      expect(model.create).to.have.been.calledOnce
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called

  describe 'update request handler', ->
    it 'should be configured as a PUT method', ->
      expect(blueprint.update.methods).to.have.members ['put']

    it 'should finalize valid request with unexisting record', ->
      model.done.yields null, true
      blueprint.update.fn(req, res, next)

      expect(model.upsert).to.have.been.calledOnce
      expect(next).to.have.been.not.called
      expect(res.created).to.have.been.calledWith '/resources/1'
      expect(res.noContent).to.have.been.not.called

    it 'should finalize valid request with existing record', ->
      model.done.yields null, false
      blueprint.update.fn(req, res, next)

      expect(model.upsert).to.have.been.calledOnce
      expect(next).to.have.been.not.called
      expect(res.created).to.have.been.not.called
      expect(res.noContent).to.have.been.calledOnce

    it 'should fail request on error', ->
      model.done.yields 'error'
      blueprint.update.fn(req, res, next)

      expect(model.upsert).to.have.been.calledOnce
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called
      expect(res.noContent).to.have.been.not.called

  describe 'find request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.find.methods).to.have.members ['get']

    it 'should finalize valid request with data', ->
      model.done.yields null, true
      blueprint.find.fn(req, res, next)

      expect(model.find).to.have.been.calledWith 1
      expect(next).to.have.been.not.called
      expect(res.ok).to.have.been.calledWith true

    it 'should finalize valid request without data', ->
      model.done.yields null, null
      blueprint.find.fn(req, res, next)

      expect(model.find).to.have.been.calledWith 1
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called

    it 'should fail request on error', ->
      model.done.yields 'error'
      blueprint.find.fn(req, res, next)

      expect(model.find).to.have.been.calledWith 1
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called

  describe 'findAll request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.findAll.methods).to.have.members ['get']

    it 'should finalize valid request with data', ->
      model.done.yields null, true
      blueprint.findAll.fn(req, res, next)

      expect(model.findAll).to.have.been.calledOnce
      expect(next).to.have.been.not.called
      expect(res.ok).to.have.been.calledWith true

    it 'should finalize valid request without data', ->
      model.done.yields null, null
      blueprint.findAll.fn(req, res, next)

      expect(model.findAll).to.have.been.calledOnce
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called

    it 'should fail request on error', ->
      model.done.yields 'error'
      blueprint.findAll.fn(req, res, next)

      expect(model.findAll).to.have.been.calledOnce
      expect(next).to.have.been.calledOnce
      expect(res.created).to.have.been.not.called

  describe 'destroy request handler', ->
    it 'should be configured as a GET method', ->
      expect(blueprint.destroy.methods).to.have.members ['delete']

    it 'should finalize valid request with data', ->
      model.done.yields null
      blueprint.destroy.fn(req, res, next)

      expect(model.destroy).to.have.been.calledOnce
      expect(next).to.have.been.not.called
      expect(res.noContent).to.have.been.calledOnce

    it 'should fail request on error', ->
      model.done.yields 'error'
      blueprint.destroy.fn(req, res, next)

      expect(model.destroy).to.have.been.calledOnce
      expect(next).to.have.been.calledOnce
      expect(res.noContent).to.have.been.not.called
