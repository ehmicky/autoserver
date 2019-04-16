const { getFormat } = require('../../formats/get.js')

const { validateString } = require('./validate')

const parseQueryvars = function({
  protocolAdapter,
  protocolAdapter: { getQueryString },
  specific,
}) {
  const queryString = getQueryString({ specific })

  validateString(queryString, 'queryString', protocolAdapter)

  const queryvars = urlencoded.parseContent(queryString)
  return { queryvars }
}

const urlencoded = getFormat('urlencoded')

module.exports = {
  parseQueryvars,
}
