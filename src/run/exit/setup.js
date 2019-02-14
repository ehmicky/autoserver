'use strict'

const process = require('process')

// Avoid requiring `signal-exit` directly as it adds a global EventEmitter
// eslint-disable-next-line import/no-internal-modules
const EXIT_SIGNALS = require('signal-exit/signals')

const { gracefulExit } = require('./graceful_exit')

// Make sure the server stops when graceful exits are possible
// Also send related events
// We cannot handle `process.exit()` since graceful exit is async
const setupGracefulExit = function({
  protocolAdapters,
  dbAdapters,
  stopProcessErrors,
  config,
}) {
  const exitFunc = gracefulExit.bind(null, {
    protocolAdapters,
    dbAdapters,
    stopProcessErrors,
    config,
  })

  const exitSignals = getExitSignals()
  exitSignals.forEach(exitSignal => process.on(exitSignal, exitFunc))

  return { exitFunc }
}

// Add `SIGUSR2` for Nodemon
const getExitSignals = function() {
  return EXIT_SIGNALS.includes('SIGUSR2')
    ? EXIT_SIGNALS
    : [...EXIT_SIGNALS, 'SIGUSR2']
}

module.exports = {
  setupGracefulExit,
}
