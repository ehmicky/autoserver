import { parse as hjsonParse, stringify as hjsonStringify } from 'hjson'

// Parses a HJSON file
const parse = ({ content }) => hjsonParse(content)

// Serializes a HJSON file
const serialize = ({ content }) =>
  hjsonStringify(content, { bracesSameLine: true })

export const hjson = {
  name: 'hjson',
  title: 'Hjson',
  extensions: ['hjson'],
  mimes: ['application/hjson', 'text/hjson'],
  mimeExtensions: ['+hjson'],
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charsets: ['utf-8'],
  jsonCompat: [],
  parse,
  serialize,
}
