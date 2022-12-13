import { includeKeys } from 'filter-obj'
import omit from 'omit.js'

import { identity } from '../utils/functional/identity.js'
import { mapValues } from '../utils/functional/map.js'

import { parseRequest } from './request/main.js'

// Start the server
export const start = async (
  protocolAdapter,
  { requestHandler, getRequestInput = identity, opts = {}, config = {} },
) => {
  const { name: protocol, startServer, stopServer } = protocolAdapter

  const protocolAdapterA = getRequestAdapter({ protocolAdapter })

  const handleRequest = processRequest.bind(undefined, {
    requestHandler,
    getRequestInput,
    protocolAdapter: protocolAdapterA,
    protocol,
  })

  const info = await startServer({ opts, config, handleRequest })

  // Expose the `stopServer()` method
  const stopServerA = stopServer.bind(undefined, info)
  const protocolAdapterB = {
    ...protocolAdapterA,
    stopServer: stopServerA,
    info,
  }

  return protocolAdapterB
}

// Once the server is started, we add some methods and remove others
const getRequestAdapter = ({
  protocolAdapter,
  protocolAdapter: { wrapped, send },
}) => {
  const parseRequestA = parseRequest.bind(undefined, protocolAdapter)
  const protocolAdapterA = omit.default(wrapped, ['startServer'])

  return { ...protocolAdapterA, parseRequest: parseRequestA, send }
}

// Request handler fired on each request
const processRequest = (
  { requestHandler, getRequestInput, protocolAdapter, protocol },
  specific,
) => {
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
const bindMethods = ({ protocolAdapter, specific }) => {
  const methods = includeKeys(protocolAdapter, BOUND_METHODS)
  const methodsA = mapValues(methods, (method) =>
    wrapMethod.bind(undefined, { method, specific }),
  )

  const protocolAdapterA = { ...protocolAdapter, ...methodsA }
  return protocolAdapterA
}

const BOUND_METHODS = ['send', 'parseRequest']

const wrapMethod = ({ method, specific }, arg, ...args) =>
  method({ ...arg, specific }, ...args)
