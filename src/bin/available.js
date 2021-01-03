import { EXTENSIONS } from '../formats/info.js'

const runInstruction = {
  command: 'run',
  aliases: '*',
  describe: 'Start the server.',
  examples: [['$0 run --protocols.http.port=5001', 'Start the server']],
  // This is actually not a positional argument, but meant only
  // for --help output
  arg: {
    name: 'options',
    describe: `Any config property, dot-separated.
For example: --protocols.http.port=5001`,
  },
  options: {
    config: {
      type: 'string',
      describe: `Path to the config file.
By default, will use any file named autoserver.config${EXTENSIONS.join('|')}`,
    },
  },
}

export const availableInstructions = [runInstruction]
