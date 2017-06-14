'use strict';


const { transtype, map, assignObject } = require('../../utilities');


// Fill in `input.params`, which are custom application-specific information,
// defined by the library user, not by the API engine.
// They can be defined:
//  - in headers, namespaced, i.e. 'X-ApiEngine-Param-PARAM'
//  - in query string, using `params.PARAM`
// Values are automatically transtyped.
// Are set to JSL param $PARAMS
const parseParams = function () {
  return async function parseParams(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.parseParams', 'middleware');

    const params = getParams({ input });

    const newJsl = jsl.add({ $PARAMS: params });

    log.add({ params });
    Object.assign(input, { params, jsl: newJsl });

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};

const getParams = function ({ input: { headers }, appHeaderRegex }) {
  // Filters headers with only the headers whose name starts with X-NAMESPACE-
  const params = Object.entries(headers)
    .filter(([name]) => appHeaderRegex.test(name))
    .map(([name, value]) => {
      const shortName = name.replace(appHeaderRegex, '');
      return { [shortName]: value };
    })
    .reduce(assignObject, {});

  const transtypedParams = map(params, value => transtype(value));

  return transtypedParams;
};


module.exports = {
  parseParams,
};
