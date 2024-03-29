import { uniq } from '../../utils/functional/uniq.js'

// Add `modelscount` and `uniquecount`, using `results`.
// `modelscount` is the number of models in the response
// `uniquecount` is the same, without the duplicates
export const getModelscount = ({ results }) => {
  const modelscount = results.length
  const uniquecount = getUniquecount({ results })

  return { modelscount, uniquecount }
}

const getUniquecount = ({ results }) => {
  const keys = uniq(results, getCollnameId)
  return keys.length
}

const getCollnameId = ({ action: { collname }, model: { id } }) =>
  `${collname} ${id}`
