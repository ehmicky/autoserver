'use strict';


const { COMMANDS } = require('../../../constants');
const { omit } = require('../../../utilities');


/**
 * "create" action uses a "create" command
 **/
const createAction = async function (input) {
  const { action, log, args } = input;
  const perf = log.perf.start('action.create', 'middleware');

  const isMultiple = action.multiple;
  const command = COMMANDS.find(({ type, multiple }) => {
    return type === 'create' && multiple === isMultiple;
  });

  const newArgs = omit(args, ['data']);
  const newData = args.data;

  Object.assign(newArgs, { pagination: false, newData });
  Object.assign(input, { command, args: newArgs });

  perf.stop();
  const response = await this.next(input);
  return response;
};


module.exports = {
  createAction,
};
