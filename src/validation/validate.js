import { errorMessages } from './messages.js'

// Perform a validation, using a JSON schema, and a `data` as input
export const validate = ({ compiledJsonSchema, data, extra = {} }) => {
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
const reportErrors = ({ errors }) => {
  // Retrieve error message as string, from error objects
  const message = errors.map((error) => getErrorMessage({ error })).join('\n')

  throw new Error(message)
}

// Customize error messages when the library's ones are unclear
const getErrorMessage = ({
  error,
  error: { keyword, message, instancePath },
}) => {
  const getMessage = errorMessages[keyword]
  // Failsafe
  const messageA = getMessage === undefined ? ` ${message}` : getMessage(error)

  const messageB = addDataPath({ instancePath, message: messageA })
  return messageB
}

// Remove leading dot
// Prepends argument name to error message
const addDataPath = ({ instancePath, message }) => {
  const dataPath = jsonPointerToDots(instancePath)
  const messageA = `${dataPath}${message}`
  const messageB = messageA.replace(/^\./u, '')
  return messageB
}

// We use `jsonPointers` option because it is cleaner,
// but we want dots (for properties) and brackets (for indexes) not slashes
const jsonPointerToDots = (instancePath) =>
  instancePath
    .slice(1)
    .replaceAll(/\/(\d+)/gu, '[$1]')
    .replaceAll('/', '.')
