import { monitoredReduce } from '../../perf/helpers.js'

import { validateSpecific } from './validate.js'
import { parseIp } from './ip.js'
import { parseOrigin } from './origin.js'
import { parseQueryvars } from './queryvars.js'
import { parseHeaders } from './headers.js'
import { parseMethod } from './method.js'
import { parsePath } from './path.js'
import { parseInput } from './input.js'
import { handleContentNegotiation } from './content_negotiation/main.js'
import { parsePayload } from './payload.js'
// eslint-disable-next-line import/max-dependencies
import { protocolNormalization } from './normalize/main.js'

// Retrieves protocol-specific request information
export const parseRequest = function(
  protocolAdapter,
  { specific, config, measures },
) {
  return monitoredReduce({
    funcs: METHODS,
    mapInput: requestInfo => ({
      protocolAdapter,
      specific,
      config,
      ...requestInfo,
    }),
    initialInput: { measures },
    mapResponse: (requestInfo, newRequestInfo) => ({
      ...requestInfo,
      ...newRequestInfo,
    }),
    category: 'protoparse',
  })
}

const METHODS = [
  validateSpecific,
  parseIp,
  parseOrigin,
  parseQueryvars,
  parseHeaders,
  parseMethod,
  parsePath,
  parseInput,
  handleContentNegotiation,
  parsePayload,
  protocolNormalization,
]
