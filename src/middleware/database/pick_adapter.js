// Pick database adapter
export const pickDatabaseAdapter = function ({ dbAdapters, collname }) {
  const dbAdapter = dbAdapters[collname]
  return { dbAdapter }
}
