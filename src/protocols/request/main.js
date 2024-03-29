import { monitoredReduce } from '../../perf/helpers.js'

import { handleContentNegotiation } from './content_negotiation/main.js'
import { parseHeaders } from './headers.js'
import { parseInput } from './input.js'
import { parseIp } from './ip.js'
import { parseMethod } from './method.js'
import { protocolNormalization } from './normalize/main.js'
import { parseOrigin } from './origin.js'
import { parsePath } from './path.js'
import { parsePayload } from './payload.js'
import { parseQueryvars } from './queryvars.js'
// eslint-disable-next-line import/max-dependencies
import { validateSpecific } from './validate.js'

// Retrieves protocol-specific request information
export const parseRequest = (protocolAdapter, { specific, config, measures }) =>
  monitoredReduce({
    funcs: METHODS,
    mapInput: (requestInfo) => ({
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
