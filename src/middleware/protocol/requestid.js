import { randomUUID } from 'node:crypto'

// Assigns unique ID (UUIDv4) to each request
// Available in mInput, events, system parameters and metadata
export const setRequestid = ({ metadata }) => {
  const requestid = randomUUID()

  const metadataA = { ...metadata, requestid }
  return { requestid, metadata: metadataA }
}
