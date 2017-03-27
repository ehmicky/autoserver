'use strict';


// Add description, taken from IDL definition
const getDescription = function ({ def, opType, multiple }) {
  // Tries to look under `items` in case this in an array
  let description = def.description || (def.items && def.items.description);
  const model = def.instanceof || (def.items && def.items.instanceof);
  // Models add an extra text like '(replace operation, single)'
  // 'single|multiple' is only shown in field descriptions, not type descriptions
  if (description) {
    description += (model ? findOperationDescription({ opType, multiple }) : '');
  }
  return description;
};

const findOperationDescription = function ({ opType, multiple = null }) {
  const operation = operationDescriptions.find(operation => operation.opType === opType);
  if (!operation) { return; }
  if (multiple == null) { return operation.description; }
  const multipleText = multiple ? ', multiple)' : ', single)';
  return operation.description.slice(0, -1) + multipleText;
};

/* eslint-disable no-multi-spaces */
const operationDescriptions = [
  { opType: 'find',     description: ' (find operation)'    },
  { opType: 'create',   description: ' (create operation)'  },
  { opType: 'replace',  description: ' (replace operation)' },
  { opType: 'update',   description: ' (update operation)'  },
  { opType: 'upsert',   description: ' (upsert operation)'  },
  { opType: 'delete',   description: ' (delete operation)'  },
];
/* eslint-enable no-multi-spaces */

// Add deprecation reason, taken from IDL definition
const getDeprecationReason = function ({ def }) {
  // Tries to look under `items` in case this in an array
  return def.deprecated || (def.items && def.items.deprecated);
};


module.exports = {
  getDescription,
  getDeprecationReason,
};