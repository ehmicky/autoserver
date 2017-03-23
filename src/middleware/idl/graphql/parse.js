'use strict';


const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLNonNull,
  printSchema: graphQLPrintSchema,
} = require('graphql');
const titleize = require('underscore.string/titleize');
const camelize = require('underscore.string/camelize');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../error');


// Validate IDL definition
// Also performs some transformation, e.g. adding default values
// TODO: use JSON schema validation|transformation instead
// TODO: move all validation into this method
const validateIdlDefinition = function (obj) {
  const modelTypes = Object.keys(obj.models).map(key => obj.models[key].type);
  obj.modelTypes = modelTypes;
  validateModelsDefinition(obj.models, { modelTypes });
  return obj;
};

const validateModelsDefinition = function (obj, { modelTypes }) {
  if (typeof obj !== 'object') { return obj; }

  Object.keys(obj).forEach(attrName => {
    const child = obj[attrName];
    if (typeof child === 'object') {
      // TODO: should detect whether child _could_ have `type` instead (i.e. is a JSON schema), as we want `type` to be optional
      // Adds def.name default value, by using parent property name
      if (child.type && !child.name) {
        child.name = attrName;
      }
      // Definitions of type `object` must have valid `properties`
      if (child.type === 'object') {
        if (!child.properties || typeof child.properties !== 'object' || Object.keys(child.properties).length === 0) {
          throw new EngineError(`The following definition of type 'object' is missing 'properties': ${JSON.stringify(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
      }
      // Replace { type: "Model" } by { type: "object", modelName: "Model" }
      const isModel = modelTypes.includes(child.type);
      if (isModel) {
        // Make sure we are not overriding user definitions
        if (child.modelName) {
          throw new EngineError(`The following model cannot have a property named 'modelName': ${JSON.stringify(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
        Object.assign(child, {
          type: 'object',
          modelName: child.type,
        });
      }
    }
    // Recurse over children
    validateModelsDefinition(child, { modelTypes });
  }, {});

  return obj;
};


// Transforms an IDL definition into an object easy to parse by GraphQL
const getRootDefinition = function ({ definitions, bulkOptions: { write: allowBulkWrite, delete: allowBulkDelete } }) {
  const models = validateIdlDefinition(definitions).models;

  const safeOperations = operations.filter(operation => operation.safe);
  const unsafeOperations = operations.filter(operation => {
    return !operation.safe
      && !(!allowBulkWrite && operation.isBulkWrite)
      && !(!allowBulkDelete && operation.isBulkDelete);
  });
  const safeProperties = getOperationDefinitions({ models, operations: safeOperations });
  const unsafeProperties = getOperationDefinitions({ models, operations: unsafeOperations });

  return {
    query: {
      name: 'Query',
      type: 'object',
      description: 'Fetches information about different entities',
      properties: safeProperties,
    },
    mutation: {
      name: 'Mutation',
      type: 'object',
      description: 'Modifies information about different entities',
      properties: unsafeProperties,
    },
  };
};

const getOperationDefinitions = function({ models, operations }) {
  return operations.reduce((memo, operation) => {
    const properties = getOperationDefinition({ models, operation });
    Object.assign(memo, properties);
    return memo;
  }, {});
};

const getOperationDefinition = function ({ models, operation }) {
  return Object.keys(models).reduce((properties, modelName) => {
    const model = models[modelName];
    const name = model.name || modelName;
    const def = Object.assign({}, model, { name });

    // `find*` operations are aliased for convenience
    // E.g. `findPet` and `findPets` -> `pet` and `pets`
    const isFind = operation.prefix === 'find';

    // E.g. `updatePets` operation
    let operationName;
    if (operation.multiple) {
      operationName = isFind ? getPluralName(def) : getPluralOperationName(def, operation.prefix);
      properties[operationName] = { type: 'array', items: def };
    // E.g. `updatePet` operation
    } else {
      operationName = isFind ? getSingularName(def) : getSingularOperationName(def, operation.prefix);
      properties[operationName] = def;
    }

    properties[operationName].operation = operation.prefix;

    return properties;
  }, {});
};

/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',      prefix: 'find',     safe: true,   multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'findMany',     prefix: 'find',     safe: true,   multiple: true,   isBulkWrite: false, isBulkDelete: false },
  { name: 'createOne',    prefix: 'create',   safe: false,  multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'createMany',   prefix: 'create',   safe: false,  multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'replaceOne',   prefix: 'replace',  safe: false,  multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'replaceMany',  prefix: 'replace',  safe: false,  multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'updateOne',    prefix: 'update',   safe: false,  multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'updateMany',   prefix: 'update',   safe: false,  multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'upsertOne',    prefix: 'upsert',   safe: false,  multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'upsertMany',   prefix: 'upsert',   safe: false,  multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'deleteOne',    prefix: 'delete',   safe: false,  multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'deleteMany',   prefix: 'delete',   safe: false,  multiple: true,   isBulkWrite: false, isBulkDelete: true  },
];
/* eslint-enable no-multi-spaces */


// Returns GraphQL schema
const getSchema = function ({ definitions, bulkOptions }) {
  if (cache.exists({ rootDef: definitions, type: 'schema', key: 'top' })) {
    return cache.get({ rootDef: definitions, type: 'schema', key: 'top' });
  }

  const rootDef = getRootDefinition({ definitions, bulkOptions });

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const topLevelSchema = Object.keys(rootDef).reduce((memo, name) => {
    const def = rootDef[name];
    memo[name] = getType({ def, rootDef });
    return memo;
  }, {});

  const rootSchema = new GraphQLSchema(topLevelSchema);
  cache.set({ rootDef: definitions, type: 'schema', key: 'top', value: rootSchema });
  return rootSchema;
};

// Retrieve a top-level definition, using a type name
const findModel = function ({ def, rootDef }) {
  const modelName = def.modelName;
  if (!modelName) { return; }
  // Flattens root definition
  const models = Object.keys(rootDef).reduce((memo, name) => {
    Object.assign(memo, rootDef[name].properties);
    return memo;
  }, {});
  const correctName = Object.keys(models).find(name => {
    return models[name].modelName === modelName;
  });
  return models[correctName];
};


// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function ({ def, rootDef }) {
  // Dones so that children can get a cached reference of parent type, while avoiding infinite recursion
  if (cache.exists({ key: def, rootDef, type: 'field' })) {
    return cache.get({ key: def, rootDef, type: 'field' });
  }

  // Extract modifiers-specific information from defintion
  const isRequired = def.required;

  // Pass array items definition to `graphQLFieldsInfo`, not array itself
  const isArray = def.items !== undefined;
  const unwrappedDef = isArray ? def.items : def;

  // If a top-level type exists, uses its definition, instead of the sub-definition
  const topDef = findModel({ def: unwrappedDef, rootDef });
  const isTopDef = topDef !== undefined;
  const actualDef = isTopDef ? topDef : unwrappedDef;

  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => {
    return possibleType.condition({ isArray, isRequired, isTopDef, def: actualDef });
  });
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  const field = fieldInfo.value({ def: actualDef, rootDef });
  field.description = actualDef.description;

  cache.set({ key: def, rootDef, type: 'field', value: field });
  return field;
};

// Retrieves the GraphQL type for a given IDL definition
const getType = function ({ def, rootDef }) {
  return getField({ def, rootDef }).type;
};

// Like `getType`, but modifies current definition
// Goal is to avoid infinite recursion, i.e. without modification the same graphQLFieldsInfo would be hit again
const getModifiedType = function ({ def, rootDef, attributes }) {
  const modifiedDef = Object.assign({}, def, attributes);
  return getType({ def: modifiedDef, rootDef });
};

const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};

