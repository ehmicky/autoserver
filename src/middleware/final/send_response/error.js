import omit from 'omit.js'

import { getStandardError } from '../../../errors/standard.js'

// Use protocol-specific way to send back the response to the client
export const getErrorResponse = ({ error, mInput, response }) => {
  if (!error) {
    return response
  }

  const content = getStandardError({ error, mInput })

  // Do not show stack trace in error responses
  const contentA = omit.default(content, ['details'])

  return { type: 'error', content: contentA }
}
