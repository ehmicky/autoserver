import { mapAttrs } from '../helpers.js'

// Copy `attr.type|description` to nested collections
// from the `coll.id` they refer to
const mapAttr = ({ attr, config: { collections } }) => {
  if (attr.target === undefined) {
    return
  }

  const [, collA] = Object.entries(collections).find(
    ([name, coll]) => coll.collname === attr.target || name === attr.target,
  )

  const { type } = collA.attributes.id
  const description = attr.description || collA.description

  return { type, description }
}

export const mergeNestedColl = mapAttrs.bind(undefined, mapAttr)