// Like `graphQLFieldsInfo` but for top-level operations
const graphQLOperationsFieldsInfo = [

  {
    condition: ({ isArray, isTopDef }) => isArray && isTopDef,
    value({ def, rootDef }) {
      const subType = getModifiedType({ def, rootDef, attributes: { modelName: '' } });
      const type = new GraphQLList(subType);
      return {
        type,
        args: {
          id: {
            type: GraphQLInt,
            description: 'id to look at',
            defaultValue: 10
          },
        },
        //description: `Fetches information about a list of ${getPluralName(def)}`,
        async resolve(_, args, { callback }) {
          // TODO: fix this
          const operation = operations[1];
          return await executeOperation({ operation, args, callback });
        },
      };
    },
  },

  {
    condition: ({ isTopDef }) => isTopDef,
    value({ def, rootDef }) {
      const type = getModifiedType({ def, rootDef, attributes: { modelName: '' } });
      return {
        type,
        //description: `Fetches information about a ${getSingularName(def)}`,
        async resolve(_, args, { callback }) {
          // TODO: fix this
          const operation = operations[0];
          return await executeOperation({ operation, args, callback });
        },
      };
    },
  },

];

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters:
 *   - required modifier comes first
 *   - array modifier comes next
 *   - top-level types must come before normal types
 * Some types modifies the current definition, to avoid infinite recursion, i.e. being hit again on next loop
 */
