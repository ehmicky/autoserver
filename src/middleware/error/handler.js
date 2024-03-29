import { logEvent } from '../../log/main.js'

// Error handler, which sends final response, if server-side errors
export const errorHandler = async ({
  error,
  protocolAdapter,
  config,
  mInput,
}) => {
  // Make sure a response is sent, even empty, or the socket will hang
  await protocolAdapter.send({ content: '', contentLength: 0 })

  // In case an error happened during final layer
  const mInputA = { ...mInput, status: 'SERVER_ERROR' }

  // Report any exception thrown
  await logEvent({
    mInput: mInputA,
    event: 'failure',
    phase: 'request',
    level: 'error',
    params: { error },
    config,
  })
}
