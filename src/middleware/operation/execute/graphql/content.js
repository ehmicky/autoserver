'use strict';

const { getGraphQLInput } = require('./input');
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
  mInput: { idl: { GraphQLSchema: schema }, queryVars, payload, goal },
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

  const data = await handleQuery({
    queryDocument,
    operationName,
    goal,
    variables,
    nextLayer,
    responses,
    mInput,
  });

  return { data };
};

// Executes GraphQL request
const handleQuery = async function ({
  queryDocument,
  operationName,
  goal,
  variables,
  nextLayer,
  responses,
  mInput,
}) {
  const actions = parse({ queryDocument, operationName, goal, variables });

  const actionsA = await fireResolvers({
    actions,
    nextLayer,
    responses,
    mInput,
  });

  const actionsB = selectFields({ actions: actionsA });

  const actionsC = assemble({ actions: actionsB });
  return actionsC;
};

module.exports = {
  getContent,
};
