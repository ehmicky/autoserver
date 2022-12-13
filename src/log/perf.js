import { groupMeasures } from '../perf/group.js'
import { stringifyMeasures } from '../perf/stringify.js'

import { logEvent } from './main.js'

// Emit 'perf' event
export const logPerfEvent = ({ phase, measures, ...rest }) => {
  const measuresGroups = groupMeasures({ measures })
  const measuresmessage = stringifyMeasures({ phase, measuresGroups })
  const params = { measures: measuresGroups, measuresmessage }
  return logEvent({ ...rest, event: 'perf', phase, params })
}
