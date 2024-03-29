// Retrieves HTTP method, but protocol-agnostic
export const getMethod = ({
  specific: {
    req: { method },
  },
}) => getAgnosticMethod({ method })

export const getAgnosticMethod = ({ method }) => {
  if (typeof method !== 'string') {
    return method
  }

  const methodA = METHODS_MAP[method.toUpperCase()]

  if (methodA === undefined) {
    return method
  }

  return methodA
}

// This looks strange, but this is just to enforce the fact that the HTTP
// method (the key) is conceptually different from the protocol-agnostic method
// (the value)
const METHODS_MAP = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}
