import { decode } from 'iconv-lite'

import { addGenPbHandler } from '../errors/handler.js'

// Charset decoding
const decodeCharset = function(charset, content) {
  return decode(content, charset)
}

const eDecodeCharset = addGenPbHandler(decodeCharset, {
  reason: 'CHARSET',
  extra: charset => ({ adapter: charset }),
})

module.exports = {
  decodeCharset: eDecodeCharset,
}
