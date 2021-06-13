#!/usr/bin/env node
import { dirname } from 'path'
import { exit } from 'process'
import { fileURLToPath } from 'url'

import { readPackageUpAsync } from 'read-pkg-up'
import UpdateNotifier from 'update-notifier'

import { addErrorHandler } from '../errors/handler.js'
import * as instructions from '../main.js'

import { parseInput } from './input.js'

// Run a server instruction, from the CLI
const startCli = async function () {
  await checkUpdate()

  const measures = []
  const { instruction, opts } = parseInput({ measures })

  await instructions[instruction]({ ...opts, measures })
}

// TODO: use static JSON imports once those are possible
const checkUpdate = async function () {
  const cwd = dirname(fileURLToPath(import.meta.url))
  const { packageJson } = await readPackageUpAsync({ cwd, normalize: false })
  UpdateNotifier({ pkg: packageJson }).notify()
}

// If an error is thrown, print error's description,
// then exit with exit code 1
const cliErrorHandler = function ({ message, description = message }) {
  console.error(`Error: ${description}`)

  exit(1)
}

const eStartCli = addErrorHandler(startCli, cliErrorHandler)

eStartCli()
