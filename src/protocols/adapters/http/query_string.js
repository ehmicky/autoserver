// Retrieves query string from a URL
export const getQueryString = ({
  specific: {
    req: { url },
  },
}) => {
  const { search = '' } = new URL(`http://localhost/${url}`)
  return search
}
