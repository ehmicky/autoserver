import { sortByAttributes } from '../../../../../utils/functional/sort.js'

// `order` sorting
export const sortResponse = ({ data, order }) => {
  if (!order) {
    return data
  }

  return sortByAttributes(data, order)
}
