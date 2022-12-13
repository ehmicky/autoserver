import { throwError } from '../../../../../errors/main.js'
import { mapValues } from '../../../../../utils/functional/map.js'
import { validateDuplicates } from '../duplicates.js'

// Parse GraphQL arguments, for each possible argument type
export const parseArgs = ({
  mainSelection: { arguments: fields },
  variables,
}) => {
  // GraphQL spec 5.3.2 'Argument Uniqueness'
  validateDuplicates({ nodes: fields, type: 'arguments' })

  return parseObject({ fields, variables })
}

const parseObject = ({ fields: args, variables }) => {
  if (!args || args.length === 0) {
    return {}
  }

  // And GraphQL spec 5.5.1 'Input Object Field Uniqueness'
  validateDuplicates({ nodes: args, type: 'arguments' })

  const argsA = args.map((arg) => ({ [arg.name.value]: arg }))
  const argsB = Object.assign({}, ...argsA)
  const argsC = mapValues(argsB, ({ value: arg }) =>
    argParsers[arg.kind]({ ...arg, variables }),
  )
  return argsC
}

const parseArray = ({ values, variables }) =>
  values.map((arg) => argParsers[arg.kind]({ ...arg, variables }))

const parseNumber = ({ value }) => Number(value)

// The only enum value we support is undefined, which is the same as null
const parseEnum = ({ value }) => {
  if (value !== 'undefined') {
    const message = `'${value}' is an unknown constant`
    throwError(message, { reason: 'VALIDATION' })
  }

  // eslint-disable-next-line unicorn/no-null
  return null
}

// eslint-disable-next-line unicorn/no-null
const parseNull = () => null

const parseAsIs = ({ value }) => value

const parseVariable = ({ name, variables }) =>
  variables && variables[name.value]

const argParsers = {
  ObjectValue: parseObject,
  ListValue: parseArray,
  IntValue: parseNumber,
  FloatValue: parseNumber,
  EnumValue: parseEnum,
  NullValue: parseNull,
  StringValue: parseAsIs,
  BooleanValue: parseAsIs,
  Variable: parseVariable,
}
