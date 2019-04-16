const { monitor } = require('../../perf/helpers.js')
const { once } = require('../../utils/functional/once.js')
const { addErrorHandler } = require('../../errors/handler.js')
const { logEvent } = require('../../log/main.js')
const { logPerfEvent } = require('../../log/perf.js')

const { closeProtocols } = require('./protocol_close')
const { closeDbAdapters } = require('./db_close')
const { emitStopEvent } = require('./stop_event')

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

const gracefulExit = addErrorHandler(eGracefulExit, gracefulExitHandler)

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

module.exports = {
  gracefulExit,
}
