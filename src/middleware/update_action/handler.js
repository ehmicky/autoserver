'use strict';


const { getFindInput } = require('./find');
const { getUpdateInput } = require('./update');


/**
 *
 **/
const updateAction = async function () {
  return async function updateAction(input) {
    const { actionType, action, modelName } = input;

    if (actionType === 'update') {
      const prefix = `In action '${action}', model '${modelName}',`;
      const response = await performUpdate.call(this, { input, prefix });
      return response;
    }

    const response = await this.next(input);
    return response;
  };
};

const performUpdate = async function ({ input, prefix }) {
  const findInput = getFindInput({ input });
  const { data: models } = await this.next(findInput);

  const updateInput = getUpdateInput({ input, models, prefix });
  const response = await this.next(updateInput);

  return response;
};


module.exports = {
  updateAction,
};
