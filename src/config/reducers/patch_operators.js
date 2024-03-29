import { OPERATORS } from '../../patch/operators/main.js'
import { mapValues } from '../../utils/functional/map.js'
import { uniq } from '../../utils/functional/uniq.js'

// Parse `operators.attribute|argument` `any`
export const normalizePatchOperators = ({ config: { operators } }) => {
  if (operators === undefined) {
    return
  }

  const operatorsA = mapValues(operators, normalizePatchOperator)

  // Merge system patch operators and config-defined ones
  const operatorsB = { ...operatorsA, ...OPERATORS }

  return { operators: operatorsB }
}

const normalizePatchOperator = (operator) => {
  const field = normalizeField({ operator, name: 'attribute' })
  return { ...operator, ...field }
}

const normalizeField = ({ operator, name }) => {
  const { [name]: field } = operator

  if (field === undefined) {
    return
  }

  const types = TYPES[name]
  const fieldA = field.flatMap((type) => types[type] || type)
  const fieldB = uniq(fieldA)
  return { [name]: fieldB }
}

const TYPES = {
  attribute: {
    any: ['boolean', 'integer', 'number', 'string'],
    'any[]': ['boolean[]', 'integer[]', 'number[]', 'string[]'],
  },
  argument: {
    any: ['boolean', 'integer', 'number', 'string', 'empty', 'object'],
    'any[]': [
      'boolean[]',
      'integer[]',
      'number[]',
      'string[]',
      'empty[]',
      'object[]',
    ],
  },
}
