import { stopPerf } from '../../perf/measure.js'

// Request response time, from request handling start to response sending
// Note that other functions might happen after response sending, e.g. events
export const setDuration = ({ reqPerf, metadata }) => {
  const respPerf = stopPerf(reqPerf)

  const duration = Math.round(respPerf.duration / MICROSECS_TO_SECS)

  const metadataA = { ...metadata, duration }
  return { respPerf, duration, metadata: metadataA }
}

const MICROSECS_TO_SECS = 1e6
