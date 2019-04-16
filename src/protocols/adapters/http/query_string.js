// TODO: use global variable once dropping support for Node 8 and 9
// eslint-disable-next-line no-shadow, node/prefer-global/url
const { URL } = require('url')

// Retrieves query string from a URL
const getQueryString = function({
  specific: {
    req: { url },
  },
}) {
  const { search = '' } = new URL(`http://localhost/${url}`)
  return search
}

module.exports = {
  getQueryString,
}
