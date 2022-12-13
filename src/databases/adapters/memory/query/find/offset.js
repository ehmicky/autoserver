// Pagination offsetting
// If offset is too big, just return empty array
export const offsetResponse = ({ data, offset }) => {
  if (offset === undefined) {
    return data
  }

  return data.slice(offset)
}
