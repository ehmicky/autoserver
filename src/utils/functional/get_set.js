// Similar to Lodash get(), but do not mutate, and faster
export const get = (obj, keys) => {
  if (keys.length === 0) {
    return obj
  }

  const [childKey, ...keysA] = keys
  const child = obj[childKey]
  return get(child, keysA)
}

// Same but do not use `result()`
export const set = (objArr, keys, val) => {
  if (keys.length === 0) {
    return val
  }

  if (typeof keys[0] === 'number') {
    return setArray(objArr, keys, val)
  }

  return setObject(objArr, keys, val)
}

// eslint-disable-next-line default-param-last
const setObject = (obj = {}, keys, val) => {
  const { child, childKey } = setVal({ objArr: obj, keys, val })

  return { ...obj, [childKey]: child }
}

// eslint-disable-next-line default-param-last
const setArray = (arr = [], keys, val) => {
  const { child, childKey } = setVal({ objArr: arr, keys, val })

  const arrA = fillLength(arr, childKey)

  return [...arrA.slice(0, childKey), child, ...arrA.slice(childKey + 1)]
}

// When setting with indice larger than the array, we need to first fill in
// the array with extra `undefined` values
const fillLength = (arr, childKey) => {
  if (arr.length >= childKey) {
    return arr
  }

  const extraArr = Array.from({ length: childKey - arr.length })
  return [...arr, ...extraArr]
}

const setVal = ({ objArr, keys, val }) => {
  const [childKey, ...keysA] = keys
  const child = objArr[childKey]
  const childA = set(child, keysA, val)

  return { child: childA, childKey }
}

// Similar to Lodash has(), but faster
export const has = (obj, keys) => {
  try {
    return get(obj, keys) !== undefined
  } catch {
    return false
  }
}
