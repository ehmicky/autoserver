'use strict';

const getTransformedResponse = function ({
  input: { action, operation },
  response,
}) {
  const newResponse = Object.assign({}, response, { action });
  const transformedResponse = actionConvertorOutput[operation](newResponse);
  return transformedResponse;
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  GraphQL (response) {
    const { data, metadata } = response;
    const newData = getGraphQLData({ data, metadata });
    const newReponse = Object.assign({}, response, { data: newData });
    return newReponse;
  },

};

const getGraphQLData = function ({ data, metadata }) {
  if (Array.isArray(data)) {
    return data.map((datum, index) =>
      getGraphQLData({ data: datum, metadata: metadata[index] })
    );
  }

  const newData = Object.assign({}, data, { __metadata: metadata });
  return newData;
};

module.exports = {
  getTransformedResponse,
};
