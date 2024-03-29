/* eslint-disable max-lines */
import { getStandardError } from '../../errors/standard.js'
import { getServerinfo } from '../../serverinfo/main.js'
import { makeImmutable } from '../../utils/functional/immutable.js'

// Retrieve all parameters
// eslint-disable-next-line max-lines-per-function
export const getParams = (
  mInput,
  {
    params: { error, ...params } = {},
    serverParams,
    mutable = true,
    client = false,
  } = {},
) => {
  const {
    requestid,
    timestamp = new Date().toISOString(),
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format: { name: format } = {},
    charset: { name: charset } = {},
    compress,
    payload,
    payloadsize,
    payloadcount,
    rpc,
    topargs: args,
    topargs: { params: clientParams = {} } = {},
    datasize,
    datacount,
    summary,
    commandpaths,
    commandpath,
    collnames,
    collname,
    clientCollnames,
    clientCollname,
    top: { command: { type: command } = {} } = {},
    responsedata,
    responsedatasize,
    responsedatacount,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    config,
    // This is memoized
    serverinfo = getServerinfo({ config }),
  } = mInput

  const errorA = getError({ error, mInput })

  // When parameters are sent to clients, we use client-facing
  // collection names
  const clientNamedParams = client
    ? { collections: clientCollnames, collection: clientCollname }
    : { collections: collnames, collection: collname }

  // Order matters:
  //  - we want to be 100% sure serverParams do not overwrite system parameters
  //  - it is possible to overwrite system params with call-specific `params`
  const paramsA = {
    requestid,
    timestamp,
    duration,
    protocol,
    ip,
    origin,
    path,
    method,
    status,
    queryvars,
    headers,
    format,
    charset,
    compress,
    payload,
    payloadsize,
    payloadcount,
    rpc,
    args,
    params: clientParams,
    datasize,
    datacount,
    summary,
    commandpaths,
    commandpath,
    ...clientNamedParams,
    command,
    responsedata,
    responsedatasize,
    responsedatacount,
    responsetype,
    metadata,
    modelscount,
    uniquecount,
    serverinfo,
    ...params,
    ...errorA,
  }

  // This is a bit slow, but necessary to prevent config functions from
  // modifying core engine logic
  if (!mutable) {
    makeImmutable(paramsA)
  }

  // We do not want to make server-specific parameters immutable as it might
  // be very slow, and we are not sure whether making them immutable would
  // break anything
  const paramsB = { ...serverParams, ...paramsA }

  return paramsB
}

// Normalize `params.error` so the caller does not have to
const getError = ({ error, mInput }) => {
  if (error === undefined) {
    return
  }

  const errorA = getStandardError({ error, mInput })
  return { error: errorA }
}

// Retrieve model-related system parameters
export const getModelParams = ({ model, previousmodel, attrName }) => {
  const value = model[attrName]
  const previousvalue =
    previousmodel === undefined || previousmodel === null
      ? undefined
      : previousmodel[attrName]

  return { model, value, previousmodel, previousvalue }
}
/* eslint-enable max-lines */
