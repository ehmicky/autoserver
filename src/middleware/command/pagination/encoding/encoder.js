'use strict';

const {
  Base64: {
    encodeURI: base64UrlEncode,
    decode: base64UrlDecode,
  },
} = require('js-base64');

const { minifyOrderBy, unminifyOrderBy } = require('./minify_order_by');
const {
  removeDefaultValues,
  addDefaultValues,
} = require('./minify_default_values');
const { addNameShortcuts, removeNameShortcuts } = require('./minify_names');

// Encode token from a useable object to a short opaque base64 token
// Token is object:
//   - parts {any[]} (model values)
//   - nFilter {string}: used by current query,
//     so it can be used on next pagination requests
//   - nOrderBy {object[]} - same as nFilter
//      - nOrderBy.attrName {string} - also used to guess `parts` attributes
//      - nOrderBy.order {string} - 'desc' or 'asc'
// Make sure token is small by minifying it
const encode = function ({ token: oToken }) {
  return encoders.reduce((token, encoder) => encoder(token), oToken);
};

const encoders = [
  removeDefaultValues,
  minifyOrderBy,
  addNameShortcuts,
  JSON.stringify,
  base64UrlEncode,
];

const decode = function ({ token: oToken }) {
  return decoders.reduce((token, decoder) => decoder(token), oToken);
};

// Inverse
const decoders = [
  base64UrlDecode,
  JSON.parse,
  removeNameShortcuts,
  unminifyOrderBy,
  addDefaultValues,
];

module.exports = {
  encode,
  decode,
};
