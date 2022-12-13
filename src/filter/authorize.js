import { includeKeys } from 'filter-obj'

import { SYSTEM_PARAMS } from '../functions/params/system.js'
import { mapValues } from '../utils/functional/map.js'

// Retrieve type and names of all possible `coll.authorize.*`
export const getAuthorizeAttrs = ({ config, collname }) => {
  const serverParams = getServerParams({ config })
  const modelAttrs = getModelAttrs({ config, collname })
  return { ...serverParams, ...modelAttrs, ...SYSTEM_PARAMS }
}

// `coll.authorize.SERVERPARAM`
const getServerParams = ({ config: { params = {} } }) =>
  mapValues(params, () => ({ type: 'dynamic' }))

// `coll.authorize['model.ATTR']`
const getModelAttrs = ({ config: { collections }, collname }) => {
  if (collname === undefined) {
    return
  }

  const { attributes = {} } = collections[collname]
  const modelAttrs = mapValues(attributes, getModelAttr)
  return { model: modelAttrs }
}

const getModelAttr = (attr) => includeKeys(attr, ['type', 'isArray'])
