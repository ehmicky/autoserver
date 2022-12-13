// Upsert models
export const upsert = ({ collection, newData }) => {
  newData.forEach((datum) => {
    upsertOne({ collection, datum })
  })
}

const upsertOne = ({ collection, datum }) => {
  const index = collection.findIndex(({ id }) => id === datum.id)

  if (index === -1) {
    // eslint-disable-next-line fp/no-mutating-methods
    collection.push(datum)
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  collection.splice(index, 1, datum)
}
