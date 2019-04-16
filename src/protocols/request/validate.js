import { isObject } from '../../utils/functional/type.js'
import { throwPb } from '../../errors/props.js'

export const validateSpecific = function({
  specific,
  protocolAdapter: { name: protocol },
}) {
  if (isObject(specific)) {
    return
  }

  const message = `'specific' must be an object, not ${specific}`
  throwPb({ message, reason: 'PROTOCOL', extra: { adapter: protocol } })
}

export const validateString = function(value, name, protocolAdapter) {
  if (typeof value === 'string') {
    return
  }

  throwProtocolError('a string', { value, name, protocolAdapter })
}

export const validateObject = function(value, name, protocolAdapter) {
  if (isObject(value)) {
    return
  }

  throwProtocolError('an object', { value, name, protocolAdapter })
}

export const validateBoolean = function(value, name, protocolAdapter) {
  if (typeof value === 'boolean') {
    return
  }

  throwProtocolError('a boolean', { value, name, protocolAdapter })
}

const throwProtocolError = function(type, { value, name, protocolAdapter }) {
  const message = `${name} must be ${type}, not ${JSON.stringify(value)}`
  throwPb({
    message,
    reason: 'PROTOCOL',
    extra: { adapter: protocolAdapter.name },
  })
}
