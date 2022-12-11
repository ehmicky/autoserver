import { stdout } from 'node:process'
import { fileURLToPath } from 'node:url'
import { inspect } from 'node:util'

import { run } from 'autoserver'

const CONFIG = fileURLToPath(new URL('autoserver.config.yml', import.meta.url))

// Set default console log printing
const setDefaultDebug = function () {
  // eslint-disable-next-line fp/no-mutation
  inspect.defaultOptions = {
    colors: true,
    // eslint-disable-next-line unicorn/no-null
    depth: null,
    breakLength: stdout.columns || COLUMNS_WIDTH,
  }
}

const COLUMNS_WIDTH = 80

const startServer = async function () {
  try {
    const { protocols, exit } = await run({ config: CONFIG })
    return { protocols, exit }
  } catch {
    console.log('Startup error')
  }
}

setDefaultDebug()

await startServer()
