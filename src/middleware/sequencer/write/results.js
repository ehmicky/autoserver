import { throwPb } from '../../../errors/props.js'

import { handlers } from './args.js'

// Transform `data` to normalized `results`
export const getResults = function ({ actions, data, metadata, ids, top }) {
  validateData({ ids, data })

  return actions.flatMap((action) => setModels({ action, data, metadata, top }))
}

// `results` should be in same order as `args.data` or
// (for `delete`) as `currentData`, and reuse their `dataPaths`
const setModels = function ({
  data,
  metadata,
  action,
  action: { dataPaths },
  top: { command },
}) {
  const { getModels } = handlers[command.type]
  const models = getModels(action)
  return models
    .map(findModel.bind(null, { data, metadata, dataPaths, action }))
    .filter(({ path }) => path !== undefined)
}

const findModel = function (
  { data, metadata, dataPaths, action },
  { id },
  index,
) {
  const model = data.find((datum) => datum.id === id)
  const path = dataPaths[index]
  return { path, model, metadata, action }
}

// Safety check to make sure there is no server-side bugs
const validateData = function ({ ids, data }) {
  const sameLength = data.length === ids.length

  if (sameLength) {
    return
  }

  const message = "'ids' and 'results' do not have the same length"
  throwPb({ message, reason: 'ENGINE' })
}
