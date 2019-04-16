// No compression
const compress = function(content) {
  return content
}

const decompress = function(content) {
  return content
}

export const identity = {
  name: 'identity',
  title: 'None',
  compress,
  decompress,
}
