// Some parameters are filtered out in logs and in error responses
// because they can get too big, e.g. `args.data`, `response.data` and `payload`
// `sumParams` summarize them by their size and length, e.g. `payloadsize` and
// `payloadcount`
export const getSumParams = ({ attrName, value }) => {
  if (value === undefined) {
    return
  }

  const size = getSize({ attrName, value })
  const count = getCount({ attrName, value })
  return { ...size, ...count }
}

const getSize = ({ attrName, value }) => {
  try {
    const size = JSON.stringify(value).length
    const name = `${attrName}size`
    return { [name]: size }
    // Returns `size` `undefined` if not JSON
  } catch {}
}

const getCount = ({ attrName, value }) => {
  if (!Array.isArray(value)) {
    return
  }

  const count = value.length
  const name = `${attrName}count`
  return { [name]: count }
}
