'use strict';


const { getMethod } = require('./method');
const { getQueryVars } = require('./query');
const { getHeaders } = require('./headers');
const { getPayload } = require('./payload');


/**
 * Parameters can be:
 *   - method
 *   - query variables
 *   - URL variables
 *   - payload
 *   - headers
 * Are set in a protocol-agnostic format.
 * Generally-speaking:
 *   - method, query variables, URL variables and payload:
 *      - meant to be the main input of the interface layer, which will
 *        convert them into actions and actions's arguments, according to
 *        interface-specific logic.
 *        E.g. GraphQL uses payload or query variable for the action and
 *        arguments, and does not use method nor URL variables.
 *        While REST uses payload for args.data, query variables and
 *        URL variables for other arguments, and method for action.
 *      - their format, syntax and valid names are set by the system only,
 *        i.e. cannot be customized by user.
 *   - non-namespaced headers:
 *      - converted to protocolArgs by protocol layer, interface-independant
 *        protocolArgs are modifications applied to each action, including
 *        adding arguments.
 *      - a non-protocol-specific header exists for each of them,
 *        but redundant protocol-specific headers might exist.
 *        E.g. protocol-agnostic header 'X-No-Output' creates arg.no_output
 *        but HTTP method HEAD and HTTP header Prefer: return=minimal
 *        achieve the same for HTTP protocol.
 *   - namespaced headers:
 *      - i.e. namespaced by projectName (deg: 'x-api-engine-*').
 *      - semantics are defined by user, not system.
 *      - passed along to all next layers, e.g. as JSL parameter PARAMS.
 **/
const httpFillParams = function ({ projectName }) {
  return async function ({ specific: { req } }) {
    const { method, protocolMethod } = getMethod({ req });
    const queryVars = getQueryVars({ req });
    const { headers, params } = getHeaders({ req, projectName });
    const payload = await getPayload({ req, headers });

    return { method, protocolMethod, queryVars, headers, params, payload };
  };
};


module.exports = {
  httpFillParams,
};
