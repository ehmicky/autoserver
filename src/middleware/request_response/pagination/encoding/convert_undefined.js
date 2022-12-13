// Make sure undefined and null compare the same
export const convertUndefined = (token) => {
  const parts = token.parts.map(convertToNull)
  return { ...token, parts }
}

// eslint-disable-next-line unicorn/no-null
const convertToNull = (value) => (value === undefined ? null : value)
