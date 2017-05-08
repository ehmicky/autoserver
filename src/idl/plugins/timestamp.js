'use strict';


const { propertiesPlugin } = require('./properties');


// Plugin that adds default timestamps to each model:
//   created_time {string} - set on model creation
//   updated_time {string} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
const timestampPlugin = function ({ idl, opts }) {
  return propertiesPlugin({ getProperties, requiredProperties })({ idl, opts });
};

const getProperties = () => ({
  created_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was created',
    examples: ['2017-04-26T11:19:45Z'],
    format: 'date-time',
    compute: '(["create", "upsert"].includes($ACTION) ? $NOW : undefined)',
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
});
const requiredProperties = ['updated_time'];


module.exports = {
  timestampPlugin,
};
