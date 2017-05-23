'use strict';


const { base64UrlEncode, base64UrlDecode } = require('../../../../utilities');
const { minifyToken, unminifyToken } = require('./minify');


// Encode token from a useable object to a short opaque base64 token
// Token is object:
//   - parts {object[]} (model values)
//      - attrName {string}
//      - value {value}
//   - order_by {string}, filter {string}: used by current query,
//     so it can be used on next pagination requests
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
