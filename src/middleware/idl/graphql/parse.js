'use strict';


const idl = require('../../../example.json');
const { EngineError } = require('../../../error');

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


const getSchema = function () {
  const querySchema = getQuerySchema();
  const rootSchema = new GraphQLSchema({
    query: querySchema,
  });
  return rootSchema;
};

const getQuerySchema = function () {
  const allFields = idl.reduce((fields, schema) => {
    fields[normalizedAttrPluralName(schema)] = getFindAllSchema(schema, idl);
    fields[normalizedAttrSingularName(schema)] = getFindOneSchema(schema, idl);
    return fields;
  }, {});
  const querySchema = new GraphQLObjectType({
    name: 'Query',
    fields: allFields,
  });
  return querySchema;
};

const getFindAllSchema = function (schema, idl) {
  const findAllSchema = {
    type: new GraphQLList(getObjectType(schema, idl)),
    async resolve(/* parent, args, context, info */) {
      return await [
        { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' },
        { id: 2, name: 'Cat', photo_urls: ['http://cat.com/photo/1', 'http://cat.com/photo/2'], tags: ['even more adorable'], status: 'grumpy' },
        { id: 3, name: 'Koala', photo_urls: ['http://koala.com/photo/1'], tags: ['suspended'], status: 'sleepy' },
      ];
    },
  };
  return findAllSchema;
};

const getFindOneSchema = function (schema, idl) {
  const findOneSchema = {
    type: getObjectType(schema, idl),
    async resolve(/* parent, args, context, info */) {
      return await { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' };
    },
  };
  return findOneSchema;
};

const cachedTypes = {};
const getObjectType = function (schema, idl) {
  const name = normalizedTypeName(schema);
  if (cachedTypes[name]) { return cachedTypes[name]; }

  // Must be done before iterating over children
  // So that children can get a cached reference of parent type, to avoid infinite recursion
  const entityType = new GraphQLObjectType({
    name,
  });
  cachedTypes[name] = entityType;

  const allFields = Object.keys(schema.properties).reduce((fields, attrName) => {
    const properties = schema.properties[attrName];

    fields[attrName] = getGraphqlType(properties, idl);
    if (properties.description) {
      fields[attrName].description = properties.description;

    }
    return fields;
  }, {});

  entityType._typeConfig.fields = allFields;

  return entityType;
};

const getGraphqlType = function (schema, idl) {
  const correctType = schemaToGraphqlMap.types.find(type => type.condition(schema, idl));
  if (correctType) {
    return correctType.value(schema, idl);
  } else {
    throw new EngineError(`Could not parse property into a GraphQL type: ${schema}`, { reason: 'GRAPHQL_WRONG_SCHEMA' });
  }
};

const findTopSchema = function (idl, type) {
  return idl.find(topSchema => topSchema.type === type);
};

const schemaToGraphqlMap = {
  types: [
    {
      condition: schema => schema.required,
      value(schema, idl) {
        const optionalSchema = Object.assign({}, schema, { required: false });
        const SubType = getGraphqlType(optionalSchema, idl).type;
        return { type: new GraphQLNonNull(SubType) };
      },
    },
    {
      condition: (schema, idl) => findTopSchema(idl, schema.type),
      value: (schema, idl) => getFindOneSchema(findTopSchema(idl, schema.type), idl),
    },
    {
      condition: schema => schema.type === 'object',
      value: (schema, idl) => ({ type: getObjectType(schema, idl) }),
    },
    {
      condition: (schema, idl) => schema.type === 'array' && schema.items && findTopSchema(idl, schema.items.type),
      value: (schema, idl) => getFindAllSchema(findTopSchema(idl, schema.items.type), idl),
    },
    {
      condition: (schema, idl) => schema.type === 'array' && schema.items && !findTopSchema(idl, schema.items.type),
      value(schema, idl) {
        const SubType = getGraphqlType(schema.items, idl).type;
        return { type: new GraphQLList(SubType) };
      },
    },
    {
      condition: schema => schema.type === 'integer' && schema.format === 'id',
      value: () => ({ type: GraphQLID }),
    },
    {
      condition: schema => schema.type === 'integer',
      value: () => ({ type: GraphQLInt }),
    },
    {
      condition: schema => schema.type === 'number',
      value: () => ({ type: GraphQLFloat }),
    },
    {
      condition: schema => schema.type === 'string',
      value: () => ({ type: GraphQLString }),
    },
    {
      condition: schema => schema.type === 'boolean',
      value: () => ({ type: GraphQLBoolean }),
    },
  ],
};

const missingNameError = function (schema) {
  throw new EngineError(`Missing "name" key in schema ${JSON.stringify(schema)}`, { reason: 'GRAPHQL_WRONG_SCHEMA' });
};

const normalizedAttrPluralName = function (schema) {
  const name = schema.name;
  name || missingNameError(schema);
  return `${name.toLowerCase()}s`;
};

const normalizedAttrSingularName = function (schema) {
  const name = schema.name;
  name || missingNameError(schema);
  return name.toLowerCase();
};

const normalizedTypeName = function (schema) {
  const name = schema.name;
  name || missingNameError(schema);
  return name.toLowerCase().replace(/^./, char => char.toUpperCase());
};

const printSchema = function () {
  const schema = getSchema();
  return graphQLPrintSchema(schema);
};


module.exports = {
  graphqlGetSchema: getSchema,
  graphqlPrintSchema: printSchema,
};