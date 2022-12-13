import { set } from '../../utils/functional/get_set.js'

// Merge all `results` into a single nested response, using `result.path`
export const assembleResults = ({ results, top: { command } }) => {
  const response = command.multiple ? [] : {}
  const responseA = results.reduce(assembleResult, response)
  return { response: responseA }
}

const assembleResult = (response, { model, path }) => set(response, path, model)
