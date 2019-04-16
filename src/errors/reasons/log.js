import { getAdapterMessage } from './message.js'

// Extra:
//  - adapter `{string}`: adapter name
export const LOG = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific log adapter',
  getMessage: getAdapterMessage,
}
