'use strict';

const { GraphQLNonNull, GraphQLString } = require('graphql');

const { getArgTypeDescription } = require('../../../../description');

// `id` argument
const getIdArgument = function (def) {
  const hasId = ID_COMMAND_TYPES.includes(def.command);
  if (!hasId) { return {}; }

  const description = getArgTypeDescription(def, 'argId');

  const args = getIdArgs({ description });
  return args;
};

const ID_COMMAND_TYPES = ['find', 'delete', 'patch'];

const getIdArgs = ({ description }) => ({
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description,
  },
});

module.exports = {
  getIdArgument,
};
