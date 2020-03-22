import { deepMerge } from '../../utils/functional/merge.js'
import { PROTOCOL_DEFAULTS } from '../../protocols/info.js'
import { DEFAULT_DATABASE } from '../../databases/get.js'
import { DATABASE_DEFAULTS } from '../../databases/info.js'
import { mapColls, mapAttrs } from '../helpers.js'

// Add config default values
export const addDefaults = function ({ config }) {
  const configA = addTopDefaults({ config })
  const configB = addCollsDefaults({ config: configA })
  const configC = addAttrsDefaults({ config: configB })
  return configC
}

// Top-level defaults
const addTopDefaults = function ({ config }) {
  const configA = deepMerge(TOP_DEFAULT_VALUES, DYNAMIC_DEFAULTS, config)
  return configA
}

// Collection-level defaults
const addCollsDefaults = function ({ config }) {
  const configA = mapColls(addCollDefaults, { config })
  return { ...config, ...configA }
}

const addCollDefaults = function ({ coll }) {
  return deepMerge(COLL_DEFAULTS, coll)
}

// Attribute-level defaults
const addAttrsDefaults = function ({ config }) {
  const configA = mapAttrs(addAttrDefaults, { config })
  return { ...config, ...configA }
}

const addAttrDefaults = function ({ attr }) {
  return deepMerge(ATTR_DEFAULTS, attr)
}

const TOP_DEFAULT_VALUES = {
  env: 'dev',
  collections: {},
  params: {},
  plugins: {},
  validation: {},
  operators: {},
  log: [],
  limits: {
    maxpayload: '10MB',
    pagesize: 100,
  },
}

const DYNAMIC_DEFAULTS = {
  databases: DATABASE_DEFAULTS,
  protocols: PROTOCOL_DEFAULTS,
}

const COLL_DEFAULTS = {
  database: DEFAULT_DATABASE,
  attributes: {
    id: { description: 'Unique identifier' },
  },
}

const ATTR_DEFAULTS = {
  type: 'string',
  validate: {},
}
