'use strict'

const { uniq } = require('../../../utils/functional/uniq.js')
const { getColl } = require('../get_coll')

const { getDataPath } = require('./data_path')
const { isModelType } = require('./validate')

// Retrieve the keys of an `args.data` object which are nested collections
const getNestedKeys = function({ data, commandpath, top, config }) {
  const nestedKeys = data.flatMap(Object.keys)
  const nestedKeysA = uniq(nestedKeys)
  // Keep only the keys which are nested collections
  const nestedKeysB = nestedKeysA.filter(attrName =>
    isModel({ attrName, commandpath, top, config }),
  )
  return nestedKeysB
}

const isModel = function({ attrName, commandpath, top, config }) {
  const commandpathA = [...commandpath, attrName]
  const coll = getColl({ top, config, commandpath: commandpathA })
  return coll !== undefined && coll.collname !== undefined
}

// Retrieve children actions of an `args.data` object by iterating over them
const getNestedActions = function({ nestedKeys, ...rest }) {
  return nestedKeys.flatMap(nestedKey =>
    getNestedAction({ ...rest, nestedKey }),
  )
}

const getNestedAction = function({
  data,
  dataPaths,
  commandpath,
  top,
  config,
  nestedKey,
  parseActions,
}) {
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
const getData = function({ data, nestedKey }) {
  return data.flatMap(datum => datum[nestedKey]).filter(isModelType)
}

// Add the `dataPaths` to the nested data, by adding `nestedKey` to each parent
// `dataPaths`
const getDataPaths = function({ dataPaths, data, nestedKey }) {
  return dataPaths.flatMap((dataPath, index) =>
    getDataPath({
      data: data[index][nestedKey],
      commandpath: [...dataPath, nestedKey],
    }),
  )
}

module.exports = {
  isModel,
  getNestedKeys,
  getNestedActions,
}
