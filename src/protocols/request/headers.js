import { validateObject } from './validate.js'

export const parseHeaders = function ({
  protocolAdapter,
  protocolAdapter: { getHeaders },
  specific,
}) {
  if (getHeaders === undefined) {
    return
  }

  const headers = getHeaders({ specific })

  validateObject(headers, 'headers', protocolAdapter)

  return { headers }
}
