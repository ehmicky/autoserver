'use strict'

// eslint-disable-next-line import/order
const { startRequirePerf, stopRequirePerf } = require('./require_perf')

startRequirePerf()

const { wrapInstruction } = require('./errors/instruction.js')
const { run } = require('./run/main.js')

const runA = wrapInstruction('run', run)

stopRequirePerf()

module.exports = {
  run: runA,
}
