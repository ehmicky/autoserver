import { validateMaxmodels } from './limits.js'
import { getParentResults, getParentIds } from './parent_results.js'

// Retrieve the main information we need to perform the commands
export const getInput = ({
  action: { commandpath },
  results,
  maxmodels,
  top,
}) => {
  const parentResults = getParentResults({ commandpath, results })
  const commandName = commandpath[commandpath.length - 1]
  const { nestedParentIds, parentIds, allIds } = getParentIds({
    commandName,
    parentResults,
  })

  validateMaxmodels({ results, allIds, maxmodels, top })

  return { parentResults, commandName, nestedParentIds, parentIds }
}
