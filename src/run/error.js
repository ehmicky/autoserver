import { logEvent } from '../log/main.js'

// Handle exceptions thrown at server startup
export const handleStartupError = async (
  error,
  { exitFunc, protocolAdapters, dbAdapters, config },
) => {
  // Make sure servers are properly closed if an exception is thrown at end
  // of startup, e.g. during start event handler
  if (exitFunc !== undefined) {
    await exitFunc({ protocolAdapters, dbAdapters })
  }

  await logEvent({
    event: 'failure',
    phase: 'startup',
    params: { error },
    config,
  })

  throw error
}
