'use strict';


const { EngineError } = require('../../error');


/* eslint-disable key-spacing, no-multi-spaces */
const operationsRules = {
  findOne:      { id:       { required: true,   multiple: false }                                               },
  findMany:     { id:       { required: false,  multiple: true  },
                  filters:  { required: false                   }                                               },
  deleteOne:    { id:       { required: true,   multiple: false }                                               },
  deleteMany:   { id:       { required: false,  multiple: true  },
                  filters:  { required: true                    }                                               },
  updateOne:    { id:       { required: true,   multiple: false },  data: { required: true,   multiple: false } },
  updateMany:   { id:       { required: false,  multiple: true  },  data: { required: true,   multiple: false },
                  filters:  { required: false                   }                                               },
  createOne:    { id:       { required: false,  multiple: false },  data: { required: true,   multiple: false } },
  createMany:   { id:       { required: false,  multiple: true  },  data: { required: true,   multiple: true  } },
  replaceOne:   { id:       { required: true,   multiple: false },  data: { required: true,   multiple: false } },
  replaceMany:  { id:       { required: true,   multiple: true  },  data: { required: true,   multiple: true  } },
  upsertOne:    { id:       { required: true,   multiple: false },  data: { required: true,   multiple: false } },
  upsertMany:   { id:       { required: true,   multiple: true  },  data: { required: true,   multiple: true  } },
};
/* eslint-enable key-spacing, no-multi-spaces */

const validateDatabaseInput = function ({ operation, modelName }) {
  const throwError = createThrowError({ operation, modelName });

  if (!operation) {
    throwError('No database operation specified');
  }
  if (!modelName) {
    throwError('No collection specified');
  }
};

const validateOperationInput = function ({ operation, modelName, collection, filters, id, ids, orderBy, data }) {
  const throwError = createThrowError({ operation, modelName });
  const rules = operationsRules[operation];

  if (!collection) {
    throwError('Collection cannot be found');
  }

  if (!data && rules.data && rules.data.required) {
    throwError('Missing \'data\' argument');
  }
  if (data && !rules.data) {
    throwError('Cannot use \'data\' argument');
  }
  if (data && !(data instanceof Array) && rules.data.multiple) {
    throwError('\'data\' argument should be an array');
  }
  if (data && (typeof data !== 'object' || data === null) && !rules.data.multiple) {
    throwError('\'data\' argument should be an object');
  }

  if (filters) {
    if (typeof filters !== 'object' || filters === null) {
      throwError('Filters argument must be an object');
    }
    if (!rules.filters && Object.keys(filters).length > 0) {
      throwError('Cannot use \'filters\' arguments');
    }
  }

  if ((!filters || Object.keys(filters).length === 0) && !id && !ids && rules.filters && rules.filters.required) {
    throwError('Missing \'filters\', \'id\' or \'ids\' arguments');
  }

  if (!id && rules.id.required && !rules.id.multiple) {
    throwError('Missing \'id\' argument');
  }
  if (!ids && rules.id.required && rules.id.multiple) {
    throwError('Missing \'ids\' argument');
  }
  if (id && rules.id.multiple) {
    throwError('Can specify \'ids\' argument but not \'id\'');
  }
  if (ids && !rules.id.multiple) {
    throwError('Can specify \'id\' but not \'ids\'');
  }
  if (id && id instanceof Array) {
    throwError('\'id\' should not be an array');
  }
  if (ids && !(ids instanceof Array)) {
    throwError('\'id\' should be an array');
  }

  if (orderBy && typeof orderBy !== 'string') {
    throwError('\'order_by\' value must be a string');
  }
};

const attributeNameRegexp = /^[\w.]+$/;
const validateAttributeName = function (name) {
  if (!attributeNameRegexp.test(name)) {
    throw new EngineError(`${name} should only contain numbers, letters, dots or underscores`, {
      reason: 'DATABASE_VALIDATION_INTERNAL',
    });
  }
};

const createThrowError = function({ operation, modelName }) {
  let postfix = '';
  if (operation || modelName) {
    postfix += ' in: ';
  }
  if (operation) {
    postfix += `operation '${operation}'`;
  }
  if (modelName) {
    if (operation) {
      postfix += ', ';
    }
    postfix += `collection '${modelName}'`;
  }
  return function (message) {
    throw new EngineError(`${message}${postfix}`, { reason: 'DATABASE_VALIDATION_INTERNAL' });
  };
};


module.exports = {
  validateDatabaseInput,
  validateOperationInput,
  validateAttributeName,
};