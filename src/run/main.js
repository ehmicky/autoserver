import { monitoredReduce } from '../perf/helpers.js'
import { addErrorHandler } from '../errors/handler.js'

import { startupSteps } from './steps.js'
import { handleStartupError } from './error.js'

// Start server for each protocol
export const run = async function({
  measures = [],
  config: configPath,
  ...config
} = {}) {
  // Run each startup step
  const { startPayload } = await monitoredReduce({
    funcs: eStartupSteps,
    initialInput: { measures, configPath, config },
    mapResponse: (input, newInput) => ({ ...input, ...newInput }),
    category: 'main',
  })

  return startPayload
}

// Add startup error handler
const eStartupSteps = startupSteps.map(startupStep =>
  addErrorHandler(startupStep, handleStartupError),
)
