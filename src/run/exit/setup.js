import process from 'process'

// Avoid requiring `signal-exit` directly as it adds a global EventEmitter
import EXIT_SIGNALS from 'signal-exit/signals'

import { gracefulExit } from './graceful_exit.js'

// Make sure the server stops when graceful exits are possible
// Also send related events
// We cannot handle `process.exit()` since graceful exit is async
export const setupGracefulExit = function({
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
