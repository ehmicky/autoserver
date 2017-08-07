'use strict';

const { mapKeys, pickBy } = require('../../../utilities');

// Retrieves settings|params
const getValues = function ({ input, type, type: { getSpecificValues } }) {
  const genericValues = getGenericValues({ input, type });
  const specificValues = getSpecificValues ? getSpecificValues({ input }) : {};
  return { ...genericValues, ...specificValues };
};

const getGenericValues = function ({ input, type }) {
  const queryValues = getQueryValues({ input, type });
  const headersValues = getHeadersValues({ input, type });
  return { ...queryValues, ...headersValues };
};

// Retrieves ?settings.mysettings or params.myparams query variables
const getQueryValues = function ({
  input: { queryVars },
  type: { queryVarName },
}) {
  return queryVars[queryVarName];
};

// Filters headers with only the headers whose name starts
// with X-Api-Engine-Param-Myparam or X-Api-Engine-My-Settings
const getHeadersValues = function ({
  input: { headers },
  type: { headersTest, headersPrefix },
}) {
  const headersValues = pickBy(headers, (value, name) => headersTest({ name }));

  return mapKeys(headersValues, (header, name) =>
    name.replace(headersPrefix, '')
  );
};

module.exports = {
  getValues,
};
