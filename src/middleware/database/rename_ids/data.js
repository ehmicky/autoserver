import omit from 'omit.js'

// Modify `args.newData`, or database output
export const renameData = ({ value, newIdName, oldIdName }) =>
  value.map((datum) => renameDatum({ datum, newIdName, oldIdName }))

const renameDatum = ({ datum, newIdName, oldIdName }) => {
  const hasId = Object.keys(datum).includes(oldIdName)

  if (!hasId) {
    return datum
  }

  const { [oldIdName]: attr } = datum
  const datumA = omit.default(datum, [oldIdName])
  return { ...datumA, [newIdName]: attr }
}
