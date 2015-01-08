/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = {
  '*': ['isTrusted'],
  resources: {
    create: ['isAuthenticated', 'asUser']
  },
  users: {
    '*': ['isAuthenticated', 'asAdmin']
  }
};
