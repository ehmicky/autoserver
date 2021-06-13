import omit from 'omit.js'

import { get, set } from '../utils/functional/get_set.js'
import { deepMerge } from '../utils/functional/merge.js'
import { isObjectType } from '../utils/functional/type.js'

// Merge resolved JSON reference values back to original document
export const mergeChildren = function ({ content, children }) {
  return children.reduce(mergeChild, content)
}

const mergeChild = function (content, { keys, refContent }) {
  // If there was a top-level JSON reference pointing to a string, number, etc.
  // `content` should be that value, and skip other children
  if (!isObjectType(content)) {
    return content
  }

  const refContentA = mergeSiblings({ content, keys, refContent })

  const contentA = set(content, keys, refContentA)
  return contentA
}

// Siblings are merged with siblings
const mergeSiblings = function ({ content, keys, refContent }) {
  // If the child is not an object or array, it is directly set without merging
  if (!isObjectType(refContent)) {
    return refContent
  }

  const parent = get(content, keys)

  // Do not merge with siblings if there are none of them
  const hasSiblings = Object.keys(parent).length > 1

  if (!hasSiblings) {
    return refContent
  }

  const parentA = omit.default(parent, ['$ref'])
  const refContentA = deepMerge(parentA, refContent)
  return refContentA
}
