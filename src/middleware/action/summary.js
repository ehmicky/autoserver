import { isDeepStrictEqual } from 'node:util'

// Retrieves `summary`
// This is all `actions`, included nested ones as a nice formatted string,
// e.g. 'find_collection{attrA,attrB,child{attrC}}'
// Also retrieves `commandpaths` and `collnames`
export const getSummary = ({ actions, top, top: { commandpath } }) => {
  const summary = getEachSummary({ actions, commandpath, top })
  const commandpaths = getCommandpaths({ actions })
  const collnames = getCollnames({ actions })
  return { summary, commandpaths, collnames }
}

const getEachSummary = ({ actions, commandpath: path, top }) => {
  const commandName = getCommandName({ path, top })

  const childActions = actions.filter(
    ({ commandpath }) =>
      commandpath.length !== 0 &&
      isDeepStrictEqual(path, commandpath.slice(0, -1)),
  )

  if (childActions.length === 0) {
    return commandName
  }

  const childActionsStr = childActions
    .map(({ commandpath }) => getEachSummary({ actions, commandpath, top }))
    .join(',')
  const summary = `${commandName}{${childActionsStr}}`

  return summary
}

const getCommandName = ({ path, top: { clientCollname, command } }) =>
  path.length === 0 ? `${command.type}_${clientCollname}` : path.at(-1)

// List of all actions's `commandpath`
const getCommandpaths = ({ actions }) =>
  actions.map(({ commandpath }) => commandpath.join('.'))

// List of all actions's `collname`
const getCollnames = ({ actions }) => actions.map(({ collname }) => collname)
