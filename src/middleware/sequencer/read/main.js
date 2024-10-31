import { getLimits } from '../../../limits.js'

import { fireReadCommand } from './command.js'
import { addPendingResults, getConcurrentCommand } from './concurrent.js'
import { getInput } from './input.js'
import { paginateResults } from './paginate/main.js'
import { getParentActions } from './parent_actions.js'
import { addNestedFilter } from './parent_results.js'
import { processResults } from './results.js'

// Fire all commands associated with a set of read actions
export const sequenceRead = async ({ actions, config, mInput }, nextLayer) => {
  const { maxmodels } = getLimits({ config })

  const actionsA = getParentActions({ actions })

  const results = []
  await fireReads(
    { ...mInput, maxmodels, actions: actionsA, results, isTopLevel: true },
    nextLayer,
  )

  return { results }
}

const fireReads = ({ actions, results, isTopLevel, ...mInput }, nextLayer) => {
  // Siblings can be run in parallel
  // Children will fire this function recursively, waiting for their parent
  const resultsPromises = actions.map(({ parentAction, childActions }) =>
    fireRead({
      action: parentAction,
      childActions,
      nextLayer,
      mInput,
      results,
      isTopLevel,
    }),
  )
  return Promise.all(resultsPromises)
}

const fireRead = async ({
  action,
  action: { args, collname },
  childActions,
  nextLayer,
  mInput,
  mInput: { top, maxmodels },
  results,
  isTopLevel,
}) => {
  const { parentResults, commandName, nestedParentIds, parentIds } = getInput({
    action,
    results,
    maxmodels,
    top,
  })

  const argsA = addNestedFilter({ args, isTopLevel, parentIds })

  const { concurrentPromises, args: argsB } = getConcurrentCommand({
    args: argsA,
    results,
    collname,
  })

  const promise = fireReadCommand({ action, mInput, nextLayer, args: argsB })

  const pendingResults = addPendingResults({
    args: argsB,
    collname,
    results,
    promise,
  })

  // Parent actions must be run first, so we wait here for `promise`
  const finishedResults = await Promise.all([promise, ...concurrentPromises])

  processResults({
    results,
    finishedResults,
    pendingResults,
    action,
    commandName,
    isTopLevel,
    parentResults,
    nestedParentIds,
    top,
    collname,
  })

  paginateResults({ results, maxmodels, top, isTopLevel, childActions })

  // Recursive call
  // Child actions must start after their parent ends
  const mInputA = { ...mInput, actions: childActions, results }
  await fireReads(mInputA, nextLayer)
}
