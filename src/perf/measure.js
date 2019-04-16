// This calculates time intervals, in order to do performance monitoring
// Concepts:
//   - a `label` is a measurements name
//   - a `category` is the namespace of a label. Default is "default"
//   - a label can have several `measures`
//     Each call to startPerf() will create a new measure, which is assigned
//   - each measure can be stopped by calling `stopPerf()`
// API:
//   - `const measure = startPerf('label', 'category');` starts a measure
//   - `const newMeasure = stopPerf(measure);` stops a measure
// Notice that a new measure is returned after each call, the passed measure
// is not modified.

const { hrtime } = require('process')

// Start a new measure
const startPerf = function(label, category = 'default') {
  // `hrtime()` is more precise that `Date.now()`
  const pending = getTimestamp()
  return { pending, label, category }
}

// Substracts the current time with the previous time
const stopPerf = function({ pending, label, category }) {
  const ending = getTimestamp()
  const duration = Number(ending - pending)
  return { duration, label, category }
}

const getDefaultDuration = function({ measures }) {
  const { duration } = measures.find(({ category }) => category === 'default')
  const durationA = nanoSecsToMilliSecs({ duration })
  return durationA
}

const nanoSecsToMilliSecs = function({ duration }) {
  return Math.round(duration / NANOSECS_TO_MILLISECS)
}

// TODO: use hrtime.bigint() when dropping support for Node <10.7.0
const getTimestamp = function() {
  const [secs, nSecs] = hrtime()
  return secs * NANOSECS_TO_SECS + nSecs
}

const NANOSECS_TO_MILLISECS = 1e6
const NANOSECS_TO_SECS = 1e9

module.exports = {
  startPerf,
  stopPerf,
  getDefaultDuration,
  nanoSecsToMilliSecs,
}
