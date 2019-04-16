import { getContentType } from './content_type.js'

// Use similar logic as `args.format`, but for `args.charset`
const getCharset = function({ specific }) {
  const { charset } = getContentType({ specific })
  return charset
}

module.exports = {
  getCharset,
}
