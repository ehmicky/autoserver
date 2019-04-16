import { addGenErrorHandler } from '../../errors/handler.js'

// Validate database supports command features
const eValidateRuntimeFeatures = function({
  args,
  collname,
  clientCollname,
  dbAdapters,
}) {
  const dbAdapter = dbAdapters[collname]
  return dbAdapter.validateRuntimeFeatures({ args, clientCollname })
}

export const validateRuntimeFeatures = addGenErrorHandler(eValidateRuntimeFeatures, {
  reason: 'VALIDATION',
})
