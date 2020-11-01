import sortOn from 'sort-on'

// Like array.sort() but does not mutate argument
export const sortArray = function (array, func) {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(func)
}

export const sortByAttributes = function (array, order) {
  return sortOn(array, order.map(getSortAttribute))
}

const getSortAttribute = function ({ attrName, dir }) {
  if (dir === 'desc') {
    return `-${attrName}`
  }

  return attrName
}

// Compare two arrays, element by element
export const compareArrays = function (arrA, arrB, index = 0) {
  const result = compareLengths(arrA, arrB, index)

  if (result !== undefined) {
    return result
  }

  if (arrA[index] > arrB[index]) {
    return 1
  }

  if (arrA[index] < arrB[index]) {
    return -1
  }

  return compareArrays(arrA, arrB, index + 1)
}

const compareLengths = function (arrA, arrB, index) {
  const isEmptyA = arrA.length < index
  const isEmptyB = arrB.length < index

  if (isEmptyA) {
    return isEmptyB ? 0 : -1
  }

  if (isEmptyB) {
    return 1
  }
}
