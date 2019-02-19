'use strict'

const { chdir } = require('process')
const { promisify } = require('util')

const test = require('ava')
const execa = require('execa')

const pSetTimeout = promisify(setTimeout)

const BINARY_PATH = `${__dirname}/../bin/autoserver.js`
const EXAMPLE_DIR = `${__dirname}/../examples`

chdir(EXAMPLE_DIR)

test('Smoke test', async t => {
  const childProcess = execa(BINARY_PATH, { env: { NODE_ENV: 'dev' } })
  await pSetTimeout(TEST_TIMEOUT)
  childProcess.kill('SIGINT')
  const { code, stdout, stderr } = await childProcess
  const message = normalizeStdout({ stdout })
  t.snapshot({ code, message, stderr })
  t.pass()
})

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

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u

const TEST_TIMEOUT = 3e4
