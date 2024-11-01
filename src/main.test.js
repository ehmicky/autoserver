import { setTimeout } from 'node:timers/promises'

import test from 'ava'
import { getBinPath } from 'get-bin-path'
import { got } from 'got'
import spawn from 'nano-spawn'

const EXAMPLES_DIR = new URL('../../examples/', import.meta.url)

test('Smoke test', async (t) => {
  const subprocess = spawn('node', [await getBinPath()], {
    env: { NODE_ENV: 'dev' },
    cwd: EXAMPLES_DIR,
  })
  const nodeChildProcess = await subprocess.nodeChildProcess
  await setTimeout(STARTUP_TIMEOUT)
  await got('http://localhost:5001/rest/pets/2')
  nodeChildProcess.kill('SIGKILL')
  const { stdout, stderr } = await t.throwsAsync(subprocess)
  const message = normalizeStdout(stdout)
  t.snapshot({ message, stderr })
})

const STARTUP_TIMEOUT = 6e4

const normalizeStdout = (stdout) =>
  // eslint-disable-next-line fp/no-mutating-methods
  stdout.split('\n').map(normalizeLine).sort().join('\n')

const normalizeLine = (line) =>
  line.replace(START_LINE_REGEXP, '').replace(PORT_REGEXP, '$1').trim()

const START_LINE_REGEXP = /^.{98}/u
const PORT_REGEXP = /(Listening on).*/u
