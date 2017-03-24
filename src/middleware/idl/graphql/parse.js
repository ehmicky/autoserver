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
const values = require('lodash/values');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../error');


const getIdlModels = function (obj) {
  const models = validateIdlDefinition(obj).models;
  // Transform from object to array, throwing away the property key
  return values(models);
};

// Validate IDL definition
// Also performs some transformation, e.g. adding default values
// TODO: use JSON schema validation|transformation instead
// TODO: move all validation into this method
const validateIdlDefinition = function (obj) {
  validateModelsDefinition(obj.models, { isTopLevel: true });
  return obj;
};

const validateModelsDefinition = function (obj, { isTopLevel }) {
  if (typeof obj !== 'object') { return obj; }

  Object.keys(obj).forEach(attrName => {
    const child = obj[attrName];

    // `model` must be the only attribute (unless top-level), as it will reference another schema
    if (child.model && !isTopLevel) {
      if (Object.keys(child).length > 1) {
        throw new EngineError(`The following definition should only have one keys ('model'): ${JSON.stringify(child)}`, {
          reason: 'IDL_WRONG_DEFINITION',
        });
      }
    }

    if (typeof child === 'object') {
      // TODO: should detect whether child _could_ have `type` instead (i.e. is a JSON schema), as we want `type` to be optional
      // Adds def.title default value, by using parent property name
      if (child.type && !child.title) {
        child.title = attrName;
      }
      // Definitions of type `object` must have valid `properties`
      if (child.type === 'object' && !child.model) {
        if (!child.properties || typeof child.properties !== 'object' || Object.keys(child.properties).length === 0) {
          throw new EngineError(`The following definition of type 'object' is missing 'properties': ${JSON.stringify(child)}`, {
            reason: 'IDL_WRONG_DEFINITION',
          });
        }
      }
    }

    // Recurse over children
    validateModelsDefinition(child, { isTopLevel: false });
  }, {});

  return obj;
};

// Retrieve top-level operations|models for a given method
const getModels = function ({ methodName, allModels, bulkOptions: { write: allowBulkWrite, delete: allowBulkDelete } }) {
  // All operations (e.g. "createUser", etc.) for that method (e.g. "query")
  const methodOperations = operations.filter(operation => operation.method === methodName
    && !(!allowBulkWrite && operation.isBulkWrite)
    && !(!allowBulkDelete && operation.isBulkDelete));
  const properties = methodOperations.reduce((memo, operation) => {
    const props = getOperationModels({ models: allModels, operation });
    Object.assign(memo, props);
    return memo;
  }, {});
  return properties;
};

const getOperationModels = function ({ models, operation }) {
  return models.reduce((operationModels, model) => {
    // Deep copy
    model = merge({}, model);
    // `find*` operations are aliased for convenience
    // E.g. `findPet` and `findPets` -> `pet` and `pets`
    const isFind = operation.prefix === 'find';
    // E.g. `updatePets` operation
    let operationName;
    if (operation.multiple) {
      operationName = isFind ? getPluralName(model) : getPluralOperationName(model, operation.prefix);
      operationModels[operationName] = { type: 'array', items: model };
    // E.g. `updatePet` operation
    } else {
      operationName = isFind ? getSingularName(model) : getSingularOperationName(model, operation.prefix);
      operationModels[operationName] = model;
    }

    operationModels[operationName].operation = operation.prefix;

    return operationModels;
  }, {});
};

/* eslint-disable no-multi-spaces */
const operations = [
  { name: 'findOne',      prefix: 'find',     method: 'query',    multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'findMany',     prefix: 'find',     method: 'query',    multiple: true,   isBulkWrite: false, isBulkDelete: false },
  { name: 'createOne',    prefix: 'create',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'createMany',   prefix: 'create',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'replaceOne',   prefix: 'replace',  method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'replaceMany',  prefix: 'replace',  method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'updateOne',    prefix: 'update',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'updateMany',   prefix: 'update',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'upsertOne',    prefix: 'upsert',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'upsertMany',   prefix: 'upsert',   method: 'mutation', multiple: true,   isBulkWrite: true,  isBulkDelete: false },
  { name: 'deleteOne',    prefix: 'delete',   method: 'mutation', multiple: false,  isBulkWrite: false, isBulkDelete: false },
  { name: 'deleteMany',   prefix: 'delete',   method: 'mutation', multiple: true,   isBulkWrite: false, isBulkDelete: true  },
];
/* eslint-enable no-multi-spaces */

