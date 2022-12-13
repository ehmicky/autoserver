import { pSetTimeout } from '../../../../utils/timeout.js'

import { deleteMany } from './delete.js'
import { find } from './find/main.js'
import { upsert } from './upsert.js'

// CRUD commands
export const query = async ({
  collname,
  command,
  filter,
  deletedIds,
  newData,
  order,
  limit,
  offset,
  connection,
}) => {
  // Simulate asynchronousity
  await pSetTimeout(0)

  const collection = connection[collname]

  return COMMANDS[command]({
    collection,
    filter,
    deletedIds,
    newData,
    order,
    limit,
    offset,
  })
}

const COMMANDS = { find, delete: deleteMany, upsert }
