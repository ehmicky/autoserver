// Normalize results to an object with `path`, `model`, `collname`, `select`
// Then push to shared `results` variable
export const processResults = function ({
  results,
  finishedResults,
  pendingResults,
  ...rest
}) {
  const finishedResultsA = finishedResults.flat()

  const finishedResultsB = getResults({ ...rest, results: finishedResultsA })

  // Replace `pendingResults` promises by their resolved values
  if (pendingResults.length !== 0) {
    const index = results.findIndex((result) => pendingResults.includes(result))
    // eslint-disable-next-line fp/no-mutating-methods
    results.splice(index, pendingResults.length)
  }

  // eslint-disable-next-line fp/no-mutating-methods
  results.push(...finishedResultsB)
}

const getResults = function ({
  isTopLevel,
  parentResults,
  nestedParentIds,
  results,
  ...rest
}) {
  if (isTopLevel) {
    return results.map(({ model, metadata }, index) =>
      getResult({ model, metadata, index, ...rest }),
    )
  }

  // Nested results reuse `nestedParentIds` to assign proper `path` index.
  // Also it reuses its order, so sorting is kept
  const finishedResults = nestedParentIds.flatMap((ids, index) => {
    const { path } = parentResults[index]
    return getEachResults({ ids, path, results, ...rest })
  })
  return finishedResults
}

const getEachResults = function ({ ids, results, ...rest }) {
  const multiple = Array.isArray(ids)
  return results
    .filter(({ model }) => filterResult({ model, ids, multiple }))
    .map(({ model, metadata }, index) =>
      getResult({ model, metadata, index, multiple, ...rest }),
    )
}

const filterResult = function ({ model: { id }, ids, multiple }) {
  return multiple ? ids.includes(id) : ids === id
}

const getResult = function ({
  action,
  model,
  metadata,
  index,
  path = [],
  commandName,
  multiple,
  top: { command },
  collname,
}) {
  const multipleA = multiple === undefined ? command.multiple : multiple

  const pathA = commandName === undefined ? path : [...path, commandName]
  const pathB = multipleA ? [...pathA, index] : pathA
  return { path: pathB, action, model, metadata, collname }
}
