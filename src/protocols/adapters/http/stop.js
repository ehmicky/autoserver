import { promisify } from 'node:util'

// Try a graceful server exit
export const stopServer = function ({ server }) {
  return promisify(server.close.bind(server))()
}
