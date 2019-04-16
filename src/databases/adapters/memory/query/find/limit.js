// Pagination limiting
export const limitResponse = function({ data, limit }) {
  if (limit === undefined) {
    return data
  }

  return data.slice(0, limit)
}
