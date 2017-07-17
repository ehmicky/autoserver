'use strict';

const { COMMANDS } = require('../../../constants');

/**
 * "find" action uses a "read" command
 **/
const findAction = async function (input) {
  const { args, action, log } = input;
  const perf = log.perf.start('action.find', 'middleware');

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => {
    return type === 'read' && multiple === isMultiple;
  });

  const newArgs = Object.assign({}, args, { pagination: isMultiple });
  Object.assign(input, { command, args: newArgs });

  perf.stop();
  const response = await this.next(input);
  return response;
};

module.exports = {
  findAction,
};
