import { uniq } from '../../../utils/functional/uniq.js'
import { getColl } from '../get_coll.js'

import { getDataPath } from './data_path.js'
import { isModelType } from './validate.js'

// Retrieve the keys of an `args.data` object which are nested collections
export const getNestedKeys = ({ data, commandpath, top, config }) => {
  const nestedKeys = data.flatMap(Object.keys)
  const nestedKeysA = uniq(nestedKeys)
  // Keep only the keys which are nested collections
  const nestedKeysB = nestedKeysA.filter((attrName) =>
    isModel({ attrName, commandpath, top, config }),
  )
  return nestedKeysB
}

export const isModel = ({ attrName, commandpath, top, config }) => {
  const commandpathA = [...commandpath, attrName]
  const coll = getColl({ top, config, commandpath: commandpathA })
  return coll !== undefined && coll.collname !== undefined
}

// Retrieve children actions of an `args.data` object by iterating over them
export const getNestedActions = ({ nestedKeys, ...rest }) =>
  nestedKeys.flatMap((nestedKey) => getNestedAction({ ...rest, nestedKey }))

const getNestedAction = ({
  data,
  dataPaths,
  commandpath,
  top,
  config,
  nestedKey,
  parseActions,
}) => {
  const nestedCommandpath = [...commandpath, nestedKey]
  const nestedData = getData({ data, nestedKey })
  const nestedDataPaths = getDataPaths({ dataPaths, data, nestedKey })

  return parseActions({
    commandpath: nestedCommandpath,
    data: nestedData,
    dataPaths: nestedDataPaths,
    top,
    config,
  })
}

// Retrieve nested data
const getData = ({ data, nestedKey }) =>
  data.flatMap((datum) => datum[nestedKey]).filter(isModelType)

// Add the `dataPaths` to the nested data, by adding `nestedKey` to each parent
// `dataPaths`
const getDataPaths = ({ dataPaths, data, nestedKey }) =>
  dataPaths.flatMap((dataPath, index) =>
    getDataPath({
      data: data[index][nestedKey],
      commandpath: [...dataPath, nestedKey],
    }),
  )
