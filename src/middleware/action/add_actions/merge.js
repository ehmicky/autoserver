import { isDeepStrictEqual } from 'node:util'

import { getValues } from './values.js'

// Add new actions to the current request
export const addActions = ({ actions, filter, mapper, ...rest }) => {
  const newActions = getValues({ actions, filter, mapper, ...rest })
  const actionsA = mergeActions({ actions, newActions })
  return actionsA
}

// Merge two sets of actions
const mergeActions = ({ actions, newActions }) => {
  if (newActions.length === 0) {
    return actions
  }

  const actionsA = actions.map((action) => mergeAction({ action, newActions }))
  const newActionsA = newActions.filter((newAction) =>
    isNotMerged({ actions, newAction }),
  )
  return [...actionsA, ...newActionsA]
}

const mergeAction = ({ action, newActions }) => {
  const newActionA = newActions.find((newAction) =>
    hasSamePath({ action, newAction }),
  )

  if (newActionA === undefined) {
    return action
  }

  return {
    ...action,
    ...newActionA,
    args: { ...action.args, ...newActionA.args },
  }
}

const isNotMerged = ({ actions, newAction }) =>
  actions.every((action) => !hasSamePath({ action, newAction }))

const hasSamePath = ({ action, newAction }) =>
  isDeepStrictEqual(action.commandpath, newAction.commandpath)
