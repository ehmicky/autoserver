import { fileURLToPath } from 'url'
import { promisify } from 'util'

import test from 'ava'
import execa from 'execa'
import { getBinPath } from 'get-bin-path'
import got from 'got'

// TODO: replace with `timers/promises` `setTimeout()` after dropping support
// for Node <15.0.0
const pSetTimeout = promisify(setTimeout)

const EXAMPLE_DIR = fileURLToPath(new URL('../../examples', import.meta.url))

test('Smoke test', async (t) => {
  const binPath = await getBinPath()
  const server = execa('node', [binPath], {
    env: { NODE_ENV: 'dev' },
    cwd: EXAMPLE_DIR,
    reject: false,
  })
  const [{ stdout, stderr }] = await Promise.all([server, request(server)])
  const message = normalizeStdout(stdout)
  t.snapshot({ message, stderr })
})

const request = async function (server) {
  await pSetTimeout(STARTUP_TIMEOUT)
  await got('http://localhost:5001/rest/pets/2')
  server.kill('SIGKILL')
}

const normalizeStdout = function (stdout) {
  // eslint-disable-next-line fp/no-mutating-methods
  return stdout.split('\n').map(normalizeLine).sort().join('\n')
}

const normalizeLine = function (line) {
  return line.replace(START_LINE_REGEXP, '').replace(PORT_REGEXP, '$1').trim()
}

const STARTUP_TIMEOUT = 6e4

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u
