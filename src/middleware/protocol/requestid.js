import { v4 as uuidv4 } from 'uuid'

// Assigns unique ID (UUIDv4) to each request
// Available in mInput, events, system parameters and metadata
export const setRequestid = function ({ metadata }) {
  const requestid = uuidv4()

  const metadataA = { ...metadata, requestid }
  return { requestid, metadata: metadataA }
}
