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

describe 'PolicyRegistry', ->
  it 'should load all files from specified dir'
  describe 'method to get policy'
    it 'should return policy by name'
    it 'should return allow method when name is set to allow flag'
    it 'should return block method when name is set to block flag'
    it 'should throw error when policy is not found'

# PolicyManager.WILDCARD = '*'
#
# pm = new PolicyManager pr,
#   wildcard: '*'
#
# pm.getPolicies 'someResource', 'action'

describe 'PolicyManager', ->
  it 'should provide all policies for specified resource'
  it 'should provide all policies for specified resource action'
  it 'should return empty list of policies if resource was configured with allow flag'
  it 'should return configured block function if resource was configured with block flag'
  it 'should provide resource policies when asked for action for which policies where not configured'
