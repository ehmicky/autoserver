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
//   - `perf.getMeasures()` will return an array of measures:
//       - [category="default"] {string}
//       - label {string}
//       - duration {number} - sum of all items durations, in milliseconds
//       - items {number[]} - each item duration, in milliseconds
//       - count {number} - number of items
//       - average {number} - average item duration, in milliseconds
class PerfLog {

  constructor() {
    this._measures = {};
    this._counter = 0;
  }

  // Start a new measurement item
  start(label, category = DEFAULT_CATEGORY) {
    // We use an incrementing counter as unique ID for items
    const itemId = ++this._counter;
    const options = { itemId, label, category };

    this._validateOptions(options);

    this._startItem(options);

    return new PerfLogItem({ perfLog: this, options });
  }

  _validateOptions({ label, category }) {
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

  _startItem(options) {
    this._recordItem(Object.assign({}, options, { end: false }));
  }

  _stopItem(options) {
    this._recordItem(Object.assign({}, options, { end: true }));
  }

  _recordItem({ end, itemId, label, category }) {
    // `hrtime()` is more precise that `Date.now()`
    const [secs, nanoSecs] = hrtime();

    // Sort measurements by category, label and itemId
    const key = `${category} ${label}`;
    if (!this._measures[key]) {
      this._measures[key] = {};
    }
    if (!this._measures[key][itemId]) {
      this._measures[key][itemId] = {};
    }
    const measures = this._measures[key][itemId];

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
  }

  // Returns structured measurements
  getMeasures() {
    // When an exception was thrown, only returns measurements with
    // category `exception`
    const hasException = Object.keys(this._measures).some(categoryLabel =>
      categoryLabel.startsWith('exception')
    );

    return Object.entries(this._measures)
      .reduce((measures, [categoryLabel, labelMeasures]) => {
        const [category, label] = categoryLabel.split(' ');
        if (hasException && category !== 'exception') { return measures; }
        // Use milliseconds, but with nanoseconds precision
        const items = Object.values(labelMeasures)
          .map(({ duration }) => duration / 10 ** 6);
        const duration = items.reduce((sum, item) => sum + item, 0);
        const count = items.length;
        const average = duration / count;
        const measure = { category, label, duration, items, count, average };
        return [...measures, measure];
      }, []);
  }

}

// A single measurement item
// This class is returned by `perfLog.start()`, and allows user to
// stop a measurement item, or to restart it
class PerfLogItem {

  constructor({ perfLog, options, end = false }) {
    Object.assign(this, { perfLog, options, end });
  }

  start() {
    if (this.end === false) {
      const message = 'Must call \'stop()\' before calling \'start()\'';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    this.end = false;
    this.perfLog._startItem(this.options);
  }

  stop() {
    if (this.end === true) {
      const message = 'Must call \'start()\' before calling \'stop()\'';
      throw new EngineError(message, { reason: 'UTILITY_ERROR' });
    }

    this.end = true;
    this.perfLog._stopItem(this.options);
  }

}

const DEFAULT_CATEGORY = 'default';
const CATEGORIES = [
  'all',
  'default',
  'layer',
  'middleware',
  'server',
  'exception',
];


module.exports = {
  PerfLog,
};
