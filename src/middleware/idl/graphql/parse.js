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


// Retrieve IDL definition
// TODO: make it non-static
// TODO: cache
const getIdlDefinition = function () {
  const def = require('../../../example.json');
  const validatedDef = validateIdlDefinition(def);
  return validatedDef;
};

// Validate IDL definition
// Also performs some transformation, e.g. adding default values
// TODO: use JSON schema validation|transformation instead
// TODO: move all validation into this method
const validateIdlDefinition = function (obj) {
  if (typeof obj !== 'object') { return obj; }

  return Object.keys(obj).reduce((memo, attrName) => {
    let child = obj[attrName];
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
    }
    // Recurse over children
    memo[attrName] = validateIdlDefinition(child);
    return memo;
  }, {});
};


// TODO: cache
const getRootDefinition = function () {
  const models = getIdlDefinition().models;
  const properties = Object.keys(models).reduce((props, modelName) => {
    const model = models[modelName];
    const name = model.name || modelName;
    const operation = 'find';
    const def = Object.assign({}, model, { operation, name });

    const findOne = getSingularName(def);
    props[findOne] = def;
    const findOneAlias = getSingularOperationName(def, def.operation);
    props[findOneAlias] = def;

    const findMany = getPluralName(def);
    props[findMany] = { type: 'array', items: def };
    const findManyAlias = getPluralOperationName(def, def.operation);
    props[findManyAlias] = { type: 'array', items: def };
    return props;
  }, {});

  return {
    query: {
      name: 'Query',
      type: 'object',
      description: 'Fetches information about the different entities',
      properties,
    },
  };
};


// Retrieve a top-level definition, using a type name
const findModel = function ({ type, rootDef }) {
  // Flattens root definition
  const models = Object.keys(rootDef).reduce((memo, name) => {
    Object.assign(memo, rootDef[name].properties);
    return memo;
  }, {});
  const name = Object.keys(models).find(modelName => {
    const model = models[modelName];
    return model && model.type === type;
  });
  return models[name];
};


// Returns GraphQL schema
const getSchema = function () {
  const rootDef = getRootDefinition();

  if (cache.exists({ rootDef, type: 'schema', key: 'top' })) {
    return cache.get({ rootDef, type: 'schema', key: 'top' });
  }

  // Apply `getType` to each top-level operation, i.e. Query and Mutation
  const topLevelSchema = Object.keys(rootDef).reduce((memo, name) => {
    const def = rootDef[name];
    memo[name] = getType({ def, rootDef });
    return memo;
  }, {});

  const rootSchema = new GraphQLSchema(topLevelSchema);
  cache.set({ rootDef, type: 'schema', key: 'top', value: rootSchema });
  return rootSchema;
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
  const topDef = findModel({ type: unwrappedDef.type, rootDef });
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

  {
    condition: ({ isArray, isTopDef }) => isArray && isTopDef,
    value({ def, rootDef }) {
      const subType = getModifiedType({ def, rootDef, attributes: { type: 'object' } });
      const type = new GraphQLList(subType);
      return {
        type,
        //description: `Fetches information about a list of ${getPluralName(def)}`,
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
    condition: ({ isTopDef }) => isTopDef,
    value({ def, rootDef }) {
      const type = getModifiedType({ def, rootDef, attributes: { type: 'object' } });
      return {
        type,
        //description: `Fetches information about a ${getSingularName(def)}`,
        async resolve(/* parent, args, context, info */) {
          return await { id: 1, name: 'Dog', photo_urls: ['http://dog.com/photo/1', 'http://dog.com/photo/2'], tags: ['adorable'], status: 'happy' };
        },
      };
    },
  },

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

        // description: def.description || `${name} entity`,

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