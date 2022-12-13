// Retrieves path without query string nor hash
export const getPath = ({
  specific: {
    req: { url },
  },
}) => url.replace(/[?#].*/u, '')
