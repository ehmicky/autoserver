import { availableInstructions } from './available.js'

// Iterate over `availableOptions` to add all instructions
export const addInstructions = function ({ yargs }) {
  return availableInstructions.reduce(
    (yargsA, instruction) => addInstruction({ yargs: yargsA, instruction }),
    yargs,
  )
}

const addInstruction = function ({ yargs, instruction }) {
  const cliInstruction = getCliInstruction({ instruction })
  return yargs.command(cliInstruction)
}

const getCliInstruction = function ({
  instruction,
  instruction: { name, aliases, describe: desc },
}) {
  return {
    command: name,
    aliases,
    describe: desc,
    builder: (yargs) => getBuilder({ instruction, yargs }),
  }
}

// Iterate over instruction options
const getBuilder = function ({
  instruction,
  instruction: { examples, describe: desc, options = {} },
  yargs,
}) {
  const yargsA = yargs
    // Instruction --help header
    .usage(desc)
    // Non-positional arguments
    .option(options)
    // Add examples in instruction-level --help
    .example(examples)
    // Positional arguments
    .positional('instruction', INSTRUCTION_OPT)
  const yargsB = addPositionalArgs({ instruction, yargs: yargsA })
  return yargsB
}

const INSTRUCTION_OPT = {
  type: 'string',
  default: 'run',
}

const addPositionalArgs = function ({ instruction: { args = [] }, yargs }) {
  return args.reduce(
    (yargsA, { name, ...arg }) => yargsA.positional(name, arg),
    yargs,
  )
}
