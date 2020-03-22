// Retrieves format's prefered charset
export const getCharset = function ({ charsets: [charset] = [] }) {
  return charset
}

// Checks if charset is supported by format
export const hasCharset = function ({ charsets }, charset) {
  return charsets === undefined || charsets.includes(charset)
}
