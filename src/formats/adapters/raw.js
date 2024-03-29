import { Buffer } from 'node:buffer'

const { isBuffer } = Buffer

// Parses a raw value
const parse = ({ content }) => content

// Serializes any value to a string
const serialize = ({ content }) => {
  if (typeof content === 'string') {
    return content
  }

  if (isBuffer(content)) {
    return content.toString()
  }

  return JSON.stringify(content, undefined, 2)
}

// Means this is not a structured type, like media types,
// and unlike JSON or YAML
// This won't be parsed (i.e. returned as is), and will use 'binary' charset
export const raw = {
  name: 'raw',
  title: 'raw',
  extensions: [],
  mimes: [],
  jsonCompat: [],
  parse,
  serialize,
}
