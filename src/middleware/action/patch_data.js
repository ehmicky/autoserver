import { applyPatchOps } from '../../patch/apply.js'
import { groupBy } from '../../utils/functional/group.js'
import { mapValues } from '../../utils/functional/map.js'

// Merge `currentData` with the `args.data` in `patch` commands,
// to obtain the final models we want to use as replacement
export const patchData = ({ actions, top: { command }, config, mInput }) => {
  if (command.type !== 'patch') {
    return
  }

  const dataMap = mergePartialData({ actions, config, mInput })
  const actionsA = actions.map((action) => addData({ action, dataMap }))

  return { actions: actionsA }
}

// Merge `currentData` with `args.data`
const mergePartialData = ({ actions, config, mInput }) => {
  const actionsA = actions.flatMap(flattenAction)
  const dataMap = groupBy(actionsA, getActionKey)
  const dataMapA = mapValues(dataMap, (actionsB) =>
    mergeDatum({ actions: actionsB, config, mInput }),
  )
  return dataMapA
}

// Flatten `action.data` and `action.currentData` together
const flattenAction = ({
  currentData,
  args: {
    data: [patchOps],
  },
  collname,
  commandpath,
}) =>
  currentData.map((currentDatum) => ({
    patchOps,
    currentDatum,
    collname,
    commandpath,
  }))

// Group args.data according to currentData `id` and `collname`
const getActionKey = ({ collname, currentDatum: { id } }) => `${collname} ${id}`

// Do the actual merging
const mergeDatum = ({
  actions,
  actions: [{ currentDatum, commandpath, collname }],
  config,
  mInput,
}) => {
  // Several actions might target the same model, but with different args.data
  // We merge all the args.data here, with priority to the children, then to the
  // next siblings.
  const datumA = actions.reduce(
    (datum, { patchOps }) =>
      applyPatchOps({ datum, patchOps, commandpath, config, collname, mInput }),
    currentDatum,
  )
  return datumA
}

// Add merged `args.data` to each action
const addData = ({
  action,
  action: { args, collname, currentData },
  dataMap,
}) => {
  const data = currentData.map(({ id }) => dataMap[`${collname} ${id}`])
  return { ...action, args: { ...args, data } }
}
