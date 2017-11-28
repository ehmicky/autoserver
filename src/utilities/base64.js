'use strict';

// Encodes and decodes base64 (RFC 4648)
// We use the `base64url` variant, as we need it to be URL-friendly
// This is much faster than libraries like js-base64
const base64UrlEncode = function (str) {
  const strA = Buffer.from(str).toString('base64');
  const strB = strA
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return strB;
};

const base64UrlDecode = function (str) {
  const strA = str
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const strB = Buffer.from(strA, 'base64').toString();
  return strB;
};

module.exports = {
  base64UrlEncode,
  base64UrlDecode,
};
