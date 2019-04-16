import { getAdapterMessage } from './message.js'

// Extra:
//  - adapter `{string}`: adapter name
export const COMPRESS = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific compress adapter',
  getMessage: getAdapterMessage,
}
