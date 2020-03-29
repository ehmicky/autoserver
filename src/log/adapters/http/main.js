import { getOpts } from './get_opts.js'
import { opts } from './opts.js'
import { report } from './report.js'

export const logHttp = {
  name: 'http',
  title: 'HTTP log handler',
  description: 'Log handler using a HTTP request',
  report,
  reportPerf: report,
  opts,
  getOpts,
}
