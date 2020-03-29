import filterObj from 'filter-obj'

import { crawlNodes } from '../../../filter/crawl.js'
import { runConfigFunc } from '../../../functions/run.js'
import { intersection } from '../../../utils/functional/intersection.js'
import { mapValues } from '../../../utils/functional/map.js'
import { uniq } from '../../../utils/functional/uniq.js'

// Retrieve all server-specific parameters used in `coll.authorize`, and
// resolve their config functions.
export const getServerParams = function ({ authorize, serverParams, mInput }) {
  // Retrieve all `attrName` recursively inside filter AST
  const attrNames = crawlNodes(authorize, ({ attrName }) => attrName)
  const serverParamsNames = getPossibleServerParams({
    attrNames,
    serverParams,
  })
  const serverParamsA = filterObj(serverParams, serverParamsNames)
  const serverParamsB = mapValues(serverParamsA, (configFunc) =>
    runConfigFunc({ configFunc, mInput }),
  )
  return serverParamsB
}

// Only keep the `attrName` that targets a server-specific parameters
const getPossibleServerParams = function ({ attrNames, serverParams }) {
  const possibleServerParams = Object.keys(serverParams)
  const serverParamsNames = intersection(attrNames, possibleServerParams)
  const serverParamsNamesA = uniq(serverParamsNames)
  return serverParamsNamesA
}
