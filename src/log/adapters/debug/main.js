import { report } from './report.js'
import { reportPerf } from './report_perf.js'

export const logDebug = {
  name: 'debug',
  title: 'Debug log handler',
  description: 'Log handler printing on the console, meant for debugging',
  report,
  reportPerf,
}
