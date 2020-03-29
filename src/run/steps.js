import { loadConfig } from '../config/main.js'
import { getRequestHandler } from '../middleware/main.js'

import { connectToDatabases } from './database/main.js'
import { setupGracefulExit } from './exit/setup.js'
import { launchProtocols } from './launch.js'
import { startStartupPerf, stopStartupPerf, reportStartupPerf } from './perf.js'
import { processErrorHandler } from './process.js'
import { emitStartEvent } from './start_event.js'

export const startupSteps = [
  // Start monitoring main startup time
  startStartupPerf,
  // Loads config
  loadConfig,
  // Setup process warnings and errors handler
  processErrorHandler,
  // Get main request handler
  getRequestHandler,
  // Create database connections
  connectToDatabases,
  // Boot each protocol-specific server
  launchProtocols,
  // Make sure servers are closed on exit
  setupGracefulExit,
  // Stop monitoring main startup time
  stopStartupPerf,
  // Emit 'start' event
  emitStartEvent,
  // Report startup performance monitoring
  reportStartupPerf,
]
