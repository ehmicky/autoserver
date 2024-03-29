import { logEvent } from '../../log/main.js'
import { monitor } from '../../perf/helpers.js'

// Start each database connection
export const startConnections = async ({ dbAdapters, config, measures }) => {
  const dbAdaptersPromises = dbAdapters.map((dbAdapter) =>
    kStartConnection({ dbAdapter, config, measures }),
  )
  const dbAdaptersA = await Promise.all(dbAdaptersPromises)
  return dbAdaptersA
}

const startConnection = async ({
  dbAdapter: { name, title, connect },
  config,
  config: { databases },
}) => {
  const options = databases[name]

  const dbAdapter = await connect({ options, config })

  await emitStartEvent({ title, config })

  return dbAdapter
}

const kStartConnection = monitor(
  startConnection,
  ({ dbAdapter: { name } }) => name,
  'databases',
)

// Database adapter-specific start event
const emitStartEvent = async ({ title, config }) => {
  const message = `${title} - Connection initialized`
  await logEvent({ event: 'message', phase: 'startup', message, config })
}
