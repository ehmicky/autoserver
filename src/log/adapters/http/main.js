import { report } from './report.js'
import { opts } from './opts.js'
import { getOpts } from './get_opts.js'

export const logHttp = {
  name: 'http',
  title: 'HTTP log handler',
  description: 'Log handler using a HTTP request',
  report,
  reportPerf: report,
  opts,
  getOpts,
}
