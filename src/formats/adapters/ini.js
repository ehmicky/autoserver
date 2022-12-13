import { parse as iniParse, stringify as iniStringify } from 'ini'

import { fullRecurseMap } from '../../utils/functional/map.js'

// Parses an INI file
const parse = ({ content }) => iniParse(content)

// Serializes an INI file
const serialize = ({ content }) => {
  const contentA = fullRecurseMap(content, escapeEmptyArrays)
  return iniStringify(contentA)
}

// Empty arrays are ignored by `node-ini`, so we need to escape them
const escapeEmptyArrays = (val) => {
  const isEmptyArray = Array.isArray(val) && val.length === 0

  if (!isEmptyArray) {
    return val
  }

  return '[]'
}

export const ini = {
  name: 'ini',
  title: 'INI',
  extensions: ['ini', 'in', 'cfg', 'conf'],
  mimeExtensions: ['+ini'],
  // `node-ini` only supports UTF-8
  // eslint-disable-next-line unicorn/text-encoding-identifier-case
  charsets: ['utf-8'],
  jsonCompat: ['subset'],
  parse,
  serialize,
}
