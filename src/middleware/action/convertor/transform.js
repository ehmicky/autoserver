'use strict';

const getTransformedResponse = function ({
  input: { action },
  response,
  operation,
}) {
  const responseA = Object.assign({}, response, { action });
  const responseB = actionConvertorOutput[operation](responseA);
  return responseB;
};

const actionConvertorOutput = {

  // Metadata are siblings to data in GraphQL
  GraphQL (response) {
    const { data, metadata } = response;
    const dataA = getGraphQLData({ data, metadata });
    return Object.assign({}, response, { data: dataA });
  },

};

const getGraphQLData = function ({ data, metadata }) {
  if (Array.isArray(data)) {
    return data.map((datum, index) =>
      getGraphQLData({ data: datum, metadata: metadata[index] })
    );
  }

  return Object.assign({}, data, { __metadata: metadata });
};

module.exports = {
  getTransformedResponse,
};
