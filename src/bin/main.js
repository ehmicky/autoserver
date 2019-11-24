#!/usr/bin/env node
import { exit, env } from 'process'

import UpdateNotifier from 'update-notifier'
import readPkgUp from 'read-pkg-up'

import * as instructions from '../main.js'
import { addErrorHandler } from '../errors/handler.js'

import { parseInput } from './input.js'

// Run a server instruction, from the CLI
const startCli = async function() {
  await checkUpdate()

  const measures = []
  const { instruction, opts } = parseInput({ measures })

  await instructions[instruction]({ ...opts, measures })
}

const checkUpdate = async function() {
  const { packageJson } = await readPkgUp({ cwd: __dirname, normalize: false })
  const disabled = env.NODE_ENV === 'test'
  UpdateNotifier({ pkg: packageJson, disabled }).notify()
}

// If an error is thrown, print error's description,
// then exit with exit code 1
const cliErrorHandler = function({ message, description = message }) {
  console.error(`Error: ${description}`)

  exit(1)
}

const eStartCli = addErrorHandler(startCli, cliErrorHandler)

eStartCli()
