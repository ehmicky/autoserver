import { getShortcut } from '../../helpers.js'

// Gets a map of collections' `value`
// e.g. { my_coll: { attrName: value, ... }, ... }
export const valuesMap = ({ config }) =>
  getShortcut({ config, filter: 'value', mapper })

const mapper = ({ value }) => value
