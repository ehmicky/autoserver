// Upsert models
export const upsert = ({ collection, newData }) => {
  newData.forEach((datum) => {
    upsertOne({ collection, datum })
  })
}

const upsertOne = ({ collection, datum }) => {
  const index = collection.findIndex(({ id }) => id === datum.id)

  if (index === -1) {
    collection.push(datum)
    return
  }

  collection.splice(index, 1, datum)
}
