import { URL } from 'url'

// Retrieves query string from a URL
export const getQueryString = function({
  specific: {
    req: { url },
  },
}) {
  const { search = '' } = new URL(`http://localhost/${url}`)
  return search
}
