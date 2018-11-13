'use strict'

const process = require('process')

const { signals } = require('signal-exit')

const { gracefulExit } = require('./graceful_exit')

// Make sure the server stops when graceful exits are possible
// Also send related events
// We cannot handle `process.exit()` since graceful exit is async
const setupGracefulExit = function({ protocolAdapters, dbAdapters, config }) {
  const exitFunc = gracefulExit.bind(null, {
    protocolAdapters,
    dbAdapters,
    config,
  })

  const exitSignals = getExitSignals()
  exitSignals.forEach(exitSignal => process.on(exitSignal, exitFunc))

  return { exitFunc }
}

const getExitSignals = function() {
  const exitSignals = signals()
  // For Nodemon
  const exitSignalsA = exitSignals.includes('SIGUSR2')
    ? exitSignals
    : [...exitSignals, 'SIGUSR2']
  return exitSignalsA
}

module.exports = {
  setupGracefulExit,
}
