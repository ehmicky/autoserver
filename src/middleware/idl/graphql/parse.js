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
const { merge, values, mapValues, forEach } = require('lodash');
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../error');
const { GeneralCache } = require('../../../utilities');


const getIdlModels = function (obj) {
  // Deep copy, so we do not modify input
  obj = merge({}, obj);
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

  forEach(obj, (child, attrName) => {
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


// Retrieve models for a given method
const getModelsByMethod = function (methodName, { allModels, bulkWrite, bulkDelete }) {
  // All operations (e.g. "createUser", etc.) for that method (e.g. "query")
  const methodOperations = operations.filter(operation => operation.method === methodName
    && !(!bulkWrite && operation.isBulkWrite)
    && !(!bulkDelete && operation.isBulkDelete));
  const models = methodOperations.reduce((methodModels, operation) => {
    const operationModels = getModelsByOperation(operation, { allModels });
    return methodModels.concat(operationModels);
  }, []);
  return models;
};

// Retrieve models for a given operation
const getModelsByOperation = function (operation, { allModels }) {
  return allModels.map(model => {
    // Deep copy
    model = merge({}, model);

    // `find*` operations are aliased for convenience
    // E.g. `findPet` and `findPets` -> `pet` and `pets`
    const operationName = operation.prefix === 'find' ?
      getDefinitionName(model, { asPlural: operation.multiple }) :
      getOperationName(model, operation.prefix, { asPlural: operation.multiple });

    if (operation.multiple) {
      model = { type: 'array', items: model };
    }

    Object.assign(model, {
      // E.g. 'findPet', used as GraphQL field name
      operationName,
      // E.g. 'find'
      operation: operation.prefix,
    });

    return model;
  }, []);
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
const getSchema = function (definitions, opts) {
  const allModels = getIdlModels(definitions);
  // Each schema gets its own cache instance, to avoid leaking
  const cache = new GeneralCache();

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const schemaFields = mapValues(rootDef, (def, methodName) => {
    const typeOpts = Object.assign({ cache, allModels, methodName, isMethod: true }, opts);
    return getType(def, typeOpts);
  });

  const schema = new GraphQLSchema(schemaFields);
  return schema;
};

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


// Retrieves the GraphQL type for a given IDL definition
const getType = function (def, opts) {
  return getField(def, opts).type;
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

      const name = getTypeName(def);
      const description = def.description;

      // Retrieve the top-level operations
      const methodModels = getModelsByMethod(opts.methodName, opts);

      const fields = methodModels.reduce((fields, model) => {
        // Pass current operation down to sub-fields
        const operation = model.operation;
        // Keep models as options, so that sub-models can point to them, but only for current operation
        const operationsModels = methodModels.filter(methodModel => methodModel.operation === operation);
        opts = Object.assign({}, opts, { operation, operationsModels });

        fields[model.operationName] = getField(model, opts);
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
    value(def, opts) {
      // If this definition points to a top-level model, use that model instead
      const operationsModels = opts.operationsModels;
      if (def.model && operationsModels) {
        def = operationsModels.find(operationsModel => operationsModel.model === def.model) || def;
      }

      const name = getTypeName(def, opts.operation);
      const description = def.description;

      const type = new GraphQLObjectType({
        name,
        description,

        // This needs to be function, otherwise we run in an infinite recursion,
        // if the children try to reference a parent type
        fields() {
          // Recurse over children
          return mapValues(def.properties, childDef => getField(childDef, opts));
        },
      });

      let fieldInfo = { type, description };

      // If this is a top-level model, assign resolver
      if (def.model) {
        Object.assign(fieldInfo, {
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


// Returns def.title, in plural|singular form, lowercased, e.g. `pets|pet`, for findMany|findOne operation
const getDefinitionName = function (def, { asPlural = true } = {}) {
  const name = def.title;
  if (!name) {
    throw new EngineError(`Missing "title" key in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  if (typeof def.title !== 'string') {
    throw new EngineError(`"title" must be a string in definition ${JSON.stringify(def)}`, { reason: 'GRAPHQL_WRONG_DEFINITION' });
  }
  const pluralizedName = asPlural ? plural(name) : singular(name);
  return pluralizedName.toLowerCase();
};

// Returns operation name, camelized, in plural form, e.g. `findPets` or `deletePets`
const getOperationName = function (def, operation, { asPlural = true } = {}) {
  const name = getDefinitionName(def, { asPlural });
  return camelize(`${operation} ${name}`);
};

// Returns def.title, titleized with operation prepended, in singular form, e.g. `FindPet`, for schema type name
const getTypeName = function (def, operation = '') {
  const name = getDefinitionName(def, { asPlural: false });
  return camelize(`${titleize(operation)} ${titleize(name)}`);
};

const printSchema = function (schema) {
  return graphQLPrintSchema(schema);
};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};