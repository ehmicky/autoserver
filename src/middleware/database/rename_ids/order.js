// Modify `args.order`
export const renameOrder = ({ value, newIdName, oldIdName }) =>
  value.map((part) => renameOrderPart({ part, newIdName, oldIdName }))

const renameOrderPart = ({
  part,
  part: { attrName },
  newIdName,
  oldIdName,
}) => {
  if (attrName !== oldIdName) {
    return part
  }

  return { ...part, attrName: newIdName }
}
