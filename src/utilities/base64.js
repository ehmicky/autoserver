'use strict';


const { Base64: { encodeURI: base64UrlEncode, decode: base64UrlDecode } } = require('js-base64');


module.exports = {
  base64UrlEncode,
  base64UrlDecode,
};
