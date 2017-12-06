'use strict';

const qs = require('qs');

const { getLimits } = require('../../limits');

// Parse x-www-form-urlencoded, e.g. used in query strings
// Can use the following notations:
//  - ?var[subvar]=val -> { var: { subvar: val } }
//  - ?var.subvar=val -> { var: { subvar: val } }
//  - ?var[0]=val -> { var: [ val ] }
//  - ?var.0=val -> { var: [ val ] }
//  - ?var[]=val&var[]=secondval -> { var: [ val, secondval ] }
//  - ?var=5 -> { var: 5 }
//  - ?var="5" -> { var: '5' }
//  - ?var -> { var: '' }
//  - ?var= -> { var: '' }
//  - ?var="" -> { var: '' }
//  - ?var=null -> { var: null }
//  - ?var=undefined -> { var: 'undefined' }
//  - ? -> {}
// Performs proper URI decoding, using decodeURIComponent()
const parse = function ({ content }) {
  const { maxQueryStringDepth, maxQueryStringLength } = getLimits();

  return qs.parse(content, {
    depth: maxQueryStringDepth,
    arrayLimit: maxQueryStringLength,
    allowDots: true,
    decoder,
    ignoreQueryPrefix: true,
  });
};

const decoder = function (str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};

// Inverse of parse()
const serialize = function ({ content }) {
  return qs.stringify(content, { allowDots: true });
};

module.exports = {
  name: 'urlencoded',
  title: 'query string',
  types: ['payload'],
  mimes: ['application/x-www-form-urlencoded'],
  jsonCompat: ['subset'],
  parse,
  serialize,
};
