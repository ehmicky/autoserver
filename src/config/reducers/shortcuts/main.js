'use strict'

const { mapValues } = require('../../../utils/functional/map.js')

const { aliasesMap } = require('./aliases.js')
const { collsNames } = require('./colls_names.js')
const { readonlyMap } = require('./readonly.js')
const { userDefaultsMap } = require('./user_defaults.js')
const { valuesMap } = require('./value.js')

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
