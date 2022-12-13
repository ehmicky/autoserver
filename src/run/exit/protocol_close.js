import { wrapCloseFunc } from './wrapper.js'

// Attempts to close server
// No new connections will be accepted, but we will wait for ongoing ones to end
export const closeProtocols = ({ protocolAdapters, config, measures }) =>
  Object.values(protocolAdapters).map((adapter) =>
    eCloseProtocol({ type: 'protocols', adapter, config, measures }),
  )

const closeProtocol = ({ adapter: { stopServer } }) => stopServer()

const eCloseProtocol = wrapCloseFunc(closeProtocol)
