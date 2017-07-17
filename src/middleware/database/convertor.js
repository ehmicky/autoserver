'use strict';

// Converts from Command format to Database format
const databaseConvertor = async function ({
  command,
  args,
  modelName,
  jsl,
  log,
  idl,
  serverOpts,
  apiServer,
  params,
  settings,
}) {
  const perf = log.perf.start('database.convertor', 'middleware');

  const nextInput = {
    command,
    args,
    modelName,
    jsl,
    log,
    idl,
    serverOpts,
    apiServer,
    params,
    settings,
  };

  perf.stop();
  const response = await this.next(nextInput);
  return response;
};

module.exports = {
  databaseConvertor,
};
