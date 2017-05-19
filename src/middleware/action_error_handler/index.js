'use strict';


const { cloneDeep } = require('lodash');

const { processError } = require('../../error');


// Error handler adding action-related information to exceptions
const actionErrorHandler = function () {
  return async function actionErrorHandler(input) {
    const args = cloneDeep(input.args);
    try {
      const response = await this.next(input);
      return response;
    } catch (error) {
      const keyName = 'action';
      const {
        action: { name: key },
        fullAction,
        modelName: model,
      } = input;
      const genericInfo = { extra: { model, action_path: fullAction, args } };

      error = processError({
        error,
        input,
        keyName,
        key,
        genericInfo,
      });
      throw error;
    }
  };
};


module.exports = {
  actionErrorHandler,
};
