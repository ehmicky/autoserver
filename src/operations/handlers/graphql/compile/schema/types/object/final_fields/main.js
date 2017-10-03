'use strict';

const { mapValues } = require('../../../../../../../../utilities');

const { getDefaultValue } = require('./default');
const { getArgs } = require('./args');
const { getMetadata } = require('./metadata');

// Retrieves a GraphQL field info for a given IDL definition,
// i.e. an object that can be passed to new
// GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getFinalFields = function ({ parentDef, fields, opts }) {
  return mapValues(
    fields,
    (def, defName) => getField({ parentDef, def, defName, opts }),
  );
};

const getField = function ({ parentDef, def, defName, opts }) {
  const command = def.command || parentDef.command;
  const defA = { ...def, command };
  const optsA = { ...opts, defName };

  const type = optsA.getType(defA, optsA);
  const args = getArgs({ parentDef, def: defA, opts: optsA });
  const defaultValue = getDefaultValue({ def: defA, opts: optsA });
  const { description, deprecationReason } = getMetadata({ def: defA });

  return { type, description, deprecationReason, args, defaultValue };
};

module.exports = {
  getFinalFields,
};
