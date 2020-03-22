import { sortBy } from '../../../../../utils/functional/sort.js'

// `order` sorting
export const sortResponse = function ({ data, order }) {
  if (!order) {
    return data
  }

  return sortBy(data, order)
}
