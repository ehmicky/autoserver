import { pid } from 'process'

// Retrieve process-specific information
export const getProcessInfo = function({ host, processName }) {
  const name = processName || host.name

  return { id: pid, name }
}
