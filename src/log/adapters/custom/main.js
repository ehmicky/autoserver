import { report } from './report.js'
import { opts } from './opts.js'

export const logCustom = {
  name: 'custom',
  title: 'Custom log handler',
  description: 'Log handler using a custom function',
  report,
  reportPerf: report,
  opts,
}
