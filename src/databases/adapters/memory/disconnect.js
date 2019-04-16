import { addGenPbHandler } from '../../../errors/handler.js'
import { getByExt } from '../../../formats/get.js'
import { getRef } from '../../../json_refs/ref_path.js'

// Stops connection
// Persist back to file, unless database adapter option `save` is false
const disconnect = async function({ options: { save, data }, connection }) {
  if (!save) {
    return
  }

  // Reuse the same file that was used during loading
  const path = getRef(data)
  const format = eGetByExt({ path })

  await format.serializeFile(path, connection)
}

const eGetByExt = addGenPbHandler(getByExt, {
  message: ({ path }) =>
    `Memory database file format is not supported: '${path}'`,
  reason: 'CONFIG_RUNTIME',
  extra: ({ path }) => ({ path: 'databases.memory.data', value: path }),
})

module.exports = {
  disconnect,
}
