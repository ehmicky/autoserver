// Is any kind of object, including array, RegExp, Date, Error, etc.
export const isObjectType = (val) => typeof val === 'object' && val !== null

// Is a plain object, including `Object.create(null)`
export const isObject = (val) =>
  val !== undefined &&
  val !== null &&
  (val.constructor === Object || val.constructor === undefined)
