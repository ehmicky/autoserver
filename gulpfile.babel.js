// eslint-disable-next-line filenames/match-regex
'use strict'

const promisify = require('util.promisify')
const Nodemon = require('nodemon')
const gulpTasks = require('gulp-shared-tasks')
// eslint-disable-next-line import/no-internal-modules
const gulpExeca = require('gulp-shared-tasks/dist/exec')

const nodemonDevConfig = require('./nodemon')
const nodemonDebugConfig = require('./nodemon.debug')

// We use this instead of requiring the application to test the CLI
const start = () => gulpExeca('../bin/autoserver.js', { cwd: 'examples' })

// eslint-disable-next-line fp/no-mutation
start.description = 'Start an example production server'

const dev = () => startNodemon(nodemonDevConfig)

// eslint-disable-next-line fp/no-mutation
dev.description = 'Start an example dev server'

const debug = () => startNodemon(nodemonDebugConfig)

// eslint-disable-next-line fp/no-mutation
debug.description = 'Start an example dev server in debug mode'

const startNodemon = async function(config) {
  const nodemon = new Nodemon(config)

  // Otherwise Nodemon's log does not appear
  // eslint-disable-next-line no-restricted-globals
  nodemon.on('log', ({ colour }) => global.console.log(colour))

  await promisify(nodemon.on.bind(nodemon))('start')
}

module.exports = {
  ...gulpTasks,
  start,
  dev,
  debug,
}
