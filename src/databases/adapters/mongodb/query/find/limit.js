// Apply `args.pagesize`
export const limitResponse = ({ cursor, limit }) => {
  if (limit === undefined) {
    return cursor
  }

  return cursor.limit(limit)
}
