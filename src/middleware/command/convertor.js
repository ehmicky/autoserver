'use strict';

// Converts from Action format to Command format
const commandConvertor = async function ({
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
  const newJsl = jsl.add({ $COMMAND: command.type });

  // Not kept: action, fullAction
  const nextInput = {
    command,
    args,
    modelName,
    jsl: newJsl,
    log,
    perf,
    idl,
    serverOpts,
    apiServer,
    params,
    settings,
  };

  try {
    const response = await this.next(nextInput);
    return response;
  } catch (error) {
    // Added only for final error handler
    log.add({ command });

    throw error;
  }
};

module.exports = {
  commandConvertor,
};
