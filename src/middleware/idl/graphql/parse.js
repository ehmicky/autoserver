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
const { plural, singular } = require('pluralize');

const { EngineError } = require('../../../error');


// Returns GraphQL root schema
const getSchema = function () {
  const querySchema = getQuerySchema();
  const rootSchema = new GraphQLSchema({
    query: querySchema,
  });
  return rootSchema;
};

// Returns GraphQL root query schema
const getQuerySchema = function () {
  const idl = getIdl();
  const fields = getQueryFields({ idl });
  const querySchema = new GraphQLObjectType({
    name: 'Query',
    fields,
    description: 'Fetches information about the different entities',
  });
  return querySchema;
};

// Retrieve IDL definition
// TODO: make it non-static
const getIdl = function () {
  return require('../../../example.json');
};

const findTopSchema = function (type) {
  const idl = getIdl();
  return idl.find(topSchema => topSchema.type === type);
};

// Iterate over IDL definition, to add top-level operations for each type
const getQueryFields = function ({ idl }) {
  return idl.reduce((fields, schema) => {
    const field = getQueryField({ schema });
    Object.assign(fields, field);
    return fields;
  }, {});
};

// Get top-level operations for a given field
const getQueryField = function ({ schema }) {
  return Object.keys(operations).reduce((fields, operationName) => {
    const getOperation = operations[operationName];
    const newOperation = getOperation({ schema });
    if (!newOperation) { return fields; }
    Object.assign(fields, newOperation);
    return fields;
  }, {});
};

// Generic CRUD operations
const operations = {

  // Adds findOne operation, e.g. `pet`
  findOne({ schema }) {
    const name = getSingularName(schema);
    const operation = getFullType(schema);
    return {
      [name]: operation,
    };
  },

  // Adds findMany operation, e.g. `pets`
  findMany({ schema }) {
    const name = getPluralName(schema);
    const arraySchema = { type: 'array', items: schema };
    const operation = getFullType(arraySchema);
    return {
      [name]: operation,
    };
  },

};

const getFullType = function (schema) {
  const resolverInfo = getGraphqlResolverInfo(schema);
  const type = getGraphqlType(schema);
  return Object.assign({}, resolverInfo, { type });
};

// Retrieves the GraphQL resolver info (resolve function, arguments, description, etc.) for a given IDL schema
const getGraphqlResolverInfo = function (schema) {
  const type = schemaToGraphqlMap.types.find(possibleType => possibleType.condition(schema));
  if (!type) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${schema}`, { reason: 'GRAPHQL_WRONG_SCHEMA' });
  }

  if (!type.resolverInfo) { return {}; }

  const typeInfo = type.resolverInfo(schema);
  return typeInfo;
};

// Retrieves the GraphQL type (any type) for a given IDL schema
const getGraphqlType = function (schema) {
  const correctType = schemaToGraphqlMap.types.find(possibleType => possibleType.condition(schema));
  if (!correctType) {
    throw new EngineError(`Could not parse property into a GraphQL type: ${schema}`, { reason: 'GRAPHQL_WRONG_SCHEMA' });
  }

  const type = correctType.type(schema);
  return type;
};

// Retrieves the GraphQL type (objects only) for a given IDL schema
const cachedTypes = {};
const getObjectType = function (schema) {
  const name = getTypeName(schema);
  if (cachedTypes[name]) { return cachedTypes[name]; }

  // Must be done before iterating over children
  // So that children can get a cached reference of parent type, to avoid infinite recursion
  const description = schema.description || `${name} entity`;
  const entityType = new GraphQLObjectType({ name, description });
  cachedTypes[name] = entityType;

  const allFields = Object.keys(schema.properties).reduce((fields, attrName) => {
    const childSchema = schema.properties[attrName];
    fields[attrName] = getFullType(childSchema);
    return fields;
  }, {});

  entityType._typeConfig.fields = allFields;

  return entityType;
};

const schemaToGraphqlMap = {

  types: [

    {
      condition: schema => schema.required,
      type(schema) {
        const optionalSchema = Object.assign({}, schema, { required: false });
        const SubType = getGraphqlType(optionalSchema);
        return new GraphQLNonNull(SubType);
      },
    },

    {
      condition: schema => schema.type === 'array' && schema.items && !findTopSchema(schema.items.type),
      type: (schema) => new GraphQLList(getGraphqlType(schema.items)),
    },

    {
      condition: schema => findTopSchema(schema.type),
      type: schema => {
        const actualSchema = findTopSchema(schema.type);
        return getObjectType(actualSchema);
      },
      resolverInfo: schema => {
        const actualSchema = findTopSchema(schema.type);
        return {
          //description: `Fetches information about a ${getSingularName(schema)}`,
          async resolve(/* parent, args, context, info */) {
            return await { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' };
          },
        };
      },
    },

    {
      condition: schema => schema.type === 'array' && schema.items && findTopSchema(schema.items.type),
      type: schema => {
        const actualSchema = findTopSchema(schema.items.type);
        return new GraphQLList(getObjectType(actualSchema));
      },
      resolverInfo: schema => {
        const actualSchema = findTopSchema(schema.items.type);
        return {
          //description: `Fetches information about a list of ${getPluralName(schema)}`,
          async resolve(/* parent, args, context, info */) {
            return await [
              { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' },
              { id: 2, name: 'Cat', photo_urls: ['http://cat.com/photo/1', 'http://cat.com/photo/2'], tags: ['even more adorable'], status: 'grumpy' },
              { id: 3, name: 'Koala', photo_urls: ['http://koala.com/photo/1'], tags: ['suspended'], status: 'sleepy' },
            ];
          },
        };
      },
    },

    {
      condition: schema => schema.type === 'object',
      type: schema => getObjectType(schema),
    },

    {
      condition: schema => schema.type === 'integer' && schema.format === 'id',
      type: () => GraphQLID,
    },

    {
      condition: schema => schema.type === 'integer',
      type: () => GraphQLInt,
    },

    {
      condition: schema => schema.type === 'number',
      type: () => GraphQLFloat,
    },

    {
      condition: schema => schema.type === 'string',
      type: () => GraphQLString,
    },

    {
      condition: schema => schema.type === 'boolean',
      type: () => GraphQLBoolean,
    },

  ],
};

// Returns schema.name
const getSchemaName = function (schema) {
  const name = schema.name;
  if (!name) {
    throw new EngineError(`Missing "name" key in schema ${JSON.stringify(schema)}`, { reason: 'GRAPHQL_WRONG_SCHEMA' });
  }
  return name;
};

// Returns schema.name, in plural form, e.g. `pets`, for findMany queries
const getPluralName = function (schema) {
  const name = getSchemaName(schema);
  return plural(name).toLowerCase();
};

// Returns schema.name, in plural form, e.g. `pet`, for findOne queries
const getSingularName = function (schema) {
  const name = getSchemaName(schema);
  return singular(name).toLowerCase();
};

// Returns schema.name, in titleized form, e.g. `Pet`, for schema type name
const getTypeName = function (schema) {
  const name = getSchemaName(schema);
  return titleize(singular(name));
};

const printSchema = function () {
  const schema = getSchema();
  return graphQLPrintSchema(schema);
};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};