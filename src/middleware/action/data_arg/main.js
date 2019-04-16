import { getLimits } from '../../../limits.js'
import { addActions } from '../add_actions/merge.js'

import { getDataPath } from './data_path.js'
import { parseData } from './data.js'
import { parseActions } from './actions.js'

// Parse `args.data` into write `actions`
const parseDataArg = function({ actions, ...rest }) {
  const actionsA = addActions({
    actions,
    filter: ['data'],
    mapper: getDataAction,
    ...rest,
  })
  return { actions: actionsA }
}

const getDataAction = function({
  top,
  top: { command },
  action: {
    args: { data },
    commandpath,
  },
  config,
  config: {
    shortcuts: { userDefaultsMap },
  },
  mInput,
  dbAdapters,
}) {
  const { maxAttrValueSize } = getLimits({ config })

  // Top-level `dataPaths`
  const dataPaths = getDataPath({ data, commandpath })

  const dataA = parseData({
    data,
    commandpath,
    command,
    top,
    mInput,
    maxAttrValueSize,
    config,
    userDefaultsMap,
    dbAdapters,
  })

  const newActions = parseActions({
    data: dataA,
    commandpath,
    dataPaths,
    top,
    config,
  })

  return newActions
}

module.exports = {
  parseDataArg,
}
