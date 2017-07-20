'use strict';

const { EngineError } = require('../../error');

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

module.exports = {
  PerfLogItem,
};
