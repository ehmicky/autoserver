'use strict';


const { dasherize } = require('underscore.string');

const { transtype, map, assignObject } = require('../../utilities');


// Fill in `input.params`, which are custom application-specific information,
// defined by the library user, not by the API engine.
// They can be defined:
//  - in headers, namespaced, e.g. 'X-ProjectName-PARAM',
//    using `serverOpts.projectName`
//  - in query string, using `params.PARAM`
// Are set to JSL param $PARAMS
const parseParams = function (opts) {
  const { projectName } = opts;
  const headersNamespace = `x-${dasherize(projectName)}-`;
  // We don't need to RegExp-escape since `headersNamespace` only contains
  // ASCII letters, numbers and dashes
  const appHeaderRegex = new RegExp(`^${headersNamespace}`);

  return async function parseParams(input) {
    const { jsl, log } = input;
    const perf = log.perf.start('protocol.parseParams', 'middleware');

    const params = getParams({ input, appHeaderRegex });

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
