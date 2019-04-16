const { sortBy } = require('../../../../../utils/functional/sort.js')

// `order` sorting
const sortResponse = function({ data, order }) {
  if (!order) {
    return data
  }

  return sortBy(data, order)
}

module.exports = {
  sortResponse,
}
