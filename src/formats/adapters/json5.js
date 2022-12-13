import json5Lib from 'json5'

// Parses a JSON5 file
const parse = ({ content }) => json5Lib.parse(content)

// Serializes a JSON5 file
const serialize = ({ content }) => json5Lib.stringify(content, undefined, 2)

export const json5 = {
  name: 'json5',
  title: 'JSON5',
  extensions: ['json5'],
  mimes: ['application/json5'],
  mimeExtensions: ['+json5'],
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charsets: ['utf-8'],
  jsonCompat: ['superset'],
  parse,
  serialize,
}
