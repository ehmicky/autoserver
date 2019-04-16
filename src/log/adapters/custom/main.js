const { report } = require('./report')
const { opts } = require('./opts')

const logCustom = {
  name: 'custom',
  title: 'Custom log handler',
  description: 'Log handler using a custom function',
  report,
  reportPerf: report,
  opts,
}

module.exports = {
  logCustom,
}
