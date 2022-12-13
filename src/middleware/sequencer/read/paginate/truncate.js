// Truncate nested attributes to fit `nestedPagesize`
// Append a `null` after truncating
export const truncateAttrs = ({ results, nestedAttrs, nestedPagesize }) =>
  nestedAttrs.reduce(
    (resultsA, { attrName }) =>
      truncateAttr({ results: resultsA, attrName, nestedPagesize }),
    results,
  )

const truncateAttr = ({ results, attrName, nestedPagesize }) =>
  results.map((result) => truncateModel({ result, attrName, nestedPagesize }))

const truncateModel = ({
  result,
  result: { model, metadata },
  attrName,
  nestedPagesize,
}) => {
  const { [attrName]: attrVal } = model
  const noPagination =
    !Array.isArray(attrVal) || attrVal.length <= nestedPagesize

  if (noPagination) {
    return result
  }

  const attrValA = attrVal.slice(0, nestedPagesize)
  const modelA = { ...model, [attrName]: attrValA }

  const metadataA = {
    ...metadata,
    pages: { ...metadata.pages, nested_pagesize: nestedPagesize },
  }
  const resultA = { ...result, model: modelA, metadata: metadataA }
  return resultA
}
