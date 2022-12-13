import { get, set } from '../../../utils/functional/get_set.js'

// Applies `args.select`.
// Only output the fields that were picked by the client.
export const applySelect = ({ response, results }) => {
  // Need to recurse through children first
  const responseA = results.reduceRight(selectFieldsByResult, response)
  return { response: responseA }
}

const selectFieldsByResult = (
  response,
  {
    path,
    action: {
      args: { select },
    },
  },
) => {
  const model = get(response, path)

  const modelA = selectFieldsByModel({ model, select })

  const responseA = set(response, path, modelA)
  return responseA
}

const selectFieldsByModel = ({ model, select }) => {
  if (select === undefined) {
    return model
  }

  // Using 'all' means all fields are returned
  const hasAllAttr = select.includes('all')

  if (hasAllAttr) {
    return model
  }

  const modelA = select.map((key) => pickAttr({ model, key }))
  const modelB = Object.assign({}, ...modelA)

  return modelB
}

const pickAttr = ({ model, key }) => {
  // When explicitely selected, transform `undefined` to `null`
  // eslint-disable-next-line unicorn/no-null
  const value = model[key] === undefined ? null : model[key]
  return { [key]: value }
}
