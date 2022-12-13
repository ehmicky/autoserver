// Retrieve `currentData`, so it is passed to command middleware
export const getCurrentData = ({ actions, ids }) => {
  const currentData = actions.flatMap((action) => action.currentData)
  // Keep the same order as `newData` or `args.filter.id`
  const currentDataA = ids.map((id) => findCurrentData({ id, currentData }))
  return currentDataA
}

const findCurrentData = ({ id, currentData }) =>
  currentData.find((currentDatum) => currentDatum && currentDatum.id === id)
