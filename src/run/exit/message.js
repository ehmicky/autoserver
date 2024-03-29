import { logEvent } from '../../log/main.js'

export const emitMessageEvent = ({
  step,
  type,
  adapter: { title },
  config,
}) => {
  const message = SUCCESS_MESSAGES[type][step]
  const messageA = `${title} - ${message}`

  return logEvent({
    event: 'message',
    phase: 'shutdown',
    message: messageA,
    config,
  })
}

const SUCCESS_MESSAGES = {
  protocols: {
    start: 'Starts shutdown',
    end: 'Successful shutdown',
  },
  databases: {
    start: 'Starts disconnection',
    end: 'Successful disconnection',
  },
}
