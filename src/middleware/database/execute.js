import { extractSimpleIds } from '../../filter/simple_id.js'

// Delegates to database adapter
export const databaseExecute = async ({
  dbAdapter,
  collname,
  args,
  args: { dryrun },
  command,
}) => {
  // Make write commands not change data, if argument `dryrun` is used
  if (dryrun && command !== 'find') {
    return
  }

  const commandInput = getCommandInput({ command, collname, args })

  const dbData = await dbAdapter.query(commandInput)
  return { dbData }
}

// Database adapter input
const getCommandInput = ({
  command,
  collname,
  args: { filter = {}, order, limit, offset, newData, deletedIds },
}) => {
  const filterIds = extractSimpleIds({ filter })

  const commandA = commandMap[command]

  return {
    command: commandA,
    filter,
    filterIds,
    collname,
    deletedIds,
    newData,
    order,
    limit,
    offset,
  }
}

// From API command to database adapter's command
// `patch` behaves like a `find` followed by a `upsert`.
// `create` does an upsert to minimize concurrency conflicts,
// i.e. if the model was created or deleted since the `currentData` query was
// performed
const commandMap = {
  find: 'find',
  delete: 'delete',
  patch: 'upsert',
  upsert: 'upsert',
  create: 'upsert',
}
