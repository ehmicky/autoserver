'use strict';

const { base64UrlEncode, base64UrlDecode } = require('../../../../utilities');

const { addNameShortcuts, removeNameShortcuts } = require('./minify_names');
const { convertUndefined } = require('./convert_undefined');

// Encode token from a usable object to a short opaque base64 token
// Make sure token is small by minifying it
const encode = function ({ token }) {
  return encoders.reduce((tokenA, encoder) => encoder(tokenA), token);
};

const encoders = [
  convertUndefined,
  addNameShortcuts,
  JSON.stringify,
  base64UrlEncode,
];

const decode = function ({ token }) {
  return decoders.reduce((tokenA, decoder) => decoder(tokenA), token);
};

// Inverse
const decoders = [
  base64UrlDecode,
  JSON.parse,
  removeNameShortcuts,
];

module.exports = {
  encode,
  decode,
};
