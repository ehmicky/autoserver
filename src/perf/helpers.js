const keepFuncProps = require('keep-func-props')

const { identity } = require('../utils/functional/identity.js')
const { promiseThen } = require('../utils/functional/promise.js')
const { reduceAsync } = require('../utils/functional/reduce.js')
const { result } = require('../utils/functional/result.js')

const { startPerf, stopPerf } = require('./measure')

// Wraps a function, so it calculate how long the function takes.
// eslint-disable-next-line max-params
const kMonitor = function(
  func,
  label = func.name,
  category,
  measuresIndex = 0,
) {
  return function monitoredFunc(...args) {
    const labelA = result(label, ...args)
    const categoryA = result(category, ...args)
    const perf = startPerf(labelA, categoryA)
    const response = func(...args)
    const { measures } = args[measuresIndex]
    return promiseThen(response, recordPerf.bind(null, measures, perf))
  }
}

const monitor = keepFuncProps(kMonitor)

const recordPerf = function(measures, perf, response) {
  const perfA = stopPerf(perf)
  // We directly mutate the passed argument, because it greatly simplifies
  // the code
  // eslint-disable-next-line fp/no-mutating-methods
  measures.push(perfA)
  return response
}

// Combine monitor() and reduceAsync()
const monitoredReduce = function({
  funcs,
  initialInput,
  mapInput = identity,
  mapResponse = identity,
  label,
  category,
}) {
  const funcsA = funcs.map(func => kMonitor(func, label, category))
  const reduceFunc = monitoredReduceFunc.bind(null, mapInput)
  return reduceAsync(funcsA, reduceFunc, initialInput, mapResponse)
}

const monitoredReduceFunc = function(mapInput, input, func) {
  const inputA = mapInput(input)
  return func(inputA)
}

module.exports = {
  monitor,
  monitoredReduce,
}
