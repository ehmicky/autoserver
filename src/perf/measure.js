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

import { hrtime } from 'process'

// Start a new measure
export const startPerf = function(label, category = 'default') {
  const pending = hrtime.bigint()
  return { pending, label, category }
}

// Substracts the current time with the previous time
export const stopPerf = function({ pending, label, category }) {
  const ending = hrtime.bigint()
  const duration = Number(ending - pending)
  return { duration, label, category }
}

export const getDefaultDuration = function({ measures }) {
  const { duration } = measures.find(({ category }) => category === 'default')
  const durationA = nanoSecsToMilliSecs(duration)
  return durationA
}

export const nanoSecsToMilliSecs = function(duration) {
  return Math.round(duration / NANOSECS_TO_MILLISECS)
}

const NANOSECS_TO_MILLISECS = 1e6
