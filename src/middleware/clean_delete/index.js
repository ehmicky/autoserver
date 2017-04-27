'use strict';


const { pickBy, mapValues } = require('lodash');

const { getModelsMap } = require('../../idl');


/**
 * Each operation should return latest representation only, i.e. delete should return nothing
 * However, database delete action still need to return full model, so it can be used in JSL
 * We are now cleaning all attributes except:
 *   - since GraphQL does not allow empty object responses, we always leave `id` in response
 *   - nested operations need to know about nested models, i.e. nested models are left to interface layer, which will
 *     clean them
 **/
const cleanDelete = async function ({ idl }) {
  const modelsMap = getModelsMap({ idl });
  const nestedModelsMap = mapValues(modelsMap, modelIdl => Object.keys(pickBy(modelIdl, ({ model }) => model)));

  return async function (input) {
    const { actionType, modelName } = input;
    const nestedAttributes = nestedModelsMap[modelName] || [];

    let response = await this.next(input);

    if (actionType === 'delete') {
      response = removeAttributes({ response, nestedAttributes });
    }

    return response;
  };
};

// Remove all attributes but `id` or nested models
const removeAttributes = function ({ response, nestedAttributes }) {
  if (response instanceof Array) {
    return response.map(singleResponse => removeAttributes({ response: singleResponse, nestedAttributes }));
  }

  const filteredResponse = pickBy(response, (_, attrName) => attrName === 'id' || nestedAttributes.includes(attrName));
  return filteredResponse;
};


module.exports = {
  cleanDelete,
};
