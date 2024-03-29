import pluralize from 'pluralize'

import { getWordsList } from '../../utils/string.js'

// Try to make error messages start the same way when referring to models
export const getModels = ({ ids, op = 'and', collection } = {}) => {
  if (collection === undefined) {
    return 'Those models'
  }

  if (ids === undefined) {
    return `Those '${collection}' models`
  }

  const idsA = getWordsList(ids, { op, quotes: true })
  const modelsStr = pluralize('model', ids.length)
  const models = `The '${collection}' ${modelsStr} with 'id' ${idsA}`
  return models
}

// Add prefix common to all adapter-related errors
export const getAdapterMessage = ({ adapter }) => {
  if (adapter === undefined) {
    return
  }

  return `In the adapter '${adapter}'`
}
