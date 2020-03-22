// Similar to Lodash keyBy() but faster
export const keyBy = function (array, attr = 'name') {
  const objs = array.map((obj) => ({ [obj[attr]]: obj }))
  const objA = Object.assign({}, ...objs)
  return objA
}
