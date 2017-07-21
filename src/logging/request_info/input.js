'use strict';

const reduceInput = function (requestInfo, loggerFilter) {
  setQueryVars(requestInfo, loggerFilter);
  setHeaders(requestInfo, loggerFilter);
  setParams(requestInfo, loggerFilter);
  setSettings(requestInfo, loggerFilter);
};

const setQueryVars = function (requestInfo, loggerFilter) {
  const { queryVars } = requestInfo;
  if (!queryVars || queryVars.constructor !== Object) { return; }
  requestInfo.queryVars = loggerFilter.queryVars(queryVars);
};

const setHeaders = function (requestInfo, loggerFilter) {
  const { headers } = requestInfo;
  if (!headers || headers.constructor !== Object) { return; }
  requestInfo.headers = loggerFilter.headers(headers);
};

const setParams = function (requestInfo, loggerFilter) {
  const { params } = requestInfo;
  if (!params || params.constructor !== Object) { return; }
  requestInfo.params = loggerFilter.params(params);
};

const setSettings = function (requestInfo, loggerFilter) {
  const { settings } = requestInfo;
  if (!settings || settings.constructor !== Object) { return; }
  requestInfo.settings = loggerFilter.settings(settings);
};

module.exports = {
  reduceInput,
};
