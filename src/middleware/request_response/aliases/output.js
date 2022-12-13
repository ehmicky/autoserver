import { applyResponseAliases } from './response.js'

// Apply `alias` in server output
export const applyOutputAliases = ({ response, modelAliases }) => {
  const responseB = Object.entries(modelAliases).reduce(
    (responseA, [attrName, aliases]) =>
      applyOutputAlias({ response: responseA, attrName, aliases }),
    response,
  )
  return { response: responseB }
}

const applyOutputAlias = ({
  response,
  response: { data },
  attrName,
  aliases,
}) => {
  const dataA = applyResponseAliases({ data, attrName, aliases })
  return { ...response, data: dataA }
}
