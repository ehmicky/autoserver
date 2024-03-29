// Apply `alias` in responses
export const applyResponseAliases = ({ data, attrName, aliases }) =>
  data.map((datum) => applyResponseAlias({ data: datum, attrName, aliases }))

// Copy main attribute's value to each alias, providing main attribute is
// defined
const applyResponseAlias = ({ data, attrName, aliases }) => {
  const shouldSetAliases = Object.keys(data).includes(attrName)

  if (!shouldSetAliases) {
    return data
  }

  const aliasesObj = aliases.map((alias) => ({ [alias]: data[attrName] }))

  return Object.assign({}, data, ...aliasesObj)
}
