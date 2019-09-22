import filterObj from 'filter-obj'

// Similar to lodash omit(), but faster.
export const omit = function(obj, attribute) {
  const attributes = Array.isArray(attribute) ? attribute : [attribute]
  return filterObj(obj, key => !attributes.includes(key))
}
