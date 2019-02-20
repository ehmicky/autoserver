'use strict'

const { promisify } = require('util')

const Nodemon = require('nodemon')
// eslint-disable-next-line import/no-internal-modules
const gulpExeca = require('gulp-shared-tasks/dist/exec')

const nodemonDevConfig = require('../nodemon')
const nodemonDebugConfig = require('../nodemon.debug')

// We use this instead of requiring the application to test the CLI
const runProd = () =>
  gulpExeca('node ../bin/autoserver.js', { cwd: 'examples' })

// eslint-disable-next-line fp/no-mutation
runProd.description = 'Run an example production server'

const runDev = () => startNodemon(nodemonDevConfig)

// eslint-disable-next-line fp/no-mutation
runDev.description = 'Start an example dev server'

const runDebug = () => startNodemon(nodemonDebugConfig)

// eslint-disable-next-line fp/no-mutation
runDebug.description = 'Start an example dev server in debug mode'

const startNodemon = async function(config) {
  const nodemon = new Nodemon(config)

  // Otherwise Nodemon's log does not appear
  // eslint-disable-next-line no-restricted-globals
  nodemon.on('log', ({ colour }) => global.console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

module.exports = {
  runProd,
  runDev,
  runDebug,
}
