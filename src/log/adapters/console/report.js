import { getConsoleMessage } from './message.js'
import { colorize } from './colorize.js'

// Prints event messages to console.
export const report = function({ log, log: { level } }) {
  const consoleMessage = getConsoleMessage({ log })

  const consoleMessageA = colorize({ log, consoleMessage })

  // eslint-disable-next-line no-console, no-restricted-globals
  console[level](consoleMessageA)
}
