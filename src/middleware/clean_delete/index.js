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

    const response = await this.next(input);

    if (actionType === 'delete') {
      response.data = removeAttributes({ data: response.data, nestedAttributes });
    }

    return response;
  };
};

// Remove all attributes but `id` or nested models
const removeAttributes = function ({ data, nestedAttributes }) {
  if (data instanceof Array) {
    return data.map(datum => removeAttributes({ data: datum, nestedAttributes }));
  }

  const filteredResponse = pickBy(data, (_, attrName) => attrName === 'id' || nestedAttributes.includes(attrName));
  return filteredResponse;
};


module.exports = {
  cleanDelete,
};
