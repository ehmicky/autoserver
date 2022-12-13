import { uniq } from '../../../utils/functional/uniq.js'
import { getWordsList } from '../../../utils/string.js'

import { TYPES } from './available.js'

// Validates either a model attribute against `patchOp.attribute`,
// or an argument against `patchOp.argument`
export const validateTypes = ({
  possTypes,
  attrTypes,
  attrIsArray,
  strict,
}) => {
  const isValid = attrTypes.every((attrType) =>
    validateType({ possTypes, attrType, attrIsArray, strict }),
  )

  if (isValid) {
    return
  }

  return getValidTypes({ possTypes, strict })
}

const validateType = ({ possTypes, attrType, attrIsArray, strict }) =>
  possTypes.some((possType) =>
    checkType({ possType, attrType, attrIsArray, strict }),
  )

const checkType = ({ possType, attrType, attrIsArray, strict }) => {
  const { isArray: possIsArray, type: possTypeA } = parseType({
    type: possType,
  })

  if (isWrongType({ possIsArray, attrIsArray, strict })) {
    return false
  }

  // Empty array
  if (attrType === 'none') {
    return true
  }

  return compareTypes({ possType: possTypeA, attrType })
}

const isWrongType = ({ possIsArray, attrIsArray, strict }) =>
  shouldBeArray({ possIsArray, attrIsArray }) ||
  shouldNotBeArray({ possIsArray, attrIsArray, strict })

// If TYPE[] is required, attribute must be an array
// If TYPE is required, attribute can be either scalar or an array
// (whose each element will be checked)
const shouldBeArray = ({ possIsArray, attrIsArray }) =>
  possIsArray && !attrIsArray

// For argument values, we do a strict check, i.e. `isArray` must match
const shouldNotBeArray = ({ possIsArray, attrIsArray, strict }) =>
  !possIsArray && attrIsArray && strict

const compareTypes = ({ possType, attrType }) =>
  possType === attrType || (possType === 'number' && attrType === 'integer')

// Returns human-friendly list of possible types
const getValidTypes = ({ possTypes, strict }) => {
  const validTypes = possTypes.map((possType) =>
    getValidType({ type: possType, strict }),
  )
  const singularTypes = stringifyTypes({ validTypes, name: 'name' })
  const pluralTypes = stringifyTypes({ validTypes, name: 'pluralname' })

  if (!pluralTypes) {
    return singularTypes
  }

  const pluralTypesA = `an array of ${pluralTypes}`

  if (!singularTypes) {
    return pluralTypesA
  }

  return `${singularTypes}, or ${pluralTypesA}`
}

const stringifyTypes = ({ validTypes, name }) => {
  const validTypesA = validTypes
    .flatMap((validType) => validType[name])
    .filter((validType) => validType !== undefined)
  const validTypesB = uniq(validTypesA)
  const validTypesC = getWordsList(validTypesB)
  return validTypesC
}

const getValidType = ({ type, strict }) => {
  const { isArray, type: typeA } = parseType({ type })

  const { name, pluralname } = TYPES[typeA]

  if (isArray) {
    return { pluralname }
  }

  if (!strict) {
    return { name, pluralname }
  }

  return { name }
}

const parseType = ({ type }) => {
  const isArray = type.endsWith('[]')
  const typeA = type.replace('[]', '')

  return { isArray, type: typeA }
}
