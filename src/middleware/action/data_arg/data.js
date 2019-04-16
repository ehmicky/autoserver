import { mapValues } from '../../../utils/functional/map.js'
import { preValidate } from '../../../patch/validate/main.js'
import { getColl } from '../get_coll.js'

import { validateData, isModelsType } from './validate.js'
import { addDefaultIds } from './default_id.js'
import { isModel } from './nested.js'

// Validates `args.data` and adds default ids.
export const parseData = function({ data, ...rest }) {
  const { collname } = getColl(rest)

  if (!Array.isArray(data)) {
    return parseDatum({ datum: data, collname, ...rest })
  }

  return data.map((datum, index) =>
    parseDatum({ datum, index, collname, ...rest }),
  )
}

const parseDatum = function({
  datum,
  attrName,
  index,
  commandpath,
  top,
  maxAttrValueSize,
  ...rest
}) {
  const path = [attrName, index].filter(part => part !== undefined)
  const commandpathA = [...commandpath, ...path]

  validateData({ datum, commandpath: commandpathA, top, maxAttrValueSize })

  const datumA = addDefaultIds({ datum, top, ...rest })

  return mapValues(datumA, (obj, attrNameA) =>
    parseAttr({
      obj,
      attrName: attrNameA,
      commandpath: commandpathA,
      top,
      maxAttrValueSize,
      ...rest,
    }),
  )
}

// Recursion over nested collections
const parseAttr = function({
  obj,
  commandpath,
  attrName,
  top,
  mInput,
  maxAttrValueSize,
  config,
  collname,
  ...rest
}) {
  const coll = config.collections[collname]
  preValidate({
    patchOp: obj,
    commandpath,
    attrName,
    top,
    maxAttrValueSize,
    coll,
    mInput,
    config,
  })

  const isNested =
    isModelsType(obj) && isModel({ attrName, commandpath, top, config })

  if (!isNested) {
    return obj
  }

  return parseData({
    data: obj,
    commandpath,
    attrName,
    top,
    maxAttrValueSize,
    config,
    mInput,
    ...rest,
  })
}
