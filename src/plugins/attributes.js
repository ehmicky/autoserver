import pluralize from 'pluralize'

import { addGenErrorHandler } from '../errors/handler.js'
import { throwError } from '../errors/main.js'
import { intersection } from '../utils/functional/intersection.js'
import { mapValues } from '../utils/functional/map.js'
import { getWordsList } from '../utils/string.js'
import { compile } from '../validation/compile.js'
import { validate } from '../validation/validate.js'

// Generic plugin factory
// It adds attributes to each collection, using `getAttributes(pluginOpts)`
// option which returns the attributes
export const attributesPlugin = ({
  name,
  getAttributes = () => ({}),
  optsSchema,
  config: { collections },
  opts,
}) => {
  if (!collections) {
    return
  }

  validateOpts({ name, opts, optsSchema, collections })

  const newAttrs = getAttributes(opts)

  const collectionsA = applyPlugin({ collections, newAttrs })

  return { collections: collectionsA }
}

// Validate plugin options against `optsSchema`
const validateOpts = ({ name, opts = {}, optsSchema, collections }) => {
  if (optsSchema === undefined) {
    return
  }

  const jsonSchema = getJsonSchema({ optsSchema })
  const data = getData({ collections, opts })
  const compiledJsonSchema = compile({ jsonSchema })

  eValidate({ compiledJsonSchema, data, name })
}

const getJsonSchema = ({ optsSchema }) => ({
  type: 'object',
  properties: { plugin: optsSchema },
})

const getData = ({ collections, opts }) => {
  const collTypes = Object.keys(collections)
  const data = {
    plugin: opts,
    dynamicVars: { collTypes },
  }
  return data
}

const applyPlugin = ({ collections, newAttrs }) =>
  mapValues(collections, (coll, collname) =>
    mergeNewAttrs({ coll, collname, newAttrs }),
  )

const mergeNewAttrs = ({
  coll,
  coll: { attributes = {} },
  collname,
  newAttrs,
}) => {
  validateAttrs({ attributes, collname, newAttrs })

  const collA = { attributes: { ...attributes, ...newAttrs } }
  return { ...coll, ...collA }
}

// Make sure plugin does not override user-defined attributes
const validateAttrs = ({ attributes, collname, newAttrs }) => {
  const attrNames = Object.keys(attributes)
  const newAttrNames = Object.keys(newAttrs)
  const alreadyDefinedAttrs = intersection(attrNames, newAttrNames)

  if (alreadyDefinedAttrs.length === 0) {
    return
  }

  // Returns human-friendly version of attributes, e.g. 'attribute my_attr' or
  // 'attributes my_attr and my_other_attr'
  const attrsName = pluralize('attributes', newAttrNames.length)
  const attrsValue = getWordsList(newAttrNames, { op: 'and', quotes: true })
  const message = `In collection '${collname}', cannot override ${attrsName} ${attrsValue}`
  throwError(message, { reason: 'CONFIG_VALIDATION' })
}

const eValidate = addGenErrorHandler(validate, {
  reason: 'CONFIG_VALIDATION',
  message: ({ name }, { message }) =>
    `Wrong '${name}' plugin configuration: ${message}`,
})
