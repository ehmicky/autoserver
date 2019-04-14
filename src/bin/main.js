#!/usr/bin/env node
'use strict'

const { exit } = require('process')

const instructions = require('../main.js')
const { addErrorHandler } = require('../errors/handler.js')

const { parseInput } = require('./input')

// Run a server instruction, from the CLI
const startCli = async function() {
  const measures = []
  const { instruction, opts } = parseInput({ measures })

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
