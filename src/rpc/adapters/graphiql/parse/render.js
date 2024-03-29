import { mapValues } from '../../../../utils/functional/map.js'
import { renderTemplate } from '../../../../utils/template.js'

const TEMPLATE = new URL('graphiql.mustache', import.meta.url)

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
export const renderGraphiql = (input) => {
  // Those must be valid JavaScript, so must JSON-stringified
  const dataToEscape = getDataToEscape(input)
  // Those must be valid HTML
  const dataNotToEscape = {}
  const data = { ...escapeData(dataToEscape), ...dataNotToEscape }

  return renderTemplate({ template: TEMPLATE, data })
}

const getDataToEscape = ({
  endpointURL,
  query = '',
  variables = '',
  operationName = '',
}) => {
  const variablesA =
    typeof variables === 'object' ? JSON.stringify(variables) : variables
  return { endpointURL, query, variables: variablesA, operationName }
}

const escapeData = (dataToEscape) =>
  mapValues(dataToEscape, (data) => escapeJSON(data))

// eslint-disable-next-line unicorn/no-null
const escapeJSON = (string = null) => JSON.stringify(string, undefined, 2)
