import { uniq } from '../utils/functional/uniq.js'

import { crawlNodes } from './crawl.js'
import { isSiblingValue } from './siblings.js'

// Returns all the database features needed by this filter
export const getFeatures = function ({ filter }) {
  if (filter === undefined) {
    return []
  }

  const features = crawlNodes(filter, getFeature)
  const featuresA = features.flat()
  const featuresB = uniq(featuresA)
  return featuresB
}

const getFeature = function ({ type, attrName, value }) {
  // `model.ATTR` targetting a sibling in `args.filter`
  if (isSiblingValue({ value })) {
    return ['filter:sibling']
  }

  // Simple filters, i.e. { id: string } and { id: { _in: array } }
  // do not require any feature, because every database adapter should
  // support them, since many things depend on those basic operations.
  if (attrName === 'id' && NO_FEATURE_TYPES.has(type)) {
    return []
  }

  return [`filter:${type}`]
}

const NO_FEATURE_TYPES = new Set(['_in', '_eq'])
