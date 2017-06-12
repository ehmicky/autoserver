'use strict';


const { getMethod } = require('./method');
const { getQueryVars } = require('./query');
const { getHeaders } = require('./headers');
const { getPayload } = require('./payload');


/**
 * Fill in request parameters, which can be:
 *   - goal
 *   - query variables
 *   - URL variables
 *   - payload
 *   - headers
 * Are set in a protocol-agnostic format.
 * Generally-speaking:
 *   - goal, query variables, URL variables and payload:
 *      - meant to be the main input of the operation layer, which will
 *        convert them into actions and actions's arguments, according to
 *        operation-specific logic.
 *        E.g. GraphQL uses payload or query variable for the action and
 *        arguments, and does not use goal nor URL variables.
 *        While REST uses payload for args.data, query variables and
 *        URL variables for other arguments, and goal for action.
 *      - their format, syntax and valid names are set by the system only,
 *        i.e. cannot be customized by user.
 *   - non-namespaced headers:
 *      - converted to protocolArgs by protocol layer, operation-independant
 *        protocolArgs are modifications applied to each action, including
 *        adding arguments.
 *      - a non-protocol-specific header exists for each of them,
 *        but redundant protocol-specific headers might exist.
 *        E.g. protocol-agnostic header 'X-No-Output' creates arg.no_output
 *        but HTTP header Prefer: return=minimal achieves the same for
 *        HTTP protocol.
 *   - namespaced headers:
 *      - i.e. namespaced by projectName (deg: 'x-api-engine-*').
 *      - semantics are defined by user, not system.
 *      - passed along to all next layers, e.g. as JSL parameter $PARAMS.
 **/
const fillParams = function (opts) {
  const { projectName } = opts;

  return async function fillParams(input) {
    const { specific, jsl, protocol, log } = input;
    const perf = log.perf.start('protocol.fillParams', 'middleware');

    const { goal, method } = getMethod({ specific, protocol });
    const queryVars = getQueryVars({ specific, protocol });
    const { params, headers } = getHeaders({ specific, protocol, projectName });
    const payload = await getPayload({ specific, protocol, headers });

    const newJsl = jsl.add({ $PARAMS: params });

    log.add({
      goal,
      method,
      queryVars,
      headers,
      params,
      payload,
    });
    Object.assign(input, {
      goal,
      method,
      queryVars,
      headers,
      params,
      payload,
      jsl: newJsl,
    });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  fillParams,
};
