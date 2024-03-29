import { attributesPlugin } from './attributes.js'

// Plugin that adds default timestamps to each model:
//   created_time {string} - set on model creation
//   updated_time {string} - set on model creation, modification or deletion
// Are handled by the system, and cannot be overriden by users
export const timestampPlugin = ({ config }) =>
  attributesPlugin({ name: 'timestamp', getAttributes, config })

const getAttributes = () => ({
  created_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was created',
    examples: ['2017-04-26T11:19:45Z'],
    value: getCreatedTime,
    validate: {
      format: 'date-time',
    },
  },
  updated_time: {
    type: 'string',
    description: 'Timestamp indicating when this model was last updated',
    examples: ['2017-04-26T11:19:45Z'],
    value: getUpdatedTime,
    validate: {
      format: 'date-time',
    },
  },
})

const getCreatedTime = ({ previousmodel, previousvalue, timestamp }) => {
  if (previousmodel !== undefined) {
    return previousvalue
  }

  return timestamp
}

const getUpdatedTime = ({ timestamp }) => timestamp
