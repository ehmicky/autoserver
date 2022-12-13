import { promisify } from 'node:util'
import { deflate as zlibDeflate, inflate as zlibInflate } from 'node:zlib'

const pDeflate = promisify(zlibDeflate)
const pInflate = promisify(zlibInflate)

// Compress to Deflate
const compress = (content) => pDeflate(content)

// Decompress from Deflate
const decompress = (content) => pInflate(content)

export const deflate = {
  name: 'deflate',
  title: 'Deflate',
  compress,
  decompress,
}
