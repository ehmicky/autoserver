'use strict';


const { omit } = require('lodash');

const { commands } = require('../../../../constants');


/**
 * "create" action uses a "create" command
 **/
const createAction = function () {
  return async function createAction(input) {
    const { action, log, args } = input;
    const perf = log.perf.start('action.create', 'middleware');

    const isMultiple = action.multiple;
    const command = commands.find(({ type, multiple }) => {
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
};


module.exports = {
  createAction,
};
