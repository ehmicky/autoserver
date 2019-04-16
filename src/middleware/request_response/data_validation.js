import { addGenErrorHandler } from '../../errors/handler.js'
import { validate } from '../../validation/validate.js'

// Custom data validation middleware
// Check that newData passes config validation
// E.g. if a model is marked as `required` or `minimum: 10` in the
// config, this will be validated here
export const dataValidation = function({
  args: { newData, currentData },
  collname,
  config: {
    shortcuts: { validateMap },
  },
  mInput,
}) {
  if (newData === undefined) {
    return
  }

  const compiledJsonSchema = validateMap[collname]

  newData.forEach((data, index) =>
    eValidate({
      compiledJsonSchema,
      data,
      extra: { mInput, currentDatum: currentData[index] },
    }),
  )
}

const eValidate = addGenErrorHandler(validate, {
  reason: 'VALIDATION',
  message: (input, { message }) => `Wrong parameters: ${message}`,
})
