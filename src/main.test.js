import { setTimeout } from 'node:timers/promises'

import test from 'ava'
import { execaNode } from 'execa'
import { getBinPath } from 'get-bin-path'
import { got } from 'got'

const EXAMPLES_DIR = new URL('../../examples/', import.meta.url)

test('Smoke test', async (t) => {
  const server = execaNode(await getBinPath(), {
    env: { NODE_ENV: 'dev' },
    cwd: EXAMPLES_DIR,
    reject: false,
  })
  const [{ stdout, stderr }] = await Promise.all([server, request(server)])
  const message = normalizeStdout(stdout)
  t.snapshot({ message, stderr })
})

const request = async (server) => {
  await setTimeout(STARTUP_TIMEOUT)
  await got('http://localhost:5001/rest/pets/2')
  server.kill('SIGKILL')
}

const normalizeStdout = (stdout) =>
  // eslint-disable-next-line fp/no-mutating-methods
  stdout.split('\n').map(normalizeLine).sort().join('\n')

const normalizeLine = (line) =>
  line.replace(START_LINE_REGEXP, '').replace(PORT_REGEXP, '$1').trim()

const STARTUP_TIMEOUT = 6e4

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u
