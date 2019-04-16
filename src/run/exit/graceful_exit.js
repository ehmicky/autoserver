import { monitor } from '../../perf/helpers.js'
import { once } from '../../utils/functional/once.js'
import { addErrorHandler } from '../../errors/handler.js'
import { logEvent } from '../../log/main.js'
import { logPerfEvent } from '../../log/perf.js'

import { closeProtocols } from './protocol_close.js'
import { closeDbAdapters } from './db_close.js'
import { emitStopEvent } from './stop_event.js'

// Close servers and database connections
const oGracefulExit = async function({
  protocolAdapters,
  dbAdapters,
  stopProcessErrors,
  config,
}) {
  const measures = []
  const { exit } = await mmGracefulExit({
    protocolAdapters,
    dbAdapters,
    stopProcessErrors,
    config,
    measures,
  })

  await emitStopEvent({ exit, config, measures })

  await logPerfEvent({ phase: 'shutdown', measures, config })
}

const eGracefulExit = once(oGracefulExit)

const gracefulExitHandler = async function(error, { config }) {
  const message = 'Shutdown failure'
  await logEvent({
    event: 'failure',
    phase: 'shutdown',
    message,
    params: { error },
    config,
  })
}

export const gracefulExit = addErrorHandler(eGracefulExit, gracefulExitHandler)

const mGracefulExit = async function({
  protocolAdapters,
  dbAdapters,
  stopProcessErrors,
  config,
  measures,
}) {
  stopProcessErrors()

  const protocolPromises = closeProtocols({
    protocolAdapters,
    config,
    measures,
  })
  const dbPromises = closeDbAdapters({ dbAdapters, config, measures })

  const exitArray = await Promise.all([...protocolPromises, ...dbPromises])
  const exit = Object.assign({}, ...exitArray)

  return { exit }
}

const mmGracefulExit = monitor(mGracefulExit, 'all')
