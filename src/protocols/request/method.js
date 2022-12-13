import { throwPb } from '../../errors/props.js'

import { validateString } from './validate.js'

export const parseMethod = ({
  protocolAdapter,
  protocolAdapter: { getMethod },
  specific,
}) => {
  if (getMethod === undefined) {
    return
  }

  const method = getMethod({ specific })

  validateString(method, 'method', protocolAdapter)
  validateMethod({ method })

  return { method }
}

const validateMethod = ({ method }) => {
  if (method === undefined || METHODS.has(method)) {
    return
  }

  throwPb({ reason: 'METHOD', extra: { value: method, suggestions: METHODS } })
}

const METHODS = new Set(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'])
