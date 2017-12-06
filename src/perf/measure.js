'use strict';

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

const { hrtime } = process;

// Start a new measure
const startPerf = function (label, category = 'default') {
  // `hrtime()` is more precise that `Date.now()`
  const pending = hrtime();
  return { pending, label, category };
};

const stopPerf = function ({ pending, label, category }) {
  // Substracts the current time with the previous time
  const [secs, nanoSecs] = hrtime();
  const timestampA = (secs * SECS_TO_NANOSECS) + nanoSecs;

  const [lastSecs, lastNanoSecs] = pending;
  const timestampB = (lastSecs * SECS_TO_NANOSECS) + lastNanoSecs;

  const duration = timestampA - timestampB;

  return { duration, label, category };
};

const nanoSecsToMilliSecs = function ({ duration }) {
  return Math.round(duration / NANOSECS_TO_MILLISECS);
};

const SECS_TO_NANOSECS = 1e9;
const NANOSECS_TO_MILLISECS = 1e6;

module.exports = {
  startPerf,
  stopPerf,
  nanoSecsToMilliSecs,
};
