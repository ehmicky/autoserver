// Apply `args.page`
export const offsetResponse = ({ cursor, offset }) => {
  if (offset === undefined) {
    return cursor
  }

  return cursor.offset(offset)
}
