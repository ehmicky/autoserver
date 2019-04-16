import { omitBy } from '../../../utils/functional/filter.js'
import { mapValues } from '../../../utils/functional/map.js'
import { getColl } from '../get_coll.js'

import { isModelsType } from './validate.js'

// Transform each `args.data` object into a separate write action
export const getWriteAction = function({
  data,
  commandpath,
  dataPaths,
  top,
  config,
  nestedKeys,
}) {
  const { collname } = getColl({ top, config, commandpath })

  const dataA = data.map(datum => replaceNestedData({ datum, nestedKeys }))
  const args = { data: dataA }

  return { commandpath, args, collname, dataPaths }
}

// Replace nested objects from each `args.data` by only their ids
const replaceNestedData = function({ datum, nestedKeys }) {
  const datumA = mapValues(datum, (value, key) =>
    replaceNestedDatum({ value, key, nestedKeys }),
  )
  // Patch commands do not use ids in args.data,
  // i.e. will create undefined values
  const datumB = omitBy(datumA, value => value === undefined)
  return datumB
}

const replaceNestedDatum = function({ value, key, nestedKeys }) {
  if (!(nestedKeys.includes(key) && isModelsType(value))) {
    return value
  }

  return Array.isArray(value) ? value.map(({ id }) => id) : value.id
}
