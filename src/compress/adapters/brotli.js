import { promisify } from 'node:util'
import { brotliCompress, brotliDecompress } from 'node:zlib'

// Compress to Brotli
const compress = (content) => {
  const pBrotliCompress = promisify(brotliCompress)
  return pBrotliCompress(content)
}

// Decompress from Brotli
const decompress = (content) => {
  const pBrotliDecompress = promisify(brotliDecompress)
  return pBrotliDecompress(content)
}

export const brotli = {
  name: 'br',
  title: 'Brotli',
  compress,
  decompress,
}
