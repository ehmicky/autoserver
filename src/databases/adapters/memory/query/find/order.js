'use strict'

const { sortBy } = require('../../../../../utils')

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
