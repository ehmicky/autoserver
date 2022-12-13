import { colorize } from './colorize.js'
import { getConsoleMessage } from './message.js'

// Prints event messages to console.
export const report = ({ log, log: { level } }) => {
  const consoleMessage = getConsoleMessage({ log })

  const consoleMessageA = colorize({ log, consoleMessage })

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA)
}
