#!/usr/bin/env node
import { exit } from 'process'

// eslint-disable-next-line import/no-namespace
import * as instructions from '../main.js'
import { addErrorHandler } from '../errors/handler.js'

import { parseInput } from './input.js'

// Run a server instruction, from the CLI
const startCli = async function() {
  const measures = []
  const { instruction, opts } = parseInput({ measures })

  // eslint-disable-next-line import/namespace
  await instructions[instruction]({ ...opts, measures })
}

// If an error is thrown, print error's description,
// then exit with exit code 1
const cliErrorHandler = function({ message, description = message }) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(`Error: ${description}`)

  exit(1)
}

const eStartCli = addErrorHandler(startCli, cliErrorHandler)

eStartCli()
