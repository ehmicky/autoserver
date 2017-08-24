'use strict';

const { resolve } = require('path');

const { addErrorHandler } = require('../../../../error');
const { mapValues, renderTemplate } = require('../../../../utilities');

const template = resolve(__dirname, './graphiql.mustache');

// Returns HTML document loading a GraphQL debugger
// TODO: replace with graphiql-workspace
// TODO: do not use CDN
// TODO: do proper web app setup, not all-in-one HTML file
//
// @param {object} options
// @param {string} options.endpointURL - the relative or absolute URL for
// the endpoint which GraphiQL will make queries to
// @param {string} [options.query] - the GraphQL query to pre-fill
// @param {object|json} [options.variables] - variables to pre-fill
// @param {string} [options.operationName] - the operationName to pre-fill
// @param {string} [options.result] - the result of the query to pre-fill
//
// @returns {string} document - HTML document
const renderGraphiQL = function (input) {
  // Those must be valid JavaScript, so must JSON-stringified
  const dataToEscape = getDataToEscape(input);
  // Those must be valid HTML
  const dataNotToEscape = {};
  const data = { ...escapeData(dataToEscape), ...dataNotToEscape };

  return renderTemplate({ template, data });
};

const eRenderGraphiQL = addErrorHandler(renderGraphiQL, {
  message: 'Could not render GraphiQL HTML document',
  reason: 'GRAPHIQL_PARSING_ERROR',
});

const getDataToEscape = function (input) {
  return {
    endpointURL: input.endpointURL,
    query: input.query || '',
    variables: input.variables || '',
    operationName: input.operationName || '',
  };
};

const escapeData = function (dataToEscape) {
  return mapValues(dataToEscape, data => escapeJSON(data));
};

const escapeJSON = function (string = null) {
  return JSON.stringify(string, null, 2);
};

module.exports = {
  renderGraphiQL: eRenderGraphiQL,
};
