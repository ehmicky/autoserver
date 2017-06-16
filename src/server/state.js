'use strict';


const { Log } = require('../logging');
const { ApiEngineServer } = require('./api_server');


// Somewhat global object that contains often used properties:
//   `apiServer` {ApiServer} - return value of main function
//   `startupLog` {Logger} - logger for the startup phase
//   `processLog` {Logger} - logger for the process phase
const getServerState = function ({ options }) {
  const serverState = {};
  const apiServer = new ApiEngineServer();
  const startupLog = new Log({
    serverOpts: options,
    serverState,
    phase: 'startup',
  });

  Object.assign(serverState, { apiServer, startupLog });
  return serverState;
};


module.exports = {
  getServerState,
};
