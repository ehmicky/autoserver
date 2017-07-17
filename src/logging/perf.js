'use strict';

const { hrtime } = process;

const { EngineError } = require('../error');

// This class calculates time intervals, in order to do performance monitoring
// Concepts:
//   - a `label` is a measurements name
//   - a `category` is the namespace of a label. Default is "default"
//   - a label can have several measurements, called `item`
//     Each call to PerfLog.start() will create a new item, which is assigned
//     a unique `itemId`
//   - each item can be stopped and restarted by calling `start` and `stop`
// API:
//   - `const perfLog = new PerfLog();` is done once per phase
//   - `const perf = perfLog.start();` is done once per item
//   - alternating `perf.stop()` and `perf.start()` will freeze|unfreeze an item
//   - `perf.stop()` will return current time, in milliseconds
//   - `perf.getMeasures()` will return an array of measures:
//       - [category="default"] {string}
//       - label {string}
//       - duration {number} - sum of all items durations, in milliseconds
//       - items {number[]} - each item duration, in milliseconds
//       - count {number} - number of items
//       - average {number} - average item duration, in milliseconds
//   - `perf.getMeasuresMessage({ measures })` will return as a string,
//     ready to be printed on console
class PerfLog {
  constructor () {
    this.measures = {};
    this.counter = 0;
  }

  // Start a new measurement item
  start (label, category = DEFAULT_CATEGORY) {
    // We use an incrementing counter as unique ID for items
    this.counter += 1;
    const itemId = this.counter;
    const options = { itemId, label, category };

    this.validateOptions(options);

    this.startItem(options);

    return new PerfLogItem({ perfLog: this, options });
  }

  validateOptions ({ label, category }) {
    if (typeof label !== 'string') {
      const message = 'Performance label must be a string';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    if (typeof category !== 'string') {
      const message = 'Performance category must be a string';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    if (!CATEGORIES.includes(category)) {
      const message = `Unknown performance category: '${category}'`;
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }
  }

  startItem (options) {
    return this.recordItem(Object.assign({}, options, { end: false }));
  }

  stopItem (options) {
    return this.recordItem(Object.assign({}, options, { end: true }));
  }

  recordItem ({ end, itemId, label, category }) {
    // `hrtime()` is more precise that `Date.now()`
    const [secs, nanoSecs] = hrtime();

    // Sort measurements by category, label and itemId
    const key = `${category} ${label}`;

    if (!this.measures[key]) {
      this.measures[key] = {};
    }

    if (!this.measures[key][itemId]) {
      this.measures[key][itemId] = {};
    }

    const measures = this.measures[key][itemId];

    // `start()` marks the current time
    if (!end) {
      measures.pending = [secs, nanoSecs];
    // `end()` substracts the current time with the previous time
    } else {
      const [lastSecs, lastNanoSecs] = measures.pending;
      const duration = (secs - lastSecs) * 10 ** 9 + (nanoSecs - lastNanoSecs);
      // We sum up the calculated duration with the previous items
      measures.duration = measures.duration
        ? measures.duration + duration
        : duration;
    }

    return measures.duration / 10 ** 6;
  }

  // Returns structured measurements
  getMeasures () {
    // When an exception was thrown, only returns measurements with
    // category `exception`
    const hasException = Object.keys(this.measures).some(categoryLabel =>
      categoryLabel.startsWith('exception')
    );

    return Object.entries(this.measures)
      .map(([categoryLabel, labelMeasures]) => {
        const [category, label] = categoryLabel.split(' ');
        // Use milliseconds, but with nanoseconds precision
        const items = Object.values(labelMeasures)
          .filter(({ duration }) => duration !== undefined)
          .map(({ duration }) => duration / 10 ** 6);
        return [category, label, items];
      })
      .filter(([category]) => !(hasException && category !== 'exception'))
      .filter(([,, items]) => items.length > 0)
      .map(([category, label, items]) => {
        const duration = items.reduce((sum, item) => sum + item, 0);
        const count = items.length;
        const average = duration / count;

        const measure = { category, label, duration, items, count, average };
        return measure;
      });
  }

  // Returns measures but as a single string, for console debugging
  getMeasuresMessage ({ measures }) {
    return measures
      // Sort by category (asc) then by duration (desc)
      .sort((
        { category: catA, duration: timeA },
        { category: catB, duration: timeB },
      ) => {
        const indexCatA = CATEGORIES.indexOf(catA);
        const indexCatB = CATEGORIES.indexOf(catB);
        if (indexCatA < indexCatB) { return -1; }
        if (indexCatA > indexCatB) { return 1; }
        if (timeA < timeB) { return 1; }
        if (timeA > timeB) { return -1; }
        return 0;
      })
      // Prints as a table
      .map(({
        phase,
        category,
        label,
        average,
        count,
        duration,
      }) => {
        phase = phase.padEnd(8);
        category = category.padEnd(12);
        label = label.padEnd(26);
        duration = `${Math.round(duration)}ms`.padEnd(8);
        average = `${Math.round(average)}ms`.padEnd(7);
        count = `${String(count).padStart(3)} ${count === 1 ? 'item' : 'items'}`;
        return `${phase} ${category} ${label} ${duration} = ${average} * ${count}`;
      })
      .join('\n');
  }
}

// A single measurement item
// This class is returned by `perfLog.start()`, and allows user to
// stop a measurement item, or to restart it
class PerfLogItem {
  constructor ({ perfLog, options, end = false }) {
    Object.assign(this, { perfLog, options, end });
  }

  start () {
    if (this.end === false) {
      const message = 'Must call \'stop()\' before calling \'start()\'';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    this.end = false;
    this.perfLog.startItem(this.options);
  }

  stop () {
    if (this.end === true) {
      const message = 'Must call \'start()\' before calling \'stop()\'';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    this.end = true;
    return this.perfLog.stopItem(this.options);
  }
}

const DEFAULT_CATEGORY = 'default';
const CATEGORIES = [
  'all',
  'default',
  'options',
  'idl',
  'normalize',
  'graphql',
  'middleware',
  'server',
  'exception',
];

module.exports = {
  PerfLog,
};
