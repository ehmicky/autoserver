import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Retrieve error message of a standard error
export const getErrorMessage = ({
  error: { type, description, details },
  message,
}) => {
  // Retrieve both the main message and the stack
  const stack = getStack(description, details)

  // Add error type to message
  const errorMessage = stack ? `${type} - ${stack}` : type

  // Add original event's message
  const errorMessageA = message ? `${message}\n${errorMessage}` : errorMessage

  return errorMessageA
}

const getStack = (description, details = '') => {
  // Only include description if it's not already in the stack trace
  const stack =
    !description || details.includes(description)
      ? details
      : `${description}\n${details}`

  // Remove `Error:` as it gets prepended to `error.stack` (i.e. `details`)
  const stackA = stack.replace(/^[\w]*Error: /u, '')

  // Shorten stack trace directory paths
  const stackB = stackA.split(ROOT_DIR).join('')
  return stackB
}

const ROOT_DIR = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
