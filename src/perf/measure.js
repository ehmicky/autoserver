'use strict';

// This calculates time intervals, in order to do performance monitoring
// Concepts:
//   - a `label` is a measurements name
//   - a `category` is the namespace of a label. Default is "default"
//   - a label can have several `measures`
//     Each call to startPerf() will create a new measure, which is assigned
//   - each measure can be stopped and restarted by calling `stopPerf()`
//     and `restartPerf()`
// API:
//   - `const measure = startPerf('label', 'category');` starts a measure
//   - `const newMeasure = stopPerf(measure);` stops a measure
// Notice that a new measure is returned after each call, the passed measure
// is not modified.

const { hrtime } = process;

const { throwError } = require('../error');

const { CATEGORIES, DEFAULT_CATEGORY } = require('./constants');

// Start a new measure
const startPerf = function (label, category = DEFAULT_CATEGORY) {
  validateOptions({ label, category });

  // `hrtime()` is more precise that `Date.now()`
  const pending = hrtime();
  return { pending, label, category };
};

const validateOptions = function ({ label, category }) {
  if (typeof label !== 'string') {
    const message = 'Performance label must be a string';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  if (typeof category !== 'string') {
    const message = 'Performance category must be a string';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  if (!CATEGORIES.includes(category)) {
    const message = `Unknown performance category: '${category}'`;
    throwError(message, { reason: 'UTILITY_ERROR' });
  }
};

const stopPerf = function ({ pending, label, category }) {
  if (pending === undefined) {
    const message = 'Must call \'restartPerf()\' before calling \'stopPerf()\'';
    throwError(message, { reason: 'UTILITY_ERROR' });
  }

  // Substracts the current time with the previous time
  const [secs, nanoSecs] = hrtime();
  const [lastSecs, lastNanoSecs] = pending;
  const duration = (secs - lastSecs) * 10 ** 9 + (nanoSecs - lastNanoSecs);
  return { duration, label, category };
};

module.exports = {
  startPerf,
  stopPerf,
};
