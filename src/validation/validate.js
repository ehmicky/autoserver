import { errorMessages } from './messages.js'

// Perform a validation, using a JSON schema, and a `data` as input
export const validate = function ({ compiledJsonSchema, data, extra = {} }) {
  // Hack to be able to pass information to custom validation keywords
  const dataA = { ...data, [Symbol.for('extra')]: extra }

  const isValid = compiledJsonSchema(dataA)

  const { errors } = compiledJsonSchema
  const hasErrors = Array.isArray(errors) && errors.length !== 0

  if (isValid || !hasErrors) {
    return
  }

  reportErrors({ errors })
}

// Report validation errors by throwing an exception
const reportErrors = function ({ errors }) {
  // Retrieve error message as string, from error objects
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  const message = errors.map((error) => getErrorMessage({ error })).join('\n')

  throw new Error(message)
}

// Customize error messages when the library's ones are unclear
const getErrorMessage = function ({
  error,
  error: { keyword, message, dataPath },
}) {
  const getMessage = errorMessages[keyword]
  // Failsafe
  const messageA = getMessage === undefined ? ` ${message}` : getMessage(error)

  const messageB = addDataPath({ dataPath, message: messageA })
  return messageB
}

// Remove leading dot
// Prepends argument name to error message
const addDataPath = function ({ dataPath, message }) {
  const dataPathA = jsonPointerToDots(dataPath)
  const messageA = `${dataPathA}${message}`
  const messageB = messageA.replace(/^\./u, '')
  return messageB
}

// We use `jsonPointers` option because it is cleaner,
// but we want dots (for properties) and brackets (for indexes) not slashes
const jsonPointerToDots = function (dataPath) {
  return dataPath
    .slice(1)
    .replace(/\/(\d+)/gu, '[$1]')
    .replace(/\//gu, '.')
}
