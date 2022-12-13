import { getCustomValidator } from './custom_validator.js'

// Compile JSON schema
export const compile = ({ config, jsonSchema }) => {
  const validator = getCustomValidator({ config })
  const compiledJsonSchema = validator.compile(jsonSchema)
  return compiledJsonSchema
}
