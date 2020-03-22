// Retrieves path without query string nor hash
export const getPath = function ({
  specific: {
    req: { url },
  },
}) {
  return url.replace(/[?#].*/u, '')
}
