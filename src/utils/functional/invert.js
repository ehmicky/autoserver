// Similar to Lodash _.invert(), but with plain JavaScript
export const invert = (obj) => {
  const objs = Object.entries(obj).map(([key, value]) => ({ [value]: key }))
  const objA = Object.assign({}, ...objs)
  return objA
}
