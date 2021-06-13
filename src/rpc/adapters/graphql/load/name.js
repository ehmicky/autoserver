import underscoreString from 'underscore.string'

// Returns top-level command name, e.g. `find_collection` or `delete_collection`
export const getCommandName = function ({ clientCollname, command }) {
  return `${command}_${clientCollname}`
}

// Returns type name:
//  - 'Model' for normal return types
//  - 'CommandCollData' and 'CommandCollFilter' for `args.data|filter` types
export const getTypeName = function ({
  def: { clientCollname, command },
  opts: { inputObjectType = 'type' } = {},
}) {
  const typeName =
    inputObjectType === 'type'
      ? clientCollname
      : `${command}_${clientCollname}_${inputObjectType}`
  const typeNameA = underscoreString.camelize(
    underscoreString.capitalize(typeName),
  )
  return typeNameA
}
