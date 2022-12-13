import { uniq } from '../../utils/functional/uniq.js'

// Remove duplicate read models
// Those can happen with some database. E.g. MongoDB sometimes release read
// locks in the middle of a query, which can result in the same model appearing
// twice in the response.
export const duplicateReads = ({ response: { data, ...rest } }) => {
  const dataA = uniq(data, ({ id }) => id)
  return { response: { data: dataA, ...rest } }
}
