import { addGenPbHandler } from '../../errors/handler.js'
import { throwPb } from '../../errors/props.js'
import { compile } from '../../validation/compile.js'
import { validate } from '../../validation/validate.js'

// Validates `database.DATABASE.*`, `protocols.PROTOCOL.*` and `log.LOG.*`
export const validateAdaptersOpts = function ({ opts, adaptersOpts, key }) {
  Object.entries(opts).forEach(([name, optsA]) => {
    validateAdapterOpts({ name, opts: optsA, adaptersOpts, key })
  })
}

const validateAdapterOpts = function ({ name, opts, adaptersOpts, key }) {
  const jsonSchema = getAdapterOpts({ name, opts, adaptersOpts, key })
  const compiledJsonSchema = compile({ jsonSchema })

  eValidate({ compiledJsonSchema, jsonSchema, data: opts, key, name })
}

const getAdapterOpts = function ({ name, opts, adaptersOpts, key }) {
  const adapterOpts = adaptersOpts[name]

  if (adapterOpts !== undefined) {
    return adapterOpts
  }

  throwPb({
    message: 'Unknown property',
    reason: 'CONFIG_VALIDATION',
    extra: { value: opts, path: `${key}.${name}` },
  })
}

const eValidate = addGenPbHandler(validate, {
  reason: 'CONFIG_VALIDATION',
  extra: ({ key, name, data, jsonSchema }) => ({
    value: data,
    jsonSchema,
    path: `${key}.${name}`,
  }),
})
