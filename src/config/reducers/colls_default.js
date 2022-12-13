import omit from 'omit.js'

import { mapValues } from '../../utils/functional/map.js'
import { deepMerge } from '../../utils/functional/merge.js'

// Applies `config.collections.default` to each collection
export const applyCollsDefault = ({
  config: { collections = {}, collections: { default: collDefault } = {} },
}) => {
  const collectionsA = omit.default(collections, ['default'])
  const collectionsB = mapValues(collectionsA, (coll) =>
    applyCollDefault({ coll, collDefault }),
  )

  return { collections: collectionsB }
}

const applyCollDefault = ({ coll, collDefault }) => {
  const shouldApply = isProperColl(collDefault) && isProperColl(coll)

  if (!shouldApply) {
    return coll
  }

  return deepMerge(collDefault, coll)
}

const isProperColl = (coll) =>
  coll !== null && coll !== undefined && typeof coll === 'object'
