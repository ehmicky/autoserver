'use strict';

const qs = require('qs');

const { transtype, recurseMap } = require('../../utilities');
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

  const queryvars = qs.parse(content, {
    depth: maxQueryStringDepth,
    arrayLimit: maxQueryStringLength,
    allowDots: true,
    decoder,
    ignoreQueryPrefix: true,
  });

  // Automatic transtyping is performed
  const queryvarsA = recurseMap(queryvars, transtype);

  return queryvarsA;
};

const decoder = function (str) {
  return decodeURIComponent(str.replace(/\+/g, ' '));
};

// Inverse of parse()
const serialize = function ({ content }) {
  const queryvars = recurseMap(content, setToString);

  const queryvarsA = qs.stringify(queryvars, { allowDots: true });

  return queryvarsA;
};

const setToString = function (val) {
  const noJsonNeeded = typeof val === 'string' && transtype(val) === val;
  if (noJsonNeeded) { return val; }

  return JSON.stringify(val);
};

module.exports = {
  name: 'urlencoded',
  title: 'URL encoded string',
  mimes: ['application/x-www-form-urlencoded'],
  parse,
  serialize,
};
