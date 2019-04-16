// Model references, e.g. model.ATTR
export const isRef = function(opVal) {
  return REFERENCE_REGEXP.test(opVal)
}

export const parseRef = function(opVal) {
  const [, ref] = REFERENCE_REGEXP.exec(opVal) || []
  return ref
}

// Matches model.ATTR -> [, 'ATTR']
const REFERENCE_REGEXP = /^model\.([a-z][_0-9a-z]*)$/u
