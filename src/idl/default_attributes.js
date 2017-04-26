'use strict';


const { mapValues, each } = require('lodash');


// Add default attributes to the IDL file, such as created_time, updated_time
const addDefaultAttributes = function ({ models }) {
  return mapValues(models, model => {
    each(defaultAttributes, (defaultAttribute, attrName) => {
      model.properties[attrName] = defaultAttribute;
      if (requiredDefaultAttributes.includes(attrName)) {
        model.required.push(attrName);
      }
    });
    return model;
  });
};

const defaultAttributes = {
  created_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was created',
    examples: ['2017-04-26T11:19:45Z'],
    format: 'date-time',
    compute: '$NOW',
    readOnly: true,
    writeOnce: true,
  },
  updated_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was last updated',
    examples: ['2017-04-26T11:19:45Z'],
    format: 'date-time',
    compute: '$NOW',
    idempotent: false,
    readOnly: true,
  },
};
const requiredDefaultAttributes = ['created_time', 'updated_time'];


module.exports = {
  addDefaultAttributes,
};
