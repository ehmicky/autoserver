// Remove models that are null|undefined
// Those can happen with some database. E.g. MongoDB sometimes release read
// locks in the middle of a query, which can result in the same model appearing
// twice in the response.
export const removeEmptyModels = ({ response: { data, ...rest } }) => {
  const dataA = data.filter((datum) => datum !== undefined && datum !== null)
  return { response: { data: dataA, ...rest } }
}
