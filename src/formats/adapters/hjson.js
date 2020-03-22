import { parse as hjsonParse, stringify as hjsonStringify } from 'hjson'

// Parses a HJSON file
const parse = function ({ content }) {
  return hjsonParse(content)
}

// Serializes a HJSON file
const serialize = function ({ content }) {
  return hjsonStringify(content, { bracesSameLine: true })
}

export const hjson = {
  name: 'hjson',
  title: 'Hjson',
  extensions: ['hjson'],
  mimes: ['application/hjson', 'text/hjson'],
  mimeExtensions: ['+hjson'],
  charsets: ['utf-8'],
  jsonCompat: [],
  parse,
  serialize,
}
