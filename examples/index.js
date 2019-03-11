'use strict'

const { inspect } = require('util')
const {
  stdout: { columns },
} = require('process')

// We need to use this syntax to avoid linting issues: different ESLint
// rules are reported whether `build` is present or not.
const pkgDir = '.'
// eslint-disable-next-line import/no-dynamic-require
const autoserver = require(pkgDir)

const CONFIG = `${__dirname}/autoserver.config.yml`

// Set default console log printing
const setDefaultDebug = function() {
  // eslint-disable-next-line fp/no-mutation
  inspect.defaultOptions = {
    colors: true,
    depth: null,
    breakLength: columns || COLUMNS_WIDTH,
  }
}

const COLUMNS_WIDTH = 80

const startServer = async function() {
  try {
    const { protocols, exit } = await autoserver.run({ config: CONFIG })
    return { protocols, exit }
  } catch (error) {
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log('Startup error')
  }
}

setDefaultDebug()

startServer()
