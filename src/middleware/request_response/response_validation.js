import { throwPb } from '../../errors/props.js'

// Check output, for the errors that should not happen,
// i.e. server-side (e.g. 500)
// In short: response should be an array of objects
export const responseValidation = function ({ response: { data, metadata } }) {
  if (!data) {
    const message = "'response.data' should be defined"
    throwPb({ message, reason: 'ENGINE' })
  }

  if (!Array.isArray(data)) {
    const message = `'response.data' should be an array, not '${data}'`
    throwPb({ message, reason: 'ENGINE' })
  }

  if (!metadata) {
    const message = "'response.metadata' should be defined"
    throwPb({ message, reason: 'ENGINE' })
  }
}
