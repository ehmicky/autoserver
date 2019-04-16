import { pSetTimeout } from '../../../../utils/timeout.js'

import { find } from './find/main.js'
import { delete as deleteMany } from './delete.js'
import { upsert } from './upsert.js'

// CRUD commands
const query = async function({
  collname,
  command,
  filter,
  deletedIds,
  newData,
  order,
  limit,
  offset,
  connection,
}) {
  // Simulate asynchronousity
  await pSetTimeout(0)

  const collection = connection[collname]

  return commands[command]({
    collection,
    filter,
    deletedIds,
    newData,
    order,
    limit,
    offset,
  })
}

const commands = {
  find,
  delete: deleteMany,
  upsert,
}

module.exports = {
  query,
}
