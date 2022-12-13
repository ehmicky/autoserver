import { get, set } from '../../../utils/functional/get_set.js'

// Rename fields if the output key is different from the database one,
// using `arg.rename`, including with GraphQL aliases.
export const applyRename = ({ response, results }) => {
  // Need to recurse through children first
  const responseA = results.reduceRight(renameFieldsByResult, response)
  return { response: responseA }
}

const renameFieldsByResult = (
  response,
  {
    path,
    action: {
      args: { rename },
    },
  },
) => {
  if (rename === undefined) {
    return response
  }

  const model = get(response, path)
  const modelA = renameAttrs({ model, rename })

  const responseA = set(response, path, modelA)
  return responseA
}

const renameAttrs = ({ model, rename }) => {
  const renameMap = rename.reduce(reduceRenameMap, {})

  // Using  `Object.entries.map()` ensures attribute order is kept
  const modelA = Object.entries(model).map(([name, value]) =>
    renameAttr({ renameMap, name, value }),
  )
  const modelB = Object.assign({}, ...modelA)
  return modelB
}

const reduceRenameMap = (renameMap, { key, outputName }) => {
  const outputNames = renameMap[key] || []
  const outputNamesA = [...outputNames, outputName]
  return { ...renameMap, [key]: outputNamesA }
}

const renameAttr = ({ renameMap, name, value }) => {
  const outputNames = renameMap[name]

  if (outputNames === undefined) {
    return { [name]: value }
  }

  const modelA = outputNames.map((outputName) => ({ [outputName]: value }))
  const modelB = Object.assign({}, ...modelA)
  return modelB
}
