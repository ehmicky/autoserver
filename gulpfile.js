'use strict'

const gulpSharedTasks = require('@ehmicky/dev-tasks')

gulpSharedTasks.buildRegister()

const { runProd, runDev, runDebug } = require('./gulp/run.js')

module.exports = {
  ...gulpSharedTasks,
  runProd,
  runDev,
  runDebug,
}
