import { logEvent } from '../log/main.js'
import { monitor } from '../perf/helpers.js'
import { getProtocol } from '../protocols/get.js'
import { PROTOCOLS } from '../protocols/info.js'

// Launch the server for each protocol
export const launchProtocols = async (options) => {
  // Make sure all servers are starting concurrently, not serially
  const protocolPromises = PROTOCOLS.map((protocol) =>
    kLaunchProtocol(options, protocol),
  )
  const protocolsArray = await Promise.all(protocolPromises)

  const protocolAdaptersA = Object.assign({}, ...protocolsArray)
  return { protocolAdapters: protocolAdaptersA }
}

// Launch the server of a given protocol
const launchProtocol = async (options, protocol) => {
  const protocolAdapter = getProtocol(protocol)
  const { protocolAdapter: protocolAdapterA } = await launchServer({
    protocolAdapter,
    options,
  })

  return { [protocolAdapterA.name]: protocolAdapterA }
}

const kLaunchProtocol = monitor(
  launchProtocol,
  (options, name) => name,
  'protocols',
)

// Do the actual server launch
const launchServer = async ({
  protocolAdapter,
  protocolAdapter: { name: protocol },
  options: {
    config,
    config: { protocols },
    dbAdapters,
    requestHandler,
  },
}) => {
  const getRequestInput = getInput.bind(undefined, { config, dbAdapters })
  const opts = protocols[protocol]
  const protocolAdapterA = await protocolAdapter.startServer({
    requestHandler,
    getRequestInput,
    opts,
    config,
  })

  await startEvent({ protocolAdapter: protocolAdapterA, config })

  return { protocolAdapter: protocolAdapterA }
}

const getInput = ({ config, dbAdapters }) => ({
  config,
  dbAdapters,
  metadata: {},
})

// Protocol-specific start event
const startEvent = ({
  protocolAdapter: {
    title,
    info: { hostname, port },
  },
  config,
}) => {
  const message = `${title} - Listening on ${hostname}:${port}`
  return logEvent({ event: 'message', phase: 'startup', message, config })
}
