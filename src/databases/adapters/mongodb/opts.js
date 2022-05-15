export const opts = {
  type: 'object',
  additionalProperties: false,
  properties: {
    hostname: {
      oneOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
          items: {
            type: 'string',
          },
          minItems: 1,
        },
      ],
    },
    port: {
      oneOf: [
        {
          type: 'integer',
          minimum: 0,
          maximum: 65_535,
        },
        {
          type: 'array',
          items: {
            type: 'integer',
          },
          minItems: 1,
        },
      ],
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    dbname: {
      type: 'string',
    },
    opts: {
      type: 'object',
    },
  },
}
