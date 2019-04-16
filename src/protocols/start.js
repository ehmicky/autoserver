import { pick, omit } from '../utils/functional/filter.js'
import { identity } from '../utils/functional/identity.js'
import { mapValues } from '../utils/functional/map.js'

import { parseRequest } from './request/main.js'

// Start the server
const start = async function(
  protocolAdapter,
  { requestHandler, getRequestInput = identity, opts = {}, config = {} },
) {
  const { name: protocol, startServer, stopServer } = protocolAdapter

  const protocolAdapterA = getRequestAdapter({ protocolAdapter })

  const handleRequest = processRequest.bind(null, {
    requestHandler,
    getRequestInput,
    protocolAdapter: protocolAdapterA,
    protocol,
  })

  const info = await startServer({ opts, config, handleRequest })

  // Expose the `stopServer()` method
  const stopServerA = stopServer.bind(null, info)
  const protocolAdapterB = {
    ...protocolAdapterA,
    stopServer: stopServerA,
    info,
  }

  return protocolAdapterB
}

// Once the server is started, we add some methods and remove others
const getRequestAdapter = function({
  protocolAdapter,
  protocolAdapter: { wrapped, send },
}) {
  const parseRequestA = parseRequest.bind(null, protocolAdapter)
  const protocolAdapterA = omit(wrapped, 'startServer')

  return { ...protocolAdapterA, parseRequest: parseRequestA, send }
}

// Request handler fired on each request
const processRequest = function(
  { requestHandler, getRequestInput, protocolAdapter, protocol },
  specific,
) {
  const protocolAdapterA = bindMethods({ protocolAdapter, specific })

  const requestInput = getRequestInput()
  const requestInputA = {
    ...requestInput,
    protocolAdapter: protocolAdapterA,
    protocol,
    specific,
  }

  requestHandler(requestInputA)
}

// Pass protocol-specific input to some adapter's methods
const bindMethods = function({ protocolAdapter, specific }) {
  const methods = pick(protocolAdapter, BOUND_METHODS)
  const methodsA = mapValues(methods, method =>
    wrapMethod.bind(null, { method, specific }),
  )

  const protocolAdapterA = { ...protocolAdapter, ...methodsA }
  return protocolAdapterA
}

const BOUND_METHODS = ['send', 'parseRequest']

const wrapMethod = function({ method, specific }, arg, ...args) {
  return method({ ...arg, specific }, ...args)
}

module.exports = {
  start,
}
