import { wrapInstruction } from './errors/instruction.js'
import { run } from './run/main.js'

const runA = wrapInstruction('run', run)

module.exports = {
  run: runA,
}
