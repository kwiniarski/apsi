'use strict';
module.exports = function (method, url) {
  return {
    method: (method || 'GET').toUpperCase(),
    url: url || '/',
    ip: '127.0.0.1',
    _remoteAddress: '127.0.0.1',
    headers: {
      referer: 'http://referer.com',
      'user-agent': 'PhantomJS'
    },
    httpVersionMajor: 1,
    httpVersionMinor: 1
  };
};
