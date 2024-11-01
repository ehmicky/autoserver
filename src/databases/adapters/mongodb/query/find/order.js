// Apply `args.order`
export const sortResponse = ({ cursor, order }) => {
  if (order === undefined) {
    return cursor
  }

  const orderA = order.map(({ attrName, dir }) => ({
    [attrName]: dir === 'asc' ? 1 : -1,
  }))
  const orderB = Object.assign({}, ...orderA)
  // eslint-disable-next-line fp/no-mutating-methods
  return cursor.sort(orderB)
}
