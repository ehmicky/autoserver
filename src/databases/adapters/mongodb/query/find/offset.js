// Apply `args.page`
export const offsetResponse = function({ cursor, offset }) {
  if (offset === undefined) {
    return cursor
  }

  return cursor.offset(offset)
}
