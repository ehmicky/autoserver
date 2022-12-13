import { availableInstructions } from './available.js'

// Iterate over `availableOptions` to add all instructions
export const addInstructions = (yargs) =>
  yargs.command(availableInstructions.map(getInstruction))

const getInstruction = ({
  command,
  aliases,
  describe,
  arg: { name: argName, ...argOpts },
  examples,
  options,
}) => ({
  command,
  aliases,
  describe,
  builder: (commandYargs) =>
    commandYargs
      .usage(describe)
      .option(options)
      .example(examples)
      .positional('instruction', INSTRUCTION_OPT)
      .positional(argName, argOpts),
})

const INSTRUCTION_OPT = { type: 'string', default: 'run' }
