import { throwPb } from '../../errors/props.js'
import { getLimits } from '../../limits.js'

import { validateString } from './validate.js'

const parseOrigin = function({
  protocolAdapter,
  protocolAdapter: { getUrl, getOrigin },
  specific,
  config,
}) {
  // Only used to validate URL length
  const url = getUrl({ specific })

  validateString(url, 'url', protocolAdapter)
  validateUrl({ url, config })

  const origin = getOrigin({ specific })

  validateString(origin, 'origin', protocolAdapter)

  return { origin }
}

const validateUrl = function({ url, config }) {
  const { maxUrlLength } = getLimits({ config })

  if (url.length <= maxUrlLength) {
    return
  }

  throwPb({
    reason: 'URL_LIMIT',
    extra: { value: url.length, limit: maxUrlLength },
  })
}

module.exports = {
  parseOrigin,
}
