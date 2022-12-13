// No compression
const compress = (content) => content

const decompress = (content) => content

export const identity = {
  name: 'identity',
  title: 'None',
  compress,
  decompress,
}
