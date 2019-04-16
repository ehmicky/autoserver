// Delete models
export const deleteMany = function({ collection, deletedIds }) {
  Object.entries(collection)
    .filter(([, model]) => deletedIds.includes(model.id))
    // eslint-disable-next-line fp/no-mutating-methods
    .map(([index], count) => collection.splice(index - count, 1)[0])
}