const graphQLFieldsInfo = [

  {
    condition: ({ isRequired }) => isRequired,
    value({ def, rootDef }) {
      const subType = getModifiedType({ def, rootDef, attributes: { required: false } });
      const type = new GraphQLNonNull(subType);
      return { type };
    },
  },

  ...graphQLOperationsFieldsInfo,

  {
    condition: ({ isArray }) => isArray,
    value({ def, rootDef }) {
      const type = new GraphQLList(getType({ def, rootDef }));
      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'object',
    value({ def, rootDef }) {
      let name = getTypeName(def);
      // Cannot create two GraphQL object types with the same name
      // Fix it by appending underscores to the name
      // TODO: either prefix with top-level model name, or throw exception, or some other better solution
      while (cache.exists({ key: name, rootDef, type: 'typename' })) {
        name += '_';
      }
      cache.set({ key: name, rootDef, type: 'typename', value: true });

      const type = new GraphQLObjectType({
        name,
        description: def.description,

        // This needs to be function, otherwise we run in an infinite recursion,
        // if the children try to reference a parent type
        fields() {
          return Object.keys(def.properties).reduce((fields, attrName) => {
            const childDef = def.properties[attrName];
            fields[attrName] = getField({ def: childDef, rootDef });
            return fields;
          }, {});
        },
      });

      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'integer' && def.format === 'id',
    value() {
      const type = GraphQLID;
      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'integer',
    value() {
      const type = GraphQLInt;
      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'number',
    value() {
      const type = GraphQLFloat;
      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'string',
    value() {
      const type = GraphQLString;
      return { type };
    },
  },

  {
    condition: ({ def }) => def.type === 'boolean',
    value() {
      const type = GraphQLBoolean;
      return { type };
    },
  },

];


// Returns def.name
const getDefinitionName = function (def) {
  const name = def.name;
  if (!name) {
    throw new EngineError(`Missing "name" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  return name;
};

// Returns def.name, in plural form, lowercased, e.g. `pets`, for findMany queries
const getPluralName = function (def) {
  const name = getDefinitionName(def);
  return plural(name).toLowerCase();
};

// Returns def.name, in plural form, lowercased, e.g. `pet`, for findOne queries
const getSingularName = function (def) {
  const name = getDefinitionName(def);
  return singular(name).toLowerCase();
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getPluralOperationName = function (def, operation) {
  const name = getPluralName(def);
  return camelize(`${operation} ${name}`);
};

// Returns operation name, camelized, in singular form, e.g. `findPet` or `deletePet`
const getSingularOperationName = function (def, operation) {
  const name = getSingularName(def);
  return camelize(`${operation} ${name}`);
};

// Returns def.name, titleized, e.g. `Pet`, for schema type name
const getTypeName = function (def) {
  const name = getDefinitionName(def);
  return titleize(singular(name));
};

const printSchema = function () {
  const schema = getSchema();
  return graphQLPrintSchema(schema);
};


// General key-value cache, specific for each root IDL definition
const cache = {

  _data: {},

  getBase({ rootDef, type }) {
    const rootDefId = JSON.stringify(rootDef);
    if (!this._data[rootDefId]) {
      this._data[rootDefId] = {};
    }
    const data = this._data[rootDefId];

    if (!data[type]) {
      data[type] = {};
    }
    return data[type];
  },

  get({ rootDef, type, key }) {
    const keyId = JSON.stringify(key);
    const data = this.getBase({ rootDef, type });
    return data[keyId];
  },

  exists({ rootDef, type, key }) {
    return this.get({ rootDef, type, key }) != null;
  },

  set({ rootDef, type, key, value }) {
    const keyId = JSON.stringify(key);
    const data = this.getBase({ rootDef, type });
    data[keyId] = value;
  },

};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};