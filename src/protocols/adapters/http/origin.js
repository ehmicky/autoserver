// TODO: use global variable once dropping support for Node 8 and 9
// eslint-disable-next-line no-shadow, node/prefer-global/url
import { URL, format as urlFormat } from 'url'

// Retrieves full URL
export const getUrl = function({
  specific,
  specific: {
    req: { url },
  },
}) {
  const origin = getOrigin({ specific })
  return `${origin}${url}`
}

// Used by `Link` HTTP header
export const getStandardUrl = function({ specific }) {
  const url = getUrl({ specific })
  const urlA = new URL(url)
  return urlA
}

export const stringifyUrl = function({ url }) {
  return urlFormat(url, { fragment: false })
}

// Retrieves origin, i.e. protocol + hostname + port
export const getOrigin = function({
  specific: {
    req: {
      headers,
      connection: { encrypted },
    },
  },
}) {
  const nonProxiedProtocol = encrypted ? 'https' : 'http'
  const proxiedProtocol = headers['x-forwarded-proto']
  const protocol = proxiedProtocol || nonProxiedProtocol

  const nonProxiedHost = headers.host
  const proxiedHost = headers['x-forwarded-host']
  const host = proxiedHost || nonProxiedHost

  const origin = urlFormat({ protocol, host })
  return origin
}
