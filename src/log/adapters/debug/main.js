const { report } = require('./report')
const { reportPerf } = require('./report_perf')

const logDebug = {
  name: 'debug',
  title: 'Debug log handler',
  description: 'Log handler printing on the console, meant for debugging',
  report,
  reportPerf,
}

module.exports = {
  logDebug,
}
