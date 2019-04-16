import { pid } from 'process'

// Retrieve process-specific information
const getProcessInfo = function({ host, processName }) {
  const name = processName || host.name

  return { id: pid, name }
}

module.exports = {
  getProcessInfo,
}
