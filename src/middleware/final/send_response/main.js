import { getErrorResponse } from './error.js'
import { addMetadata } from './metadata.js'
import { getResponseParams } from './params.js'
import { send } from './send.js'
import { validateResponse } from './validate.js'

// Sends the response at the end of the request
export const sendResponse = async ({
  error,
  response,
  metadata,
  specific,
  protocolAdapter,
  rpcAdapter,
  format,
  compressResponse,
  rpc,
  topargs,
  mInput,
}) => {
  const responseA = getErrorResponse({ error, mInput, response })

  const responseParams = getResponseParams(responseA)
  // `responseParams` is not yet added to `mInput` so we do it now
  const mInputA = { ...mInput, ...responseParams }

  const responseB = addMetadata({
    response: responseA,
    metadata,
    mInput: mInputA,
  })

  validateResponse({ response: responseB })

  // Response before transformation
  const { type, content: responseC } = responseB

  const content = transformResponse({
    response: responseB,
    mInput: mInputA,
    rpcAdapter,
  })

  await send({
    protocolAdapter,
    specific,
    content,
    response: responseC,
    type,
    format,
    compressResponse,
    rpc,
    topargs,
    error,
  })

  return responseParams
}

const transformResponse = ({
  rpcAdapter,
  response,
  response: { content },
  mInput,
}) => {
  if (rpcAdapter === undefined) {
    return content
  }

  return rpcAdapter.transformResponse({ response, mInput })
}
