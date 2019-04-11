'use strict'

// Sort by category (asc) then by duration (desc)
const sortMeasures = function(
  { category: catA, average: timeA },
  { category: catB, average: timeB },
) {
  const compNum = sortByCategory({ catA, catB })

  if (compNum !== 0) {
    return compNum
  }

  return sortByTime({ timeA, timeB })
}

const sortByCategory = function({ catA, catB }) {
  const indexCatA = CATEGORIES.indexOf(catA)
  const indexCatB = CATEGORIES.indexOf(catB)

  if (indexCatA < indexCatB) {
    return -1
  }

  if (indexCatA > indexCatB) {
    return 1
  }

  return 0
}

// Order matters, as console printing uses it for sorting
const CATEGORIES = [
  'cli',
  'default',
  'main',
  'config',
  'run_opts',
  'databases',
  'protocols',
  'middleware',
  'time',
  'protocol',
  'protoparse',
  'rpc',
  'action',
  'read',
  'write',
  'request',
  'database',
  'response',
  'final',
]

const sortByTime = function({ timeA, timeB }) {
  if (timeA < timeB) {
    return 1
  }

  if (timeA > timeB) {
    return -1
  }

  return 0
}

module.exports = {
  sortMeasures,
}
