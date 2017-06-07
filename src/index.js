'use strict';


const { startServer } = require('./server');
const { propertiesPlugin } = require('./idl');


startServer({
  conf: './examples/pet.schema.yml',
  // Customize what is logged as `requestInfo`
  loggerFilter: {
    // Can be a mapping function, or a list of attributes
    payload: ({ id }) => id,
    headers: ['host'],
  //   argData,
  //   actionResponses,
  //   response,
  //   params,
  //   queryVars,
  },
  // Can customize logging level, among 'info' (default value), 'log', 'warn',
  // 'error' or 'silent'
  loggerLevel: 'info',
  // arg.data length is limited to 1000 by default.
  // This can be changed, or disabled (using 0)
  maxDataLength: 1000,
  // Pagination default size. Defaults to 100. 0 to disable pagination.
  defaultPageSize: 100,
  // User can override pagination size. This sets an upper limit.
  // Defaults to 100.
  maxPageSize: 100,
  // Project name, used e.g. to namespace HTTP headers
  projectName: 'example_api',
})
// Returns an EventEmitter2 firing the following events: start, error,
// stop.success, stop.fail
// Also has the properties:
//  - options {object} - options passed during initialization
//  - info {object}
//     - info.serverId {string}
//     - info.serverName {string}
//     - info.version {string}
//  - servers {object}
//     - servers.HTTP {Server} - Node.js HTTP server
// Note that `options` and `servers` will only be available after the `start`
// event is fired
// Must return promise if the handler is async.
.on('start', () => hasEmit('start'))
// If the `error` event handler is not setup, an exception will be
// thrown instead
.on('error', (/* error */) => hasEmit('error'))
// Can use globbing star
.on('stop.*', () => {})
.on('stop.success', () => hasEmit('stop.success'))
.on('stop.fail', () => hasEmit('stop.fail'))
// Information to send for monitoring
// Triggered on server startup, shutdowns, requests, errors, logs
.on('log.*.*.*', info => {
  const { phase, type, level } = info;
  hasEmit(`log.${phase}.${type}.${level}`);
  if (type === 'perf') { return; }
  //const jsonInfo = JSON.stringify(info, null, 2);
  //global.console.log('Logging info', jsonInfo);
})
// Performance monitoring
.on('log.*.perf.*', info => {
  const measures = info.measures
    .sort((
      { category: catA, duration: timeA },
      { category: catB, duration: timeB },
    ) => {
      if (catA < catB) { return -1; }
      if (catA > catB) { return 1; }
      if (timeA < timeB) { return 1; }
      if (timeA > timeB) { return -1; }
      return 0;
    })
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
    });
  const jsonMeasures = measures.reduce((memo, str) => `${memo}\n${str}`, '');
  global.console.log('Performance logging info', jsonMeasures);
});

const hasEmit = function (eventName) {
  global.console.log(`Emitting event '${eventName}'`);
};


module.exports = {
  startServer,
  propertiesPlugin,
};
