import { promisify } from 'util'
import { deflate as zlibDeflate, inflate as zlibInflate } from 'zlib'

const pDeflate = promisify(zlibDeflate)
const pInflate = promisify(zlibInflate)

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
