import { includeKeys } from 'filter-obj'

import { mapValues } from '../utils/functional/map.js'

// Apply a mapping function on each collection
export const mapColls = (func, { config, config: { collections } }) => {
  const collectionsA = mapValues(collections, (coll, collname) =>
    mapColl({ func, coll, collname, config }),
  )
  return { collections: collectionsA }
}

const mapColl = ({ func, coll, collname, config }) => {
  const collA = func({ coll, collname, config })
  return { ...coll, ...collA }
}

// Apply a mapping function on each collection's attribute
export const mapAttrs = (func, { config }) => {
  const funcA = mapCollAttrs.bind(undefined, func)
  return mapColls(funcA, { funcA, config })
}

const mapCollAttrs = (
  func,
  { coll, coll: { attributes }, collname, config },
) => {
  if (attributes === undefined) {
    return
  }

  const attributesA = mapValues(attributes, (attr, attrName) =>
    mapAttr({
      func,
      attr,
      attrName,
      coll,
      collname,
      config,
    }),
  )
  return { attributes: attributesA }
}

const mapAttr = ({ func, attr, attrName, coll, collname, config }) => {
  const attrA = func({ attr, attrName, coll, collname, config })
  return { ...attr, ...attrA }
}

// Create shortcuts map by iterating over each collection and its attributes
export const getShortcut = ({ filter, mapper, config: { collections } }) =>
  mapValues(collections, ({ attributes = {} }) =>
    getShortcutColl({ attributes, filter, mapper }),
  )

const getShortcutColl = ({ attributes, filter, mapper }) => {
  const attributesA = includeKeys(attributes, (key, attr) =>
    Object.keys(attr).includes(filter),
  )
  const attributesB = mapValues(attributesA, mapper)
  return attributesB
}
