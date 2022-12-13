// Delete models
export const deleteFunc = ({ collection, deletedIds }) => {
  const func = deletedIds.length === 1 ? deleteOne : deleteMany
  return func({ collection, deletedIds })
}

const deleteOne = ({ collection, deletedIds }) => {
  const [_id] = deletedIds
  return collection.deleteOne({ _id })
}

const deleteMany = ({ collection, deletedIds }) => {
  const filter = { _id: { $in: deletedIds } }
  return collection.deleteMany(filter)
}
