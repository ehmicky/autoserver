import { getLimits } from '../../../limits.js'
import { addActions } from '../add_actions/merge.js'

import { parseActions } from './actions.js'
import { parseData } from './data.js'
import { getDataPath } from './data_path.js'

// Parse `args.data` into write `actions`
export const parseDataArg = ({ actions, ...rest }) => {
  const actionsA = addActions({
    actions,
    filter: ['data'],
    mapper: getDataAction,
    ...rest,
  })
  return { actions: actionsA }
}

const getDataAction = ({
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
}) => {
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
