import { mapValues } from '../../../utils/functional/map.js'

import { aliasesMap } from './aliases.js'
import { collsNames } from './colls_names.js'
import { readonlyMap } from './readonly.js'
import { userDefaultsMap } from './user_defaults.js'
import { valuesMap } from './value.js'

// Startup transformations just meant for runtime performance optimization
const normalizeShortcuts = function({ config }) {
  const shortcuts = mapValues(MAPS, func => func({ config }))
  return { shortcuts }
}

const MAPS = {
  aliasesMap,
  collsNames,
  readonlyMap,
  userDefaultsMap,
  valuesMap,
}

module.exports = {
  normalizeShortcuts,
}
