// Add content type, and remove top-level key
// Also add metadata
export const parseResponse = function ({ response }) {
  const type = Array.isArray(response) ? 'models' : 'model'

  const responseA = { content: response, type }
  return { response: responseA }
}
