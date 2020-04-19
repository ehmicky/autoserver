// Is any kind of object, including array, RegExp, Date, Error, etc.
export const isObjectType = function (val) {
  return typeof val === 'object' && val !== null
}

// Is a plain object, including `Object.create(null)`
export const isObject = function (val) {
  return (
    val !== undefined &&
    val !== null &&
    (val.constructor === Object || val.constructor === undefined)
  )
}
