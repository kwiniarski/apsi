'use strict'

configFixture = require '../fixtures/config'
controllersFixture =
  resources:
    create: ->
    find: ->
    findAll: ->
    destroy: ->
    update: ->
  users:
    create: ->
    find: ->
    findAll: ->
    destroy: ->
    update: ->

path = require 'path'
sinon = require 'sinon'
support = require '../../lib/support'
supportStub = null

policies = null
policiesConfigFixture =
  '*': ['isMobile']
  resources:
    create: ['isAdmin', 'isAuthenticated']
  users:
    '*': 'isAdmin'

isMobile = ->
isAuthenticated = ->
isAdmin = ->

describe 'Policies provider', ->

  beforeEach ->
    supportStub = sinon.stub support, 'listFiles'
    supportStub.withArgs(configFixture.POLICIES_DIR).returns
      isMobile: path.normalize configFixture.POLICIES_DIR + '/isMobile'
      isAuthenticated: path.normalize configFixture.POLICIES_DIR + '/isAuthenticated'
      isAdmin: path.normalize configFixture.POLICIES_DIR + '/isAdmin'
    supportStub.throws 'STUB_ENOENT'

    registerMock './support', support
    registerMock '../config', configFixture
    registerMock '/app/config/policies', policiesConfigFixture
    registerMock '/app/api/policies/isMobile', isMobile
    registerMock '/app/api/policies/isAuthenticated', isAuthenticated
    registerMock '/app/api/policies/isAdmin', isAdmin

    mockery.enable
      warnOnUnregistered: false
      warnOnReplace: false
      useCleanCache: true

    policies = require '../../lib/policies'

  afterEach ->
    supportStub.restore()
    mockery.deregisterAll()
    mockery.disable()

  describe 'module object', ->
    it 'should provide list of polices for all known controllers and their actions', ->
      expect(policies).to.have.keys ['resources', 'users']

  describe 'Policy object', ->
    it 'should provide list of configured policies', ->
      expect(policies.resources).to.have.keys ['create']

  describe 'top level wildcard configuration (*)', ->
    it 'should be used for all actions in all controllers unless overwritten by controller level policies', ->
      expect(policies.users._all).to.eql [isAdmin]
      expect(policies.resources._all).to.eql [isMobile]
      expect(policies.resources.create).to.eql [isAdmin, isAuthenticated]

  describe 'action policies getter', ->
    it 'should return policies for controller\'s action if it was configured', ->
      expect(policies.resources.get 'create').to.eql [isAdmin, isAuthenticated]
    it 'should return policies for all actions (*) if it was not configured', ->
      expect(policies.resources.get 'find').to.eql [isMobile]
