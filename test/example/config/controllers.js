/**
 * @author Krzysztof Winiarski
 * @copyright (c) 2014 Krzysztof Winiarski
 * @license MIT
 */

'use strict';

module.exports = {
  user: {
    find: {
      route: /^\/([\w\.]+@[\w\.]+)$/i
    },
    addAvatarImage: {
      methods: ['POST'],
      route: '/add-image'
    }
  }
};
