// Tries to guess a value's type from its string serialized value
// @param {string} string
// @param {string|integer|float|boolean} value
export const transtype = (string) => {
  try {
    return JSON.parse(string)
  } catch {
    return string
  }
}
