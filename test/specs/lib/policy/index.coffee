# PolicyRegistry.BLOCK_MIDDLEWARE = false
# PolicyRegistry.ALLOW_MIDDLEWARE = true
#
# pr = new PolicyRegistry
#   dir: 'some/dir',
#   blockMiddleware: (req, res, next) -> next true
#   allowMiddleware: (req, res, next) -> next()
#
# pr.get 'is-admin'
# pr.get 'isAdmin'
# pr.get PolicyRegistry.BLOCK_MIDDLEWARE
# pr.get PolicyRegistry.ALLOW_MIDDLEWARE

sinon = require 'sinon'
support = require '../../../../lib/support'
PolicyRegistry = require '../../../../lib/policy/registry'
PolicyManager = require '../../../../lib/policy/manager'
PolicyConfig = require '../../../../lib/policy/config'

base = '/home/project'
file =
  file: '/home/project/lib/file.js'
  path: 'lib/file'
  name: 'libFile'

describe 'PolicyRegistry', ->

  beforeEach ->
    sinon.stub support, 'loadModules'
      .withArgs base
      .returns [ file ]

    sinon.stub support, 'require'
      .returns file

  afterEach ->
    support.require.restore()
    support.loadModules.restore()

  it 'should load all policies from specified dir', ->

    sinon.mock PolicyRegistry::
      .expects 'set'
      .withExactArgs file.name, file.file

    new PolicyRegistry
      dir: base

    PolicyRegistry::set.restore()

  describe 'method to get policy', ->

    pm = null
    config = null

    beforeEach ->
      config =
        dir: base
        blockMiddleware: (req, res, next) -> next true
        allowMiddleware: (req, res, next) -> next()

      pm = new PolicyRegistry config

    it 'should return policy by name', ->
      expect(pm.get 'libFile').to.be.equal(file)

    it 'should return allow method when name is set to allow flag', ->
      expect(pm.get true).to.be.equal(config.allowMiddleware)

    it 'should return block method when name is set to block flag', ->
      expect(pm.get false).to.be.equal(config.blockMiddleware)

    it 'should throw error when requested policy is not found', ->
      expect(-> pm.get 'unknown').to.throw(ReferenceError)

    it.skip 'should return an error when trying to get not configured block/allow middleware', ->
      pm = new PolicyRegistry dir: base
      expect(-> pm.get true).to.throw(Error)
      expect(-> pm.get false).to.throw(Error)

# PolicyManager.WILDCARD = '*'
#
# pm = new PolicyManager pr,
#   wildcard: '*'
#
# pm.getPolicies 'someResource', 'action'

describe 'PolicyManager', ->

  base = '/home/policies'
  list = [
    { file: '/home/policies/a-policy.js', path: 'a-policy', name: 'aPolicy' },
    { file: '/home/policies/b-policy.js', path: 'b-policy', name: 'bPolicy' },
  ]
  aPolicy = sinon.spy()
  bPolicy = sinon.spy()
  allowPolicy = sinon.spy()
  blockPolicy = sinon.spy()
  pr = null
  pm = null
  pc = null
  config =
    '*': ['aPolicy'],
    'a-resource':
      '*': [ true ],
      'a-action': ['bPolicy']
    'b-resource':
      '*': [ false ],
      'b-action': ['aPolicy', 'bPolicy']
    'c-resource':
      '*': ['aPolicy']
    'd-resource': ['aPolicy']

  beforeEach ->
    sinon.stub support, 'loadModules'
      .withArgs base
      .returns list

    sinon.stub support, 'require'

    support.require
      .withArgs '/home/policies/a-policy.js'
      .returns aPolicy

    support.require
      .withArgs '/home/policies/b-policy.js'
      .returns bPolicy

    pr = new PolicyRegistry dir: base, allowMiddleware: allowPolicy, blockMiddleware: blockPolicy
    pc = new PolicyConfig config
    pm = new PolicyManager pr, pc

  afterEach ->
    support.require.restore()
    support.loadModules.restore()
    aPolicy.reset()
    bPolicy.reset()
    allowPolicy.reset()
    blockPolicy.reset()

  it 'should provide all policies for specified resource', ->
    expect(pm.get 'c-resource').to.deep.equal([ aPolicy ])
    expect(pm.get 'd-resource').to.deep.equal([ aPolicy ])

  it 'should provide all policies for specified resource action', ->
    expect(pm.get 'b-resource', 'b-action').to.deep.equal([ aPolicy, bPolicy ])

  it 'should return configured allow function if resource was configured with allow flag', ->
    expect(pm.get 'a-resource').to.deep.equal([ allowPolicy ])
    expect(pm.get 'a-resource', 'z-action').to.deep.equal([ allowPolicy ])

  it 'should return configured block function if resource was configured with block flag', ->
    expect(pm.get 'b-resource').to.deep.equal([ blockPolicy ])

  it 'should provide resource policies when asked for action which is not configured', ->
    expect(pm.get 'c-resource', 'z-action').to.deep.equal([ aPolicy ])

  it 'should provide global policies when asked for resource which is not configured', ->
    expect(pm.get()).to.deep.equal([ aPolicy ])
    expect(pm.get 'z-resource').to.deep.equal([ aPolicy ])
    expect(pm.get 'z-resource', 'z-action').to.deep.equal([ aPolicy ])

describe 'PolicyConfig', ->

  pc = null
  baseA = '/home/config/policies.js'
  configA =
    a: true
    b: 'aPolicy'
    c: 'a-policy, b-policy'
    d: ['a-policy, b-policy', 'c-policy']
    e:
      a: true

  baseB = '/home/config/policies-error.js'
  configB =
    a: ['aPolicy', true ]

  beforeEach ->
    sinon.stub support, 'require'

    support.require
      .withArgs baseA
      .returns configA

    support.require
      .withArgs baseB
      .returns configB

    pc = new PolicyConfig baseA

  afterEach ->
    support.require.restore()

  it 'should load configuration file', ->
    expect(support.require).to.be.calledWith(baseA)

  it 'should convert boolen and string values to arrays', ->
    expect(pc.a).to.be.deep.equal([ true ])
    expect(pc.b).to.be.deep.equal(['aPolicy'])

  it 'should convert strings to arrays if they contain coma sign', ->
    expect(pc.c).to.be.deep.equal(['aPolicy', 'bPolicy'])

  it.skip 'should flatten values which may be arrays', ->
    expect(pc.d).to.be.deep.equal(['aPolicy', 'bPolicy', 'cPolicy'])

  it 'should throw an error when block/allow policy is used together with custom policies', ->
    expect(-> new PolicyConfig baseB).to.throw(Error)

  it 'should parse values for actions', ->
    expect(pc.e.a).to.be.deep.equal([ true ])
