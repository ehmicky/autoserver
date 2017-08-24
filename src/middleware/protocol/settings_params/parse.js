'use strict';

const { mapKeys, pickBy } = require('../../../utilities');

// Retrieves settings|params
const getValues = function ({ mInput, type, type: { getSpecificValues } }) {
  const genericValues = getGenericValues({ mInput, type });
  const specificValues = getSpecificValues ? getSpecificValues({ mInput }) : {};
  return { ...genericValues, ...specificValues };
};

const getGenericValues = function ({ mInput, type }) {
  const queryValues = getQueryValues({ mInput, type });
  const headersValues = getHeadersValues({ mInput, type });
  return { ...queryValues, ...headersValues };
};

// Retrieves ?settings.mysettings or params.myparams query variables
const getQueryValues = function ({
  mInput: { queryVars },
  type: { queryVarName },
}) {
  return queryVars[queryVarName];
};

// Filters headers with only the headers whose name starts
// with X-Api-Engine-Param-Myparam or X-Api-Engine-My-Settings
const getHeadersValues = function ({
  mInput: { headers },
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
