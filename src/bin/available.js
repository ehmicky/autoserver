'use strict'

const { EXTENSIONS } = require('../formats/info.js')

const runInstruction = {
  name: 'run',
  aliases: '*',
  describe: 'Start the server.',
  examples: [['Start the server', '--protocols.http.port=5001']],
  args: [
    // This is actually not a positional argument, but meant only
    // for --help output
    {
      name: 'options',
      describe: `Any config property, dot-separated.
For example: --protocols.http.port=5001`,
    },
  ],
  options: {
    config: {
      type: 'string',
      describe: `Path to the config file.
By default, will use any file named autoserver.config${EXTENSIONS.join('|')}`,
    },
  },
}

const availableInstructions = [runInstruction]

module.exports = {
  availableInstructions,
}
