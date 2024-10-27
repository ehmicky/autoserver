import { Buffer } from 'node:buffer'

import { throwError } from '../../../errors/main.js'
import { isPatchOp } from '../../../patch/parse.js'
import { isObject } from '../../../utils/functional/type.js'

const { byteLength } = Buffer

// Validate that user passed a correct `args.data`
export const validateData = ({
  datum,
  commandpath,
  top: { command },
  maxAttrValueSize,
}) => {
  const commandpathA = commandpath.join('.')

  validateType({ datum, commandpath: commandpathA })

  validateRequiredId({ datum, commandpath: commandpathA, command })

  validateForbiddenId({ datum, commandpath: commandpathA, command })

  Object.entries(datum).forEach(([attrName, value]) => {
    validateDataValue({
      value,
      attrName,
      commandpath: commandpathA,
      maxAttrValueSize,
    })
  })
}

const validateType = ({ datum, commandpath }) => {
  if (isModelType(datum)) {
    return
  }

  const message = `'data' argument at '${commandpath}' should be an object or an array of objects, instead of: ${JSON.stringify(
    datum,
  )}`
  throwError(message, { reason: 'VALIDATION' })
}

const validateRequiredId = ({ datum, commandpath, command }) => {
  if (
    !REQUIRED_ID_TYPES.has(command.type) ||
    (datum.id !== undefined && datum.id !== null)
  ) {
    return
  }

  const message = `'data' argument at '${commandpath}' is missing an 'id' attribute`
  throwError(message, { reason: 'VALIDATION' })
}

const REQUIRED_ID_TYPES = new Set(['upsert'])

const validateForbiddenId = ({ datum, commandpath, command }) => {
  const forbidsId =
    FORBIDDEN_ID_TYPES.has(command.type) &&
    datum.id !== undefined &&
    datum.id !== null

  if (!forbidsId) {
    return
  }

  const rightArg = command.multiple ? 'filter' : 'id'
  const message = `'data' argument at '${commandpath}' must not have an 'id' attribute '${datum.id}'. 'patch' commands cannot specify 'id' attributes in 'data' argument, because ids cannot be changed. Use '${rightArg}' argument instead.`
  throwError(message, { reason: 'VALIDATION' })
}

const FORBIDDEN_ID_TYPES = new Set(['patch'])

// Validate each attribute's value inside `args.data`
const validateDataValue = ({
  value,
  attrName,
  commandpath,
  maxAttrValueSize,
}) => {
  const isValueTooLong =
    typeof value === 'string' && byteLength(value) > maxAttrValueSize

  if (!isValueTooLong) {
    return
  }

  const message = `'data' argument's '${commandpath}.${attrName}' attribute's value must be shorter than ${maxAttrValueSize} bytes`
  throwError(message, { reason: 'VALIDATION' })
}

export const isModelsType = (val) => {
  if (isModelType(val)) {
    return true
  }

  return Array.isArray(val) && val.every(isModelType)
}

export const isModelType = (obj) => isObject(obj) && !isPatchOp(obj)
