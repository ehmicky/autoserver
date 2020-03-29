import { deleteFunc } from './delete.js'
import { find } from './find/main.js'
import { upsert } from './upsert.js'

// CRUD commands
export const query = async function (commandInput, ...args) {
  const { command, connection, collname } = commandInput

  // Add convenience input `collection`
  const collection = connection.collection(collname)
  const commandInputA = { ...commandInput, collection }

  const returnValue = await COMMANDS[command](commandInputA, ...args)

  // MongoDB read commands return models as is, but write commands return
  // a summary
  if (command === 'find') {
    return returnValue
  }

  validateWrongResult({ returnValue })
}

const COMMANDS = { find, delete: deleteFunc, upsert }

// MongoDB returns `result.ok` `0` when an error happened
const validateWrongResult = function ({
  returnValue: { result: { ok, errmsg, code } = {} },
}) {
  if (ok === 1) {
    return
  }

  const codeA = code === undefined ? '' : ` (code ${code})`
  throw new Error(`${errmsg}${codeA}`)
}
