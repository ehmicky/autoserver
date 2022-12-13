import { promiseThen } from './promise.js'

// Like Array.reduce(), but supports async
// eslint-disable-next-line max-params
export const reduceAsync = (array, mapFunc, prevVal, secondMapFunc) =>
  asyncReducer(prevVal, { array, mapFunc, secondMapFunc })

const asyncReducer = (prevVal, input) => {
  const { array, mapFunc, index = 0 } = input

  if (index === array.length) {
    return prevVal
  }

  const nextVal = mapFunc(prevVal, array[index], index, array)
  const inputA = { ...input, index: index + 1 }

  return promiseThen(nextVal, applySecondMap.bind(undefined, prevVal, inputA))
}

const applySecondMap = (prevVal, input, nextVal) => {
  if (!input.secondMapFunc) {
    return asyncReducer(nextVal, input)
  }

  const nextValA = input.secondMapFunc(prevVal, nextVal)
  return asyncReducer(nextValA, input)
}
