import { promisify } from 'util'
import zlib from 'zlib'

const pDeflate = promisify(zlib.deflate)
const pInflate = promisify(zlib.inflate)

// Compress to Deflate
const compress = function (content) {
  return pDeflate(content)
}

// Decompress from Deflate
const decompress = function (content) {
  return pInflate(content)
}

export const deflate = {
  name: 'deflate',
  title: 'Deflate',
  compress,
  decompress,
}
