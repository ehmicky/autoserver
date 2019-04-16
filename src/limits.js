const bytes = require('bytes')

// Returns the main numerical limits of the engine.
// Some of those limits cannot be changed by the user.
const getLimits = function({ config } = {}) {
  const configLimits = getConfigLimits({ config })

  return { ...SYSTEM_LIMITS, ...configLimits }
}

const SYSTEM_LIMITS = {
  maxActions: 51,
  maxFindManyDepth: 2,
  maxAttrValueSize: 2000,
  maxUrlLength: 2000,
  minMaxpayload: 100,
  maxQueryStringDepth: 10,
  maxQueryStringLength: 100,
  requestTimeout: 5000,
}

// Limits that can be changed in `config.limits`
const getConfigLimits = function({ config }) {
  if (config === undefined) {
    return
  }

  const { limits } = config

  const pagesize = getPagesize({ limits })
  const maxpayload = getMaxpayload({ limits })
  const maxmodels = getMaxmodels({ limits, pagesize })

  return {
    // Max number of top-level models returned in a response
    // Default: 100
    pagesize,
    // Max number of models in either requests (`args.data`) or responses
    // Not used by delete commands
    maxmodels,
    // Max size of request payloads, in bytes.
    // Can use 'KB', 'MB', 'GB' OR 'TB'.
    // Default: '1MB'
    maxpayload,
    // Max URL length
    // Since URL can contain GraphQL query, it should not be less than
    // `maxpayload`
    maxUrlLength: Math.max(SYSTEM_LIMITS.maxUrlLength, maxpayload),
  }
}

const getPagesize = function({ limits: { pagesize } }) {
  // `pagesize` `0` disables pagination
  if (pagesize === 0) {
    return Infinity
  }

  return pagesize
}

const getMaxpayload = function({ limits: { maxpayload } }) {
  return bytes.parse(maxpayload)
}

const getMaxmodels = function({ limits: { maxmodels }, pagesize }) {
  if (maxmodels === undefined && pagesize !== undefined) {
    return pagesize * MAX_MODELS_FACTOR
  }

  // `maxmodels` `0` disables it
  if (maxmodels === 0) {
    return Infinity
  }

  return maxmodels
}

const MAX_MODELS_FACTOR = 1e2

module.exports = {
  getLimits,
}
