'use strict';


const { mapValues, each } = require('lodash');


// Add default attributes to the IDL file, such as created_time, updated_time
const addDefaultAttributes = function ({ idl }) {
  const { models, users: { id: userId, model: userModel } = {} } = idl;
  const defaultAttributes = getDefaultAttributes({ userId, userModel });
  return mapValues(models, model => {
    each(defaultAttributes, (defaultAttribute, attrName) => {
      // If IDL.users is not specified, do not add created_by|updated_by
      if (requiresUserId.includes(attrName) && (!userId || !userModel)) { return; }

      model.properties[attrName] = defaultAttribute;
      if (requiredDefaultAttributes.includes(attrName)) {
        model.required.push(attrName);
      }
    });
    return model;
  });
};

const getDefaultAttributes = ({ userId, userModel }) => ({
  created_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was created',
    examples: ['2017-04-26T11:19:45Z'],
    format: 'date-time',
    compute: '(["create", "upsert"].includes($ACTION) ? $NOW)',
    readOnly: true,
    writeOnce: true,
  },
  updated_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was last updated',
    examples: ['2017-04-26T11:19:45Z'],
    format: 'date-time',
    compute: '($NOW)',
    readOnly: true,
  },
  created_by: {
    type: 'object',
    description: 'Who created this model',
    model: userModel,
    compute: `(["create", "upsert"].includes($ACTION) ? ${userId})`,
    readOnly: true,
    writeOnce: true,
  },
  updated_by: {
    type: 'object',
    description: 'Who last updated this model',
    model: userModel,
    compute: userId,
    readOnly: true,
  },
});
const requiredDefaultAttributes = ['updated_time', 'updated_by'];
const requiresUserId = ['created_by', 'updated_by'];


module.exports = {
  addDefaultAttributes,
};
