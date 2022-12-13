import { LEVELS } from '../../constants.js'

// Retrieves `[EVENT] [LEVEL] [HOSTID] [PROCESSNAME] [PROCESSID] [TIMESTAMP]
// [PHASE]`
export const getPrefix = ({ log }) =>
  PREFIXES.map(({ value, length }) =>
    getEachPrefix({ value, length, log }),
  ).join(' ')

const getEachPrefix = ({ value, length, log }) => {
  const prefix = value(log)
  const prefixA = prefix.slice(0, length).padEnd(length)
  const prefixB = `[${prefixA}]`
  return prefixB
}

const getMaxLength = (enumVal) => {
  const lengths = enumVal.map(({ length }) => length)
  return Math.max(...lengths)
}

const EVENTS = ['message', 'start', 'call', 'failure', 'stop', 'perf']

const PREFIXES = [
  {
    value: ({ event }) => event.toUpperCase(),
    length: getMaxLength(EVENTS),
  },

  {
    value: ({ level }) => level.toUpperCase(),
    length: getMaxLength(LEVELS),
  },

  {
    value: ({
      serverinfo: {
        host: { id: hostId },
      },
    }) => hostId,
    length: 8,
  },

  {
    value: ({
      serverinfo: {
        process: { name: processName },
      },
    }) => processName,
    length: 12,
  },

  {
    value: ({
      serverinfo: {
        process: { id: processId },
      },
    }) => String(processId),
    length: 5,
  },

  {
    value: ({ timestamp }) =>
      timestamp.replace('T', ' ').replace(/(\d)Z$/u, '$1'),
    length: 23,
  },

  {
    value: ({ phase, requestid }) => requestid || phase.toUpperCase(),
    length: 8,
  },
]
