/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = {
  users: {
    find: {
      mountPath: /^\/([\w\.]+@[\w\.]+)$/i
    },
    addAvatarImage: {
      methods: ['POST'],
      mountPath: '/add-image'
    }
  }
};
