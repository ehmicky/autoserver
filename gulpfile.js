'use strict'

const gulpSharedTasks = require('gulp-shared-tasks')

const { runProd, runDev, runDebug } = require('./gulp/run.js')

module.exports = {
  ...gulpSharedTasks,
  runProd,
  runDev,
  runDebug,
}
