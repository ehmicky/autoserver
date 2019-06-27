import { promisify } from 'util'

import test from 'ava'
import execa from 'execa'
import fetch from 'cross-fetch'

const pSetTimeout = promisify(setTimeout)

const BINARY_PATH = `${__dirname}/../src/bin/main.js`
const EXAMPLE_DIR = `${__dirname}/../../examples`

test('Smoke test', async t => {
  const childProcess = execa(BINARY_PATH, {
    env: { NODE_ENV: 'dev' },
    cwd: EXAMPLE_DIR,
  })
  const [{ stdout, stderr }] = await Promise.all([
    childProcess,
    request(childProcess),
  ])
  const message = normalizeStdout({ stdout })
  t.snapshot({ message, stderr })
})

const request = async function(childProcess) {
  await pSetTimeout(STARTUP_TIMEOUT)
  await fetch('http://localhost:5001/rest/pets/2')
  childProcess.kill()
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
  return line
    .replace(START_LINE_REGEXP, '')
    .replace(PORT_REGEXP, '$1')
    .trim()
}

const STARTUP_TIMEOUT = 60e3

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u
