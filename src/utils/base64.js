import { Buffer } from 'node:buffer'

// Encodes and decodes base64 (RFC 4648)
// We use the `base64url` variant, as we need it to be URL-friendly
// This is much faster than libraries like js-base64
export const base64UrlEncode = (str) => {
  const strA = Buffer.from(str).toString('base64')
  const strB = strA
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  return strB
}

export const base64UrlDecode = (str) => {
  const strA = str.replaceAll('-', '+').replaceAll('_', '/')
  const strB = Buffer.from(strA, 'base64').toString()
  return strB
}
