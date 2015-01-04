'use strict'

configFixture = require '../fixtures/config'
blueprints = require '../../lib/blueprints'
mockery = require 'mockery'
fs = require 'fs'
path = require 'path'
sinon = require 'sinon'

controllers = null
fsStub = null
noop = ->

describe 'Controllers provider', ->

  before ->

    fsStub = sinon.stub fs, 'readdirSync'
    fsStub.withArgs(path.normalize '/app/api/controllers').returns ['resources', 'users']
    fsStub.throws 'STUB_ENOENT'

    registerMock '../config', configFixture
    registerMock './models',
      resources: true
      users: true
    registerMock '/app/api/controllers/resources',
      find: noop
    registerMock '/app/api/controllers/users',
      find: noop
      listAvatarImages: noop
      addAvatarImage: noop
    registerMock '/app/config/controllers',
      users:
        find:
          route: /^\/([\w\.]+@[\w\.]+)$/i
        addAvatarImage:
          methods: ['POST']
          route: '/add-image'

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    controllers = require '../../lib/controllers'

  after ->

    fsStub.restore()
    mockery.deregisterAll()
    mockery.disable()

  it 'should return list of configured controllers', ->
    expect(controllers).to.have.keys ['resources', 'users']

  it 'should return list of replaced blueprint actions', ->
    expect(controllers).to.have.property '_replaced'

  describe 'controller object', ->
    it 'should contain blueprint methods with custom methods', ->
      expect(controllers.users).to.have.keys [
        'find', 'findAll', 'create', 'update', 'destroy',
        'listAvatarImages', 'addAvatarImage'
      ]
    it 'blueprint overwritten actions should call user custom action', ->
      expect(controllers.users.find.fn).to.equal noop
      expect(controllers.users.find.route).to.eql /^\/([\w\.]+@[\w\.]+)$/i
    it 'actions altered by configuration should be correctly registered', ->
      expect(controllers.users.addAvatarImage.methods).to.eql ['post']
      expect(controllers.users.addAvatarImage.route).to.equal '/add-image'

  describe 'replaced actions', ->
    it 'should contain reference to blueprint routes with custom method attached', ->
      expect(controllers._replaced.users.find.fn).to.equal noop
      expect(controllers._replaced.users.find.route).to.eql /^\/(\d+)$/


