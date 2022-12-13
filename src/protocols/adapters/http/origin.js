import { format as urlFormat } from 'node:url'

// Retrieves full URL
export const getUrl = ({
  specific,
  specific: {
    req: { url },
  },
}) => {
  const origin = getOrigin({ specific })
  return `${origin}${url}`
}

// Used by `Link` HTTP header
export const getStandardUrl = ({ specific }) => {
  const url = getUrl({ specific })
  const urlA = new URL(url)
  return urlA
}

export const stringifyUrl = ({ url }) => urlFormat(url, { fragment: false })

// Retrieves origin, i.e. protocol + hostname + port
export const getOrigin = ({
  specific: {
    req: {
      headers,
      connection: { encrypted },
    },
  },
}) => {
  const nonProxiedProtocol = encrypted ? 'https' : 'http'
  const proxiedProtocol = headers['x-forwarded-proto']
  const protocol = proxiedProtocol || nonProxiedProtocol

  const nonProxiedHost = headers.host
  const proxiedHost = headers['x-forwarded-host']
  const host = proxiedHost || nonProxiedHost

  const origin = urlFormat({ protocol, host })
  return origin
}
