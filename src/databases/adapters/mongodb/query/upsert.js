// Modify models
export const upsert = ({ collection, newData }) => {
  const func = newData.length === 1 ? upsertOne : upsertMany
  return func({ collection, newData })
}

const upsertOne = ({ collection, newData: [data] }) => {
  const { _id: id } = data
  return collection.replaceOne({ _id: id }, data, { upsert: true })
}

const upsertMany = async ({ collection, newData }) => {
  const bulkCommands = newData.map((replacement) =>
    getBulkCommand({ replacement }),
  )
  const result = await collection.bulkWrite(bulkCommands)
  return { result }
}

const getBulkCommand = ({ replacement }) => {
  const { _id: id } = replacement
  return { replaceOne: { filter: { _id: id }, replacement, upsert: true } }
}
