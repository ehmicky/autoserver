import { getAdapterMessage } from './message.js'

// Extra:
//  - adapter `{string}`: adapter name
const PROTOCOL = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific protocol adapter',
  getMessage: getAdapterMessage,
}

module.exports = {
  PROTOCOL,
}
