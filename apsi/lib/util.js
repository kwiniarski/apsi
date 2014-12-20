'use strict';

var slice = Array.prototype.slice;
var forge = require('node-forge');
var isAlphaNumeric = /[a-z0-9]/i;

function hmacHash() {
  var args = slice.call(arguments);
  var algorithm = args[0].toLowerCase();
  var key = args[1];
  var data = args.slice(2);
  var hmac = forge.hmac.create();

  hmac.start(algorithm, key);
  data.forEach(function (part) {
    hmac.update(part);
  });

  return hmac.digest().toHex();
}

function utcNow() {
  var now = new Date();
  return Date.UTC.apply(Date, [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  ]);
}

function getRandomIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAlphaNumericChar() {
  var character;
  do {
    character = String.fromCharCode(getRandomIntInRange(48, 122));
  } while (isAlphaNumeric.test(character) === false);
  return character;
}

function generateId(size) {
  var id = '';
  var length = size || 32;
  while (id.length < length) {
    id += getRandomAlphaNumericChar();
  }
  return id;
}

function pbkdf2(password) {
  var salt = forge.random.getBytesSync(128);
  var key = forge.pkcs5.pbkdf2(password, salt, 100, 64);
  var keyHex = forge.util.bytesToHex(key);

  return keyHex;
}

function md5(string) {
  return forge.md.md5.create().update(string).digest().toHex();
}

module.exports = {
  hmacHash: hmacHash,
  utcNow: utcNow,
  generateId: generateId,
  pbkdf2: pbkdf2,
  md5: md5
};
