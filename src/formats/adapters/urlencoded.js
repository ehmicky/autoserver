import qs from 'qs'

import { getLimits } from '../../limits.js'

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
const parse = function({ content }) {
  const { maxQueryStringDepth, maxQueryStringLength } = getLimits()

  return qs.parse(content, {
    depth: maxQueryStringDepth,
    arrayLimit: maxQueryStringLength,
    allowDots: true,
    decoder,
    ignoreQueryPrefix: true,
  })
}

const decoder = function(str) {
  return decodeURIComponent(str.replace(/\+/gu, ' '))
}

// Inverse of parse()
const serialize = function({ content }) {
  return qs.stringify(content, { allowDots: true })
}

const urlencoded = {
  name: 'urlencoded',
  title: 'query string',
  mimes: ['application/x-www-form-urlencoded'],
  jsonCompat: ['subset'],
  parse,
  serialize,
}

module.exports = {
  urlencoded,
}
