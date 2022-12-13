// Create a structure indicating which actions are the parents of which action.
// This is needed since parent actions must be fired before children.
// Uses `commandpath` to determine this, and output a recursive structure
// { parentAction, childActions: [{...}, ...] }
export const getParentActions = ({ actions }) =>
  actions
    .filter((action) => isParentAction({ action, actions }))
    .map((parentAction) => getParentAction({ parentAction, actions }))

const getParentAction = ({ parentAction, actions }) => {
  const childActions = getChildActions({ parentAction, actions })
  const childActionsA = getParentActions({ actions: childActions })
  return { parentAction, childActions: childActionsA }
}

const isParentAction = ({ action: childAction, actions }) =>
  !actions.some((parentAction) => isChildAction({ childAction, parentAction }))

const getChildActions = ({ parentAction, actions }) =>
  actions.filter((childAction) => isChildAction({ childAction, parentAction }))

const isChildAction = ({
  parentAction,
  parentAction: { commandpath: parentPath },
  childAction,
  childAction: { commandpath: childPath },
}) =>
  childAction !== parentAction &&
  childPath.length > parentPath.length &&
  childPath.join('.').startsWith(parentPath.join('.'))
