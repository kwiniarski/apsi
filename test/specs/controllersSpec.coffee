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
    registerMock '/app/api/controllers/resources',
      find: noop
    registerMock '/app/api/controllers/users',
      find: noop
      listAvatarImages: noop
      addAvatarImage: noop
    registerMock '/app/config/controllers',
      users:
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
    expect(controllers.users).to.be.eql
      find:
        methods: ['get'],
        route: blueprints.routes.find,
        fn: noop
      listAvatarImages:
        methods: ['get'],
        route: '/list-avatar-images',
        fn: noop
      addAvatarImage:
        methods: ['post'],
        route: '/add-image',
        fn: noop





