// Model references, e.g. model.ATTR
export const isRef = (opVal) => REFERENCE_REGEXP.test(opVal)

export const parseRef = (opVal) => {
  const [, ref] = REFERENCE_REGEXP.exec(opVal) || []
  return ref
}

// Matches model.ATTR -> [, 'ATTR']
const REFERENCE_REGEXP = /^model\.([a-z][_0-9a-z]*)$/u

// Get the config's attribute from a model.ATTR reference
export const getOpValRef = ({ opVal, coll: { attributes } }) => {
  const ref = parseRef(opVal)

  if (ref === undefined) {
    return
  }

  const attr = attributes[ref]

  if (attr === undefined) {
    return `attribute '${ref}' is unknown`
  }

  const { type, isArray } = attr
  return { attrTypes: [type], attrIsArray: isArray }
}

// If operator's argument can only be `empty`, we cannot check model.ATTR
// until it is resolved later.
// If operator's argument contains `empty` but other types too, we can already
// check model.ATTR against them.
export const cannotCheckType = ({ opVal, argument }) =>
  isRef(opVal) && argument.length === 1 && argument[0] === 'empty'
