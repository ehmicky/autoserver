import { Buffer } from 'buffer'

// Encodes and decodes base64 (RFC 4648)
// We use the `base64url` variant, as we need it to be URL-friendly
// This is much faster than libraries like js-base64
export const base64UrlEncode = function (str) {
  const strA = Buffer.from(str).toString('base64')
  const strB = strA.replace(/\+/gu, '-').replace(/\//gu, '_').replace(/=/gu, '')
  return strB
}

export const base64UrlDecode = function (str) {
  const strA = str.replace(/-/gu, '+').replace(/_/gu, '/')
  const strB = Buffer.from(strA, 'base64').toString()
  return strB
}
