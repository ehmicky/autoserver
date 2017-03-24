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
const merge = require('lodash/merge');
const { plural, singular } = require('pluralize');
const uuidv4 = require('uuid/v4');

const { EngineError } = require('../../../error');


// Validate IDL definition
// Also performs some transformation, e.g. adding default values
// TODO: use JSON schema validation|transformation instead
// TODO: move all validation into this method
const validateIdlDefinition = function (obj) {
  const modelTypes = Object.keys(obj.models).map(key => obj.models[key].type);
  validateModelsDefinition(obj.models, { modelTypes });
  return obj;
};

const validateModelsDefinition = function (obj, { modelTypes }) {
  if (typeof obj !== 'object') { return obj; }

  Object.keys(obj).forEach(attrName => {
    const child = obj[attrName];
    if (typeof child === 'object') {
      // TODO: should detect whether child _could_ have `type` instead (i.e. is a JSON schema), as we want `type` to be optional
      // Adds def.title default value, by using parent property name
      if (child.type && !child.title) {
        child.title = attrName;
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

  const rootDef = {
    query: {
      title: 'Query',
      type: 'object',
      description: 'Fetches information about different entities',
      properties: safeProperties,
    },
    mutation: {
      title: 'Mutation',
      type: 'object',
      description: 'Modifies information about different entities',
      properties: unsafeProperties,
    },
  };

  return rootDef;
};

const getOperationDefinitions = function({ models, operations }) {
  return operations.reduce((memo, operation) => {
    const props = getOperationDefinition({ models, operation });
    // Make a deep copy for each definition object
    // Otherwise, each definition would refer each other, which would create some problems
    const copiedProps = merge({}, props);
    Object.assign(memo, copiedProps);
    return memo;
  }, {});
};

const getOperationDefinition = function ({ models, operation }) {
  return Object.keys(models).reduce((properties, modelName) => {
    const model = models[modelName];
    const name = model.title || modelName;
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

// Retrieves all root model definitions, so that recursive sub-models can point to them
const getModels = function (rootDef) {
  return Object.keys(rootDef).reduce((memo, name) => {
    const props = rootDef[name].properties;
    const subProps = Object.keys(props).reduce((memo,val) => {
      if (typeof props[val] !== 'object') { return memo; }
      return memo.concat(props[val]);
    }, []);
    return memo.concat(subProps);
  }, []);
};


// Returns GraphQL schema
const getSchema = function ({ definitions, bulkOptions }) {
  // Deep copy, so we do not modify input
  definitions = merge({}, definitions);

  const rootDef = getRootDefinition({ definitions, bulkOptions });
  const schemaId = uuidv4();
  const models = getModels(rootDef);

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const topLevelSchema = Object.keys(rootDef).reduce((memo, name) => {
    const def = rootDef[name];
    memo[name] = getType(def, { schemaId, models });
    return memo;
  }, {});

  const rootSchema = new GraphQLSchema(topLevelSchema);
  return rootSchema;
};


// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  // When top-level model enters this function, `def.operation` will be defined.
  // This passed the operation to all sub-schemas, so that resolvers know the current operation
  const operation = def.operation || opts.operation;
  opts = Object.assign({}, opts, { operation });

  // Done so that children can get a cached reference of parent type, while avoiding infinite recursion
  // Only cache schemas that have a model name, because they are the only one that can recurse
  // Namespace by operation, because operations can have slightly different types
  const modelName = def.modelName;
  const key = modelName && `field/${opts.schemaId}/${modelName}/${operation}`;
  if (key && cache.exists(key)) {
    return cache.get(key);
  }

  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => possibleType.condition(def));
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  // Retrieves field information
  const field = fieldInfo.value(def, opts);

  if (key) {
    cache.set(key, field);
  }
  return field;
};

// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  return getField(def, opts).type;
};

/**
 * Maps an IDL definition into a GraphQL field information, including type
 * The first matching one will be used, i.e. order matters: required modifier, then array modifier come first
 */
const graphQLFieldsInfo = [

  {
    condition: def => def.required,
    value(def, opts) {
      // Goal is to avoid infinite recursion, i.e. without modification the same graphQLFieldsInfo would be hit again
      const modifiedDef = Object.assign({}, def, { required: false });
      const subType = getType(modifiedDef, opts);
      const type = new GraphQLNonNull(subType);
      const description = def.description || (def.items && def.items.description);
      return { type, description };
    },
  },

  {
    condition: def => def.type === 'array' && typeof def.items === 'object',
    value(def, opts) {
      const subDef = def.items;
      const subType = getType(subDef, opts);
      const type = new GraphQLList(subType);
      const description = subDef.description;
      const fieldInfo = { type, description };

      // If this is a top-level model, assign resolver
      if (subDef.modelName) {
        Object.assign(fieldInfo, {
          args: {
            id: {
              type: GraphQLInt,
              description: 'id to look at',
              defaultValue: 10
            },
          },
          async resolve(_, args, { callback }) {
            const operation = operations.find(op => op.prefix === opts.operation && op.multiple);
            return await executeOperation({ operation, args, callback });
          },
        });
      }

      return fieldInfo;
    },
  },

  {
    condition: def => def.type === 'object',
    value(initialDef, opts) {
      // If this definition points to a top-level model, use that model instead
      const topDef = opts.models.find(model => initialDef.modelName
        && model.modelName === initialDef.modelName
        && opts.operation === model.operation);
      const def = topDef || initialDef;

      let name = getTypeName(def, opts.operation);
      const description = def.description;

      const type = new GraphQLObjectType({
        name,
        description,

        // This needs to be function, otherwise we run in an infinite recursion,
        // if the children try to reference a parent type
        fields() {
          return Object.keys(def.properties).reduce((fields, attrName) => {
            const childDef = def.properties[attrName];
            // Recurse over children
            fields[attrName] = getField(childDef, opts);
            return fields;
          }, {});
        },
      });

      let fieldInfo = { type, description };

      // If this is a top-level model, assign resolver
      if (initialDef.modelName) {
        Object.assign(fieldInfo, {
          //description: `Fetches information about a ${getSingularName(def)}`,
          async resolve(_, args, { callback }) {
            const operation = operations.find(op => op.prefix === opts.operation && !op.multiple);
            return await executeOperation({ operation, args, callback });
          },
        });
      }

      return fieldInfo;
    },
  },

  {
    condition: def => def.type === 'integer' && def.format === 'id',
    value(def) {
      const type = GraphQLID;
      const description = def.description;
      return { type, description };
    },
  },

  {
    condition: def => def.type === 'integer',
    value(def) {
      const type = GraphQLInt;
      const description = def.description;
      return { type, description };
    },
  },

  {
    condition: def => def.type === 'number',
    value(def) {
      const type = GraphQLFloat;
      const description = def.description;
      return { type, description };
    },
  },

  {
    condition: def => def.type === 'string',
    value(def) {
      const type = GraphQLString;
      const description = def.description;
      return { type, description };
    },
  },

  {
    condition: def => def.type === 'boolean',
    value(def) {
      const type = GraphQLBoolean;
      const description = def.description;
      return { type, description };
    },
  },

];

const executeOperation = async function ({ operation, args = {}, callback }) {
  const response = await callback({ operation, args });
  return response;
};


// Returns def.title
const getDefinitionName = function (def) {
  const name = def.title;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  return name;
};

// Returns def.title, in plural form, lowercased, e.g. `pets`, for findMany queries
const getPluralName = function (def) {
  const name = getDefinitionName(def);
  return plural(name).toLowerCase();
};

// Returns def.title, in plural form, lowercased, e.g. `pet`, for findOne queries
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

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function (def, operation = '') {
  const name = getSingularName(def);
  return camelize(`${titleize(operation)} ${name}`);
};

const printSchema = function (schema) {
  return graphQLPrintSchema(schema);
};


// General key-value cache, specific for each root IDL definition
const cache = {

  _data: {},

  get(key) {
    return this._data[key];
  },

  exists(key) {
    return this.get(key) != null;
  },

  set(key, value) {
    this._data[key] = value;
  },

};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};