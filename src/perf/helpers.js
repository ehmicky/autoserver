import keepFuncProps from 'keep-func-props'

import { identity } from '../utils/functional/identity.js'
import { promiseThen } from '../utils/functional/promise.js'
import { reduceAsync } from '../utils/functional/reduce.js'
import { result } from '../utils/functional/result.js'

import { startPerf, stopPerf } from './measure.js'

// Wraps a function, so it calculate how long the function takes.
/* eslint-disable max-params, default-param-last */
const kMonitor =
  (func, label = func.name, category, measuresIndex = 0) =>
  (...args) => {
    const labelA = result(label, ...args)
    const categoryA = result(category, ...args)
    const perf = startPerf(labelA, categoryA)
    const response = func(...args)
    const { measures } = args[measuresIndex]
    return promiseThen(response, recordPerf.bind(undefined, measures, perf))
  }
/* eslint-enable max-params, default-param-last */

export const monitor = keepFuncProps(kMonitor)

const recordPerf = (measures, perf, response) => {
  const perfA = stopPerf(perf)
  // We directly mutate the passed argument, because it greatly simplifies
  // the code
  measures.push(perfA)
  return response
}

// Combine monitor() and reduceAsync()
export const monitoredReduce = ({
  funcs,
  initialInput,
  mapInput = identity,
  mapResponse = identity,
  label,
  category,
}) => {
  const funcsA = funcs.map((func) => kMonitor(func, label, category))
  const reduceFunc = monitoredReduceFunc.bind(undefined, mapInput)
  return reduceAsync(funcsA, reduceFunc, initialInput, mapResponse)
}

const monitoredReduceFunc = (mapInput, input, func) => {
  const inputA = mapInput(input)
  return func(inputA)
}
