import { getAdapterMessage } from './message.js'

// Extra:
//  - adapter `{string}`: adapter name
export const DATABASE = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific database adapter',
  getMessage: getAdapterMessage,
}
