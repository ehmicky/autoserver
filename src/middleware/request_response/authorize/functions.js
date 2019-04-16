import { runConfigFunc } from '../../../functions/run.js'
import { getParams } from '../../../functions/params/values.js'
import { validateFilter } from '../../../filter/validate/main.js'
import { getAuthorizeAttrs } from '../../../filter/authorize.js'
import { mapNodes } from '../../../filter/crawl.js'

import { getServerParams } from './server_params.js'

// Handle all config function related logic in `coll.authorize`
const handleConfigFuncs = function({
  collname,
  authorize,
  serverParams,
  config,
  mInput,
}) {
  const authorizeA = resolveConfigFuncs({ authorize, mInput })

  validateAuthorize({ collname, authorize: authorizeA, config })

  const params = getAllParams({ authorize: authorizeA, serverParams, mInput })

  return { authorize: authorizeA, params }
}

// Resolve all config functions in `coll.authorize` so all leaves values
// are constants
const resolveConfigFuncs = function({ authorize, mInput }) {
  return mapNodes(authorize, node => resolveConfigFunc({ mInput, node }))
}

const resolveConfigFunc = function({ mInput, node: { value, ...node } }) {
  const valueA = runConfigFunc({ configFunc: value, mInput })
  return { ...node, value: valueA }
}

// Most `coll.authorize` validation is done startup time
// But config functions are evaluated runtime. Their validation is
// skipped startup time, and they are validated here once evaluated.
const validateAuthorize = function({ collname, authorize, config }) {
  const prefix =
    collname === undefined
      ? "In 'config.authorize', "
      : `In 'config.collections.${collname}.authorize', `
  const reason = 'CONFIG_VALIDATION'

  const attrs = getAuthorizeAttrs({ config, collname })
  validateFilter({ filter: authorize, prefix, reason, attrs })
}

const getAllParams = function({ authorize, serverParams, mInput }) {
  const serverParamsA = getServerParams({ authorize, serverParams, mInput })
  const systemParams = getParams(mInput)

  return { ...serverParamsA, ...systemParams }
}

module.exports = {
  handleConfigFuncs,
}
