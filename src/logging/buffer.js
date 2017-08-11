'use strict';

const { reportLog } = require('./report');

// If we want to delay log calls before logInfo is not fully known yet
// (e.g. in the middle of a request), we can use this method to buffer those
// calls and attach them to the return value `obj`, until a function makes
// the actual calls
const bufferLogReport = function (obj, logReport) {
  const { logReports = [] } = obj;
  const logReportsA = [...logReports, logReport];
  return { ...obj, logReports: logReportsA };
};

const unbufferLogReports = async function (obj, log) {
  const { logReports = [] } = obj;

  const promises = logReports.map(({ type, level, message, info }) =>
    reportLog({ log, type, level, message, info })
  );
  await Promise.all(promises);

  return { ...obj, logReports: [] };
};

module.exports = {
  bufferLogReport,
  unbufferLogReports,
};
