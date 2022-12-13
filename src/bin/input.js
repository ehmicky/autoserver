import { argv } from 'node:process'

import yargs from 'yargs'
// eslint-disable-next-line n/file-extension-in-import
import { hideBin } from 'yargs/helpers'

import { monitor } from '../perf/helpers.js'

import { addInstructions } from './instructions.js'
import { processOpts } from './process.js'

// CLI input parsing
const mParseInput = () => {
  const opts = parseOpts()

  const { instruction, opts: optsA } = processOpts({ opts })
  return { instruction, opts: optsA }
}

export const parseInput = monitor(mParseInput, 'cli')

// CLI options parsing
const parseOpts = () => {
  const yargsA = addInstructions(yargs(hideBin(argv)))
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
