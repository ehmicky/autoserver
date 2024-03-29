import { setTimeout } from 'node:timers/promises'

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
  await setTimeout(0)

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
