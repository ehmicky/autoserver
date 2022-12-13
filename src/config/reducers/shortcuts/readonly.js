import { getShortcut } from '../../helpers.js'

// Gets a map of collections' readonly attributes,
// e.g. { my_coll: { attribute: 'readonly_value', ... }, ... }
export const readonlyMap = ({ config }) =>
  getShortcut({ config, filter: 'readonly', mapper })

const mapper = ({ readonly }) => readonly
