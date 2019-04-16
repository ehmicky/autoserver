'use strict'

const { wrapInstruction } = require('./errors/instruction.js')
const { run } = require('./run/main.js')

const runA = wrapInstruction('run', run)

module.exports = {
  run: runA,
}
