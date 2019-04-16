import { base64UrlEncode, base64UrlDecode } from '../../../../utils/base64.js'

import { addNameShortcuts, removeNameShortcuts } from './minify_names.js'
import { convertUndefined } from './convert_undefined.js'

// Encode token from a usable object to a short opaque base64 token
// Make sure token is small by minifying it
export const encode = function({ token }) {
  return encoders.reduce((tokenA, encoder) => encoder(tokenA), token)
}

const encoders = [
  convertUndefined,
  addNameShortcuts,
  JSON.stringify,
  base64UrlEncode,
]

export const decode = function({ token }) {
  return decoders.reduce((tokenA, decoder) => decoder(tokenA), token)
}

// Inverse
const decoders = [base64UrlDecode, JSON.parse, removeNameShortcuts]
