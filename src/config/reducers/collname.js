import { mapColls } from '../helpers.js'

// Default `collection.name` to parent key
const mapColl = function ({ collname, coll: { name = [collname] } }) {
  const nameA = Array.isArray(name) ? name : [name]

  return { name: nameA }
}

export const normalizeClientCollname = mapColls.bind(undefined, mapColl)
