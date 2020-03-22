// Make sure undefined and null compare the same
export const convertUndefined = function (token) {
  const parts = token.parts.map(convertToNull)
  return { ...token, parts }
}

const convertToNull = function (value) {
  return value === undefined ? null : value
}
