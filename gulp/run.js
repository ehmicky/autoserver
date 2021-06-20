import { fileURLToPath } from 'url'
import { promisify } from 'util'

import { getBinPath } from 'get-bin-path'
import { exec } from 'gulp-execa'
import Nodemon from 'nodemon'

const EXAMPLE_PATH = fileURLToPath(
  new URL('../examples/main.js', import.meta.url),
)
const SRC_PATH = fileURLToPath(new URL('../build/src', import.meta.url))
const BINARY_PATH = getBinPath()

// We use this instead of requiring the application to test the CLI
export const runProd = async () => {
  const binaryPath = await BINARY_PATH
  await exec(`node ${binaryPath}`, { cwd: 'examples' })
}

runProd.description = 'Run an example production server'

export const runDev = () => startNodemon(NODEMON_CONFIG)

runDev.description = 'Start an example dev server'

export const runDebug = () => startNodemon(DEBUG_NODEMON_CONFIG)

runDebug.description = 'Start an example dev server in debug mode'

const startNodemon = async function (config) {
  const nodemon = new Nodemon(config)

  // Otherwise Nodemon's log does not appear
  nodemon.on('log', ({ colour }) => console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

const NODEMON_CONFIG = {
  script: EXAMPLE_PATH,
  nodeArgs: ['--inspect', '--stack-trace-limit=20'],
  env: { NODE_ENV: 'dev' },
  watch: SRC_PATH,
  delay: 100,
}

const DEBUG_NODEMON_CONFIG = {
  ...NODEMON_CONFIG,
  nodeArgs: ['--inspect-brk', '--stack-trace-limit=20'],
}
