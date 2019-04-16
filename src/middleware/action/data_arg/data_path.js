import { isModelsType } from './validate.js'

// Retrieve the path to each nested object inside `args.data`
export const getDataPath = function({ data, commandpath }) {
  if (!isModelsType(data)) {
    return []
  }

  if (!Array.isArray(data)) {
    return [commandpath]
  }

  return Object.keys(data).map(index => [...commandpath, Number(index)])
}
