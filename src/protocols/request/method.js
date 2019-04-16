import { throwPb } from '../../errors/props.js'

import { validateString } from './validate.js'

const parseMethod = function({
  protocolAdapter,
  protocolAdapter: { getMethod },
  specific,
}) {
  if (getMethod === undefined) {
    return
  }

  const method = getMethod({ specific })

  validateString(method, 'method', protocolAdapter)
  validateMethod({ method })

  return { method }
}

const validateMethod = function({ method }) {
  if (method === undefined || METHODS.includes(method)) {
    return
  }

  throwPb({ reason: 'METHOD', extra: { value: method, suggestions: METHODS } })
}

const METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE']

module.exports = {
  parseMethod,
}
