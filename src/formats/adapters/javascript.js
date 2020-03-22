import requireFromString from 'require-from-string'

// Parses a JavaScript file
const parse = function ({ content, path }) {
  if (path === undefined) {
    return requireFromString(content)
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(path)
}

// Serializes a JavaScript file
const serialize = function ({ content }) {
  const json = JSON.stringify(content, null, 2)
  return `module.exports = ${json}`
}

export const javascript = {
  name: 'javascript',
  title: 'JavaScript',
  unsafe: true,
  extensions: ['js', 'mjs'],
  mimes: [
    'application/javascript',
    'application/x-javascript',
    'application/ecmascript',
    'text/javascript',
    'text/ecmascript',
  ],
  mimeExtensions: ['+js', '+mjs'],
  charsets: ['utf-8'],
  jsonCompat: ['superset'],
  parse,
  serialize,
}
