import { isType } from '../content_types.js'

// Transform a response according to rpc syntax
// Differs depending on whether the response is an error or a success
export const transformResponse = (
  { transformError, transformSuccess },
  { response, response: { type, content }, mInput },
) => {
  if (shouldTransformError({ type, transformError })) {
    return transformError({ ...mInput, response })
  }

  if (shouldTransformSuccess({ type, transformSuccess })) {
    return transformSuccess({ ...mInput, response })
  }

  return content
}

const shouldTransformError = ({ type, transformError }) =>
  isType(type, 'error') && transformError

const shouldTransformSuccess = ({ type, transformSuccess }) =>
  isType(type, 'model') && transformSuccess
