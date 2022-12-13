import { createServer } from 'node:http'
import { promisify } from 'node:util'

// Start HTTP server
export const startServer = ({
  opts: { hostname, port },
  config: { env },
  handleRequest,
}) => {
  // Create server
  const server = createServer()
  const promise = waitForConnection({ server })

  // In development, Nodemon restarts the server.
  // Pending sockets slow down that restart, so we disable keep-alive.
  if (env === 'dev') {
    // eslint-disable-next-line fp/no-mutation
    server.keepAliveTimeout = 1
  }

  // Handle server lifecycle events
  handleClientRequest({ server, handleRequest })

  // Start server
  server.listen(port, hostname)

  return promise
}

const waitForConnection = ({ server }) => {
  const serverOn = promisify(server.on.bind(server))

  const successPromise = successListener({ server, serverOn })
  const errorPromise = errorListener({ serverOn })
  return Promise.race([successPromise, errorPromise])
}

// Connection success
const successListener = async ({ server, serverOn }) => {
  await serverOn('listening')

  const { address, port } = server.address()
  return { server, hostname: address, port }
}

// Connection failure
const errorListener = async ({ serverOn }) => {
  const error = await serverOn('error')
  throw error
}

const handleClientRequest = ({ server, handleRequest }) => {
  server.on('request', (req, res) => {
    handleRequest({ req, res })
  })
}
