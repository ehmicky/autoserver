// Apply `args.pagesize`
export const limitResponse = function({ cursor, limit }) {
  if (limit === undefined) {
    return cursor
  }

  return cursor.limit(limit)
}
