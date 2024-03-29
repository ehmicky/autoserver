import { throwPb } from '../../errors/props.js'
import { parsePatchOp } from '../parse.js'

import { POST_VALIDATORS } from './post_validators.js'
import { PRE_VALIDATORS } from './pre_validators.js'

// Validate patch operation has valid syntax, during args.data parsing
export const preValidate = ({
  patchOp,
  commandpath,
  attrName,
  top,
  maxAttrValueSize,
  coll,
  coll: { attributes },
  mInput,
  config: { operators },
}) => {
  const attr = attributes[attrName]

  const { type, opVal } = parsePatchOp(patchOp)

  // E.g. if this is not a patch operation
  if (type === undefined) {
    return
  }

  const operator = operators[type]
  const validators = PRE_VALIDATORS

  validatePatchOp({
    patchOp,
    top,
    operator,
    type,
    opVal,
    attr,
    coll,
    maxAttrValueSize,
    commandpath,
    attrName,
    validators,
    mInput,
  })
}

// Validate patch operation has valid syntax, after model.ATTR resolution
export const postValidate = (input) => {
  const validators = POST_VALIDATORS

  validatePatchOp({ ...input, validators })
}

// Try each validator in order, stopping at the first one that returns an error
const validatePatchOp = (input) => {
  const { commandpath, attrName, patchOp, validators } = input

  const validatorA = validators.find(
    (validator) => validator(input) !== undefined,
  )

  if (validatorA === undefined) {
    return
  }

  const error = validatorA(input)

  checkError({ error, commandpath, attrName, patchOp })
}

const checkError = ({ error, commandpath, attrName, patchOp }) => {
  const commandpathA = [...commandpath, attrName].join('.')
  const prefix = `At '${commandpathA}', wrong operation '${JSON.stringify(
    patchOp,
  )}': `

  if (error instanceof Error) {
    error.message = `${prefix}${error.message}`
    throw error
  }

  throwPb({
    reason: 'VALIDATION',
    message: `${prefix}${error}`,
    extra: { value: patchOp, path: commandpathA },
  })
}