// Returns GraphQL schema
const getSchema = function ({ definitions, bulkOptions }) {
  // Deep copy, so we do not modify input
  definitions = merge({}, definitions);

  // Each schema gets its own cache instance, to avoid leaking
  const cache = new GeneralCache();

  const rootDef = {
    query: {
      title: 'Query',
      type: 'object',
      description: 'Fetches information about different entities',
    },
    mutation: {
      title: 'Mutation',
      type: 'object',
      description: 'Modifies information about different entities',
    },
  };
  const allModels = getIdlModels(definitions);

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const topLevelSchema = Object.keys(rootDef).reduce((memo, name) => {
    const def = rootDef[name];
    memo[name] = getType(def, { cache, allModels, bulkOptions, methodName: name, isMethod: true });
    return memo;
  }, {});

  const rootSchema = new GraphQLSchema(topLevelSchema);
  return rootSchema;
};


// Retrieves a GraphQL field info for a given IDL definition, i.e. an object that can be passed to new GraphQLObjectType({ fields })
// Includes return type, resolve function, arguments, etc.
const getField = function (def, opts) {
  // Done so that children can get a cached reference of parent type, while avoiding infinite recursion
  // Only cache schemas that have a model name, because they are the only one that can recurse
  // Namespace by operation, because operations can have slightly different types
  const modelName = def.model;
  const key = modelName && `field/${modelName}/${opts.operation}`;
  if (key && opts.cache.exists(key)) {
    return opts.cache.get(key);
  }

  // Retrieves correct field
  const fieldInfo = graphQLFieldsInfo.find(possibleType => possibleType.condition(def, opts));
  if (!fieldInfo) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }

  // Retrieves field information
  const field = fieldInfo.value(def, opts);

  if (key) {
    opts.cache.set(key, field);
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
      if (subDef.model) {
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

  // Top-level method, e.g. 'Query' or 'Mutation'
  {
    condition: (_, { isMethod }) => isMethod,
    value(def, opts) {
      // Do this only at top-level
      opts.isMethod = false;

      let name = getTypeName(def);
      const description = def.description;

      // Retrieve the top-level operations
      const models = getModels(opts);
      opts = Object.assign({}, opts, { models, isMethod: false });

      const fields = Object.keys(models).reduce((fields, attrName) => {
        const model = models[attrName];
        // Pass current operation down to sub-fields
        const operation = model.operation;
        // Keep models as options, so that sub-models can point to them, but only for current operation
        opts = Object.assign({}, opts, { operation });
        fields[attrName] = getField(model, opts);
        return fields;
      }, {});

      const type = new GraphQLObjectType({
        name,
        description,
        fields,
      });

      const fieldInfo = { type, description };
      return fieldInfo;
    }
  },

  {
    condition: def => def.type === 'object',
    value(initialDef, opts) {
      let def = initialDef;
      const models = opts.models;
      if (models) {
        // If this definition points to a top-level model, use that model instead
        const topModelName = Object.keys(models).find(modelName => initialDef.model
          && models[modelName].model === initialDef.model
          && models[modelName].operation === opts.operation);
        if (topModelName) {
          def = opts.models[topModelName];
        }
      }

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
      if (initialDef.model) {
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
  return camelize(`${titleize(operation)} ${titleize(name)}`);
};

const printSchema = function (schema) {
  return graphQLPrintSchema(schema);
};


// General key-value cache, specific for each root IDL definition
class GeneralCache {

  constructor() {
    this._data = {};
  }

  get(key) {
    return this._data[key];
  }

  exists(key) {
    return this.get(key) != null;
  }

  set(key, value) {
    this._data[key] = value;
  }

};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};