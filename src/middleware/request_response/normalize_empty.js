import { excludeKeys } from 'filter-obj'

// Normalize empty values (undefined, null) by removing their key
export const normalizeEmpty = ({ args, args: { newData } }) => {
  if (newData === undefined) {
    return
  }

  const newDataA = newData.map(removeEmpty)
  return { args: { ...args, newData: newDataA } }
}

const removeEmpty = (newData) => excludeKeys(newData, hasNoValue)

const hasNoValue = (key, value) => value === undefined || value === null
