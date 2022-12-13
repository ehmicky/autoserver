import { promisify } from 'node:util'

// Try a graceful server exit
export const stopServer = ({ server }) => promisify(server.close.bind(server))()
