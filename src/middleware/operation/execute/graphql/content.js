'use strict';

const { getGraphQLInput } = require('./input');
const { getResolver } = require('./resolver');
const {
  isIntrospectionQuery,
  handleIntrospection,
} = require('./introspection');
const { parse } = require('./parse');
const { fireResolvers } = require('./fire_resolver');
const { selectFields } = require('./select');
const { assemble } = require('./assemble');

const getContent = async function ({
  nextLayer,
  mInput,
  mInput: {
    idl: { shortcuts: { modelsMap }, GraphQLSchema: schema },
    queryVars,
    payload,
    goal,
  },
  responses,
}) {
  const {
    query,
    variables,
    operationName,
    queryDocument,
  } = getGraphQLInput({ queryVars, payload });

  // Introspection GraphQL query
  if (isIntrospectionQuery({ query })) {
    const content = await handleIntrospection({
      schema,
      queryDocument,
      variables,
      operationName,
    });
    return content;
  }

  // Normal GraphQL query
  const resolver = getResolver.bind(null, modelsMap);
  const cbFunc = fireNext.bind(null, {
    nextLayer,
    mInput,
    responses,
  });

  const data = await handleQuery({
    resolver,
    queryDocument,
    operationName,
    goal,
    variables,
    cbFunc,
  });

  return { data };
};

// Executes GraphQL request
const handleQuery = async function ({
  resolver,
  queryDocument,
  operationName,
  goal,
  cbFunc,
  variables,
}) {
  const actions = parse({ queryDocument, operationName, goal, variables });

  const actionsA = await fireResolvers({ actions, cbFunc, resolver });

  const actionsB = selectFields({ actions: actionsA });

  const actionsC = assemble({ actions: actionsB });
  return actionsC;
};

const fireNext = async function (
  { nextLayer, mInput, responses },
  actionInput,
) {
  const mInputA = { ...mInput, ...actionInput };

  const mInputB = await nextLayer(mInputA);

  // eslint-disable-next-line fp/no-mutating-methods
  responses.push(mInputB);

  return mInputB.response;
};

module.exports = {
  getContent,
};
