import { promisify } from 'node:util'

import { setHeaders } from './headers.js'
import { setStatusCode } from './status.js'

// Sends response
export const send = async ({
  specific,
  specific: { req, res },
  content,
  reason,
  ...rest
}) => {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) {
    return
  }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) {
    return
  }

  setStatusCode({ res, reason })

  setHeaders({ specific, content, ...rest })

  const sendResponse = promisify(res.end.bind(res))
  await sendResponse(content)

  cleanup({ req, res })
}

const cleanup = ({ req, res }) => {
  // Otherwise, socket might not be freed, e.g. if an error was thrown before
  // the request body was fully read
  req.socket.destroy()

  // Not sure if this needed
  req.destroy()
  res.destroy()
}
