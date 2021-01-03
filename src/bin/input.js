import yargs from 'yargs'

import { monitor } from '../perf/helpers.js'

import { addInstructions } from './instructions.js'
import { processOpts } from './process.js'

// CLI input parsing
const mParseInput = function () {
  const opts = parseOpts()

  const { instruction, opts: optsA } = processOpts({ opts })
  return { instruction, opts: optsA }
}

export const parseInput = monitor(mParseInput, 'cli')

// CLI options parsing
const parseOpts = function () {
  const yargsA = addInstructions(yargs)
  return (
    yargsA
      // There should be a single instruction, or none (default one)
      .demandCommand(1, 1)
      // --help option
      .usage(USAGE)
      // Auto-suggests correction on typos
      .recommendCommands()
      .parse()
  )
}

const USAGE = `$0 [INSTRUCTION] [OPTIONS]

Engine generating an API from a simple config file.
`
