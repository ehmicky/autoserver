'use strict';

const {
  Base64: {
    encodeURI: base64UrlEncode,
    decode: base64UrlDecode,
  },
} = require('js-base64');

const { minifyToken, unminifyToken } = require('./minify');

// Encode token from a useable object to a short opaque base64 token
// Token is object:
//   - parts {any[]} (model values)
//   - nFilter {string}: used by current query,
//     so it can be used on next pagination requests
//   - nOrderBy {object[]} - same as nFilter
//      - nOrderBy.attrName {string} - also used to guess `parts` attributes
//      - nOrderBy.order {string} - 'desc' or 'asc'

const encode = function ({ token }) {
  const minifiedToken = minifyToken({ token });
  const jsonToken = JSON.stringify(minifiedToken);
  const base64Token = base64UrlEncode(jsonToken);
  return base64Token;
};

// Inverse
const decode = function ({ token: base64Token }) {
  const jsonToken = base64UrlDecode(base64Token);
  const minifiedToken = JSON.parse(jsonToken);
  const token = unminifyToken({ token: minifiedToken });
  return token;
};

module.exports = {
  encode,
  decode,
};
