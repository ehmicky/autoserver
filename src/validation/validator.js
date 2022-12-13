import Ajv from 'ajv'
import ajvFormats from 'ajv-formats'
import ajvKeywords from 'ajv-keywords'

export const getValidator = () => {
  const ajv = new Ajv(AJV_OPTIONS)
  ajvKeywords(ajv, CUSTOM_KEYWORDS)
  ajvFormats(ajv)
  return ajv
}

// Add JSON keywords:
//  - typeof: allows checking for `typeof function`
const CUSTOM_KEYWORDS = ['typeof']

// Intercepts when ajv uses console.* and throw exceptions instead
const loggerError = (...args) => {
  const message = args.join(' ')
  throw new Error(message)
}

const logger = { log: loggerError, warn: loggerError, error: loggerError }

const AJV_OPTIONS = {
  allErrors: true,
  $data: true,
  verbose: true,
  logger,
  multipleOfPrecision: 9,
  // TODO: remove
  allowUnionTypes: true,
}
