// Pick database adapter
export const pickDatabaseAdapter = ({ dbAdapters, collname }) => {
  const dbAdapter = dbAdapters[collname]
  return { dbAdapter }
}
