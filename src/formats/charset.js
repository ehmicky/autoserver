// Retrieves format's prefered charset
export const getCharset = ({ charsets: [charset] = [] }) => charset

// Checks if charset is supported by format
export const hasCharset = ({ charsets }, charset) =>
  charsets === undefined || charsets.includes(charset)
