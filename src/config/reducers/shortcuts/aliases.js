import { getShortcut } from '../../helpers.js'

// Gets a map of collections' attributes' aliases
// e.g. { collname: { attrName: ['alias', ...], ... }, ... }
export const aliasesMap = ({ config }) =>
  getShortcut({ config, filter: 'alias', mapper })

const mapper = ({ alias }) => (Array.isArray(alias) ? alias : [alias])
