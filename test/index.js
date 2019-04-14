'use strict'

const { chdir } = require('process')
const { promisify } = require('util')

const test = require('ava')
const execa = require('execa')
const fetch = require('cross-fetch')

const pSetTimeout = promisify(setTimeout)

const BINARY_PATH = `${__dirname}/../src/bin/main.js`
const EXAMPLE_DIR = `${__dirname}/../../examples`

chdir(EXAMPLE_DIR)

test('Smoke test', async t => {
  const childProcess = execa(BINARY_PATH, { env: { NODE_ENV: 'dev' } })
  await pSetTimeout(STARTUP_TIMEOUT)
  await fetch('http://localhost:5001/rest/pets/2')
  await pSetTimeout(FETCH_TIMEOUT)
  const { stdout, stderr } = await killProcess({ childProcess })
  const message = normalizeStdout({ stdout })
  t.snapshot({ message, stderr })
})

const killProcess = async function({ childProcess }) {
  childProcess.kill('SIGKILL')

  try {
    await childProcess
  } catch (error) {
    return error
  }
}

const normalizeStdout = function({ stdout }) {
  // eslint-disable-next-line fp/no-mutating-methods
  return stdout
    .split('\n')
    .map(normalizeLine)
    .sort()
    .join('\n')
}

const normalizeLine = function(line) {
  return line.replace(START_LINE_REGEXP, '').replace(PORT_REGEXP, '$1')
}

const STARTUP_TIMEOUT = 60e3
const FETCH_TIMEOUT = 10e3

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u
