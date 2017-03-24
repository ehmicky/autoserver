'use strict';


// Add description, taken from IDL definition
const getDescription = function ({ def, prefix, multiple }) {
  // Tries to look under `items` in case this in an array
  let description = def.description || (def.items && def.items.description);
  const model = def.model || (def.items && def.items.model);
  // Models add an extra text like '(replace operation, single)'
  // 'single|multiple' is only shown in field descriptions, not type descriptions
  if (description) {
    description += (model ? findOperationDescription({ prefix, multiple }) : '');
  }
  return description;
};

const findOperationDescription = function ({ prefix, multiple = null }) {
  const operation = operationDescriptions.find(operation => operation.prefix === prefix);
  if (!operation) { return; }
  if (multiple == null) { return operation.description; }
  const multipleText = multiple ? ', multiple)' : ', single)';
  return operation.description.slice(0, -1) + multipleText;
};

/* eslint-disable no-multi-spaces */
const operationDescriptions = [
  { prefix: 'find',     description: ' (find operation)'    },
  { prefix: 'create',   description: ' (create operation)'  },
  { prefix: 'replace',  description: ' (replace operation)' },
  { prefix: 'update',   description: ' (update operation)'  },
  { prefix: 'upsert',   description: ' (upsert operation)'  },
  { prefix: 'delete',   description: ' (delete operation)'  },
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