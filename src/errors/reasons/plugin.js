'use strict';

const getMessage = function ({ plugin }) {
  if (plugin === undefined) { return {}; }

  const message = `In the plugin '${plugin}'`;
  return { message, extra: { plugin } };
};

// Extra:
//  - plugin `{string}`
const PLUGIN = {
  status: 'SERVER_ERROR',
  title: 'Internal error related to a specific plugin',
  getMessage,
};

module.exports = {
  PLUGIN,
};
