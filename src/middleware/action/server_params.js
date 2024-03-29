import { getServerParams } from '../../functions/params/server.js'

// Bind server-specific parameters with their parameters
// This middleware needs to be:
//  - late enough to pass as many parameters as possible to
//    server-specific parameters
//  - early enough to be before any config function is fired
//  - only passing parameters that are not changed through the request.
//    For example `collection` should not be available to server-specific
//    parameters.
export const bindServerParams = ({ config, mInput }) => {
  const serverParams = getServerParams({ config, mInput })
  return { serverParams }
}
