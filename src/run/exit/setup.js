import process from 'process'

import { signals } from 'signal-exit'

import { gracefulExit } from './graceful_exit.js'

// Make sure the server stops when graceful exits are possible
// Also send related events
// We cannot handle `process.exit()` since graceful exit is async
export const setupGracefulExit = function ({
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
  exitSignals.forEach((exitSignal) => process.on(exitSignal, exitFunc))

  return { exitFunc }
}

// Add `SIGUSR2` for Nodemon
const getExitSignals = function () {
  const exitSignals = signals()
  return exitSignals.includes('SIGUSR2')
    ? exitSignals
    : [...exitSignals, 'SIGUSR2']
}
