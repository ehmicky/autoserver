import { getShortcut } from '../../helpers.js'

// Gets a map of collections' attributes' aliases
// e.g. { collname: { attrName: ['alias', ...], ... }, ... }
export const aliasesMap = function ({ config }) {
  return getShortcut({ config, filter: 'alias', mapper })
}

const mapper = function ({ alias }) {
  return Array.isArray(alias) ? alias : [alias]
}
