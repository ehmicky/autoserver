import filterObj from 'filter-obj'

// Normalize empty values (undefined, null) by removing their key
export const normalizeEmpty = function({ args, args: { newData } }) {
  if (newData === undefined) {
    return
  }

  const newDataA = newData.map(removeEmpty)
  return { args: { ...args, newData: newDataA } }
}

const removeEmpty = function(newData) {
  return filterObj(newData, hasValue)
}

const hasValue = function(key, value) {
  return value != null
}
