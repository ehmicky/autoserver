import { omitBy } from '../../utils/functional/filter.js'

// Normalize empty values (undefined, null) by removing their key
const normalizeEmpty = function({ args, args: { newData } }) {
  if (newData === undefined) {
    return
  }

  const newDataA = newData.map(removeEmpty)
  return { args: { ...args, newData: newDataA } }
}

const removeEmpty = function(newData) {
  return omitBy(newData, value => value == null)
}

module.exports = {
  normalizeEmpty,
}
