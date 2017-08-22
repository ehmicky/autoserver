'use strict';

// Transform response according to action-specific logic
const normalizeAction = function (input) {
  const { args, operation } = input;
  const inputA = normalizeResponse({ input, args, operation });
  return inputA;
};

const normalizeResponse = function ({
  input,
  input: { action, response },
  operation,
}) {
  const responseA = { ...response, action };
  const responseB = actionConvertorOutput[operation](responseA);
  return { ...input, response: responseB };
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  GraphQL (response) {
    const { data, metadata } = response;
    const dataA = getGraphQLData({ data, metadata });
    return { ...response, data: dataA };
  },

};

const getGraphQLData = function ({ data, metadata }) {
  if (Array.isArray(data)) {
    return data.map((datum, index) =>
      getGraphQLData({ data: datum, metadata: metadata[index] })
    );
  }

  return { ...data, __metadata: metadata };
};

module.exports = {
  normalizeAction,
};
