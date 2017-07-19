'use strict';

// Converts from Command format to Database format
const databaseConvertor = async function ({
  command,
  args,
  modelName,
  jsl,
  log,
  perf,
  idl,
  serverOpts,
  apiServer,
  params,
  settings,
}) {
  const nextInput = {
    command,
    args,
    modelName,
    jsl,
    log,
    perf,
    idl,
    serverOpts,
    apiServer,
    params,
    settings,
  };

  const response = await this.next(nextInput);
  return response;
};

module.exports = {
  databaseConvertor,
};
