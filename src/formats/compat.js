import { recurseMap } from '../utils/functional/map.js'
import { transtype } from '../utils/transtype.js'

// All formats must be JSON-compatible.
// Depending on format.jsonCompat:
//  - 'subset': means array, object, strings are supported, but numbers,
//    booleans or null might not be supported, so they are transtyped from
//    string on parsing, and transtyped back to string on serializing
//  - 'superset': supports some types not allowed in JSON.
//    Those extra types are removed by being JSON serialized.
// Formats that do not support arrays, objects or strings cannot be specified.
export const applyCompatParse = ({ jsonCompat, content }) =>
  jsonCompat.reduce(
    (contentA, compatType) => jsonCompatParse[compatType](contentA),
    content,
  )

export const applyCompatSerialize = ({ jsonCompat, content }) =>
  jsonCompat.reduce(
    (contentA, compatType) => jsonCompatSerialize[compatType](contentA),
    content,
  )

const subsetParse = (value) => recurseMap(value, transtype)

const subsetSerialize = (value) => recurseMap(value, setToString)

const setToString = (val) => {
  // Strings are kept as is, unless they would be parsed back to a number,
  // boolean or null
  const noJsonNeeded = typeof val === 'string' && transtype(val) === val

  if (noJsonNeeded) {
    return val
  }

  return JSON.stringify(val)
}

// eslint-disable-next-line unicorn/prefer-structured-clone
const supersetParseStringify = (value) => JSON.parse(JSON.stringify(value))

const jsonCompatParse = {
  subset: subsetParse,
  superset: supersetParseStringify,
}

const jsonCompatSerialize = {
  subset: subsetSerialize,
  superset: supersetParseStringify,
}
