import Ajv from 'ajv'
import ajvKeywords from 'ajv-keywords'

export const getValidator = function () {
  const ajv = new Ajv(AJV_OPTIONS)

  // Add JSON keywords:
  //  - typeof: allows checking for `typeof function`
  ajvKeywords(ajv, ['typeof'])

  return ajv
}

// Intercepts when ajv uses console.* and throw exceptions instead
const loggerError = function (...args) {
  const message = args.join(' ')
  throw new Error(message)
}

const logger = { log: loggerError, warn: loggerError, error: loggerError }

const AJV_OPTIONS = {
  allErrors: true,
  jsonPointers: true,
  format: 'full',
  $data: true,
  verbose: true,
  logger,
  multipleOfPrecision: 9,
  extendRefs: true,
  strictDefaults: true,
  strictKeywords: true,
}
