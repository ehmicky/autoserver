import { pathToFileURL } from 'url'

import requireFromString from 'require-from-string'

// Parses a JavaScript file
const parse = async function ({ content, path }) {
  if (path === undefined) {
    return requireFromString(content)
  }

  const url = pathToFileURL(path)
  const importedValue = await import(url)
  return importedValue.default
}

// Serializes a JavaScript file
const serialize = function ({ content }) {
  const json = JSON.stringify(content, undefined, 2)
  return `export default ${json}`
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
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charsets: ['utf-8'],
  jsonCompat: ['superset'],
  parse,
  serialize,
}
