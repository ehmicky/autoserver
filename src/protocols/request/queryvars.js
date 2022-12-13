import { getFormat } from '../../formats/get.js'

import { validateString } from './validate.js'

export const parseQueryvars = ({
  protocolAdapter,
  protocolAdapter: { getQueryString },
  specific,
}) => {
  const queryString = getQueryString({ specific })

  validateString(queryString, 'queryString', protocolAdapter)

  const queryvars = urlencoded.parseContent(queryString)
  return { queryvars }
}

const urlencoded = getFormat('urlencoded')
