import { decode } from 'iconv-lite'

import { addGenPbHandler } from '../errors/handler.js'

// Charset decoding
const eDecodeCharset = function(charset, content) {
  return decode(content, charset)
}

export const decodeCharset = addGenPbHandler(eDecodeCharset, {
  reason: 'CHARSET',
  extra: charset => ({ adapter: charset }),
})
