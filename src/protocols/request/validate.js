import { throwPb } from '../../errors/props.js'
import { isObject } from '../../utils/functional/type.js'

export const validateSpecific = ({
  specific,
  protocolAdapter: { name: protocol },
}) => {
  if (isObject(specific)) {
    return
  }

  const message = `'specific' must be an object, not ${specific}`
  throwPb({ message, reason: 'PROTOCOL', extra: { adapter: protocol } })
}

export const validateString = (value, name, protocolAdapter) => {
  if (typeof value === 'string') {
    return
  }

  throwProtocolError('a string', { value, name, protocolAdapter })
}

export const validateObject = (value, name, protocolAdapter) => {
  if (isObject(value)) {
    return
  }

  throwProtocolError('an object', { value, name, protocolAdapter })
}

export const validateBoolean = (value, name, protocolAdapter) => {
  if (typeof value === 'boolean') {
    return
  }

  throwProtocolError('a boolean', { value, name, protocolAdapter })
}

const throwProtocolError = (type, { value, name, protocolAdapter }) => {
  const message = `${name} must be ${type}, not ${JSON.stringify(value)}`
  throwPb({
    message,
    reason: 'PROTOCOL',
    extra: { adapter: protocolAdapter.name },
  })
}
