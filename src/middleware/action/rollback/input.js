import omit from 'omit.js'

// Retrieve a database input that reverts the write action, if it was
// successful, or is a noop, if it was not performed.
export const getRollbackInput = ({ command, args, ...input }) => {
  const inputs = handlers[command](args)
  return inputs.map((inputA) => ({ ...input, ...inputA }))
}

// Rollback `create` with a `delete`
const deleteRollback = ({ newData, ...args }) => {
  if (newData.length === 0) {
    return []
  }

  const deletedIds = newData.map(({ id }) => id)
  const argsA = { ...args, deletedIds }
  const argsB = omit.default(argsA, ['newData'])
  return [{ command: 'delete', args: argsB }]
}

// Rollback `patch|delete` by upserting the original models
const upsertRollback = ({ currentData, ...args }) => {
  if (currentData.length === 0) {
    return []
  }

  const argsA = { ...args, currentData, newData: currentData }
  const argsB = omit.default(argsA, ['deletedIds'])
  return [{ command: 'upsert', args: argsB }]
}

// Rollback `upsert` by either deleting the model (if it did not exist before),
// or upserting the original model (it it existed before)
const deleteOrUpsertRollback = (args) => [
  ...getDeleteRollback(args),
  ...getUpsertRollback(args),
]

const getDeleteRollback = ({ currentData, newData, ...args }) => {
  const deletedData = newData.filter(
    (datum, index) => currentData[index] === undefined,
  )
  const currentDataA = currentData.filter(
    (currentDatum) => currentDatum === undefined,
  )
  const deletedArgs = {
    ...args,
    currentData: currentDataA,
    newData: deletedData,
  }
  const deleteInput = deleteRollback(deletedArgs)
  return deleteInput
}

const getUpsertRollback = ({ currentData, ...args }) => {
  const upsertData = currentData.filter(
    (currentDatum) => currentDatum !== undefined,
  )
  const upsertArgs = { ...args, currentData: upsertData }
  const upsertInput = upsertRollback(upsertArgs)
  return upsertInput
}

const handlers = {
  create: deleteRollback,
  patch: upsertRollback,
  delete: upsertRollback,
  upsert: deleteOrUpsertRollback,
}
