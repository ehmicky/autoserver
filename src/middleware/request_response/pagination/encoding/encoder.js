'use strict';

const {
  Base64: {
    encodeURI: base64UrlEncode,
    decode: base64UrlDecode,
  },
} = require('js-base64');

const { minifyOrderby, unminifyOrderby } = require('./minify_orderby');
const {
  removeDefaultValues,
  addDefaultValues,
} = require('./minify_default_values');
const { addNameShortcuts, removeNameShortcuts } = require('./minify_names');
const { convertUndefined } = require('./convert_undefined');

// Encode token from a useable object to a short opaque base64 token
// Token is object:
//   - parts {any[]} (model values)
//   - filter {object}: used by current query,
//     so it can be used on next pagination requests
//   - orderby {object[]} - same as filter
//      - orderby.attrName {string} - also used to guess `parts` attributes
//      - orderby.order {string} - 'desc' or 'asc'
// Make sure token is small by minifying it
const encode = function ({ token }) {
  return encoders.reduce((tokenA, encoder) => encoder(tokenA), token);
};

const encoders = [
  convertUndefined,
  removeDefaultValues,
  minifyOrderby,
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
  unminifyOrderby,
  addDefaultValues,
];

module.exports = {
  encode,
  decode,
};
