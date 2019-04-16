import { wrapInstruction } from './errors/instruction.js'
import { run as runInstruction } from './run/main.js'

export const run = wrapInstruction('run', runInstruction)
