'use strict';

const { emitEvent } = require('./emit');

// If we want to delay events before logInfo is not fully known yet
// (e.g. in the middle of a request), we can use this method to buffer those
// calls and attach them to the return value `obj`, until a function makes
// the actual calls
const bufferEventReport = function (obj, eventReport) {
  const { eventReports = [] } = obj;
  const eventReportsA = [...eventReports, eventReport];
  return { ...obj, eventReports: eventReportsA };
};

const unbufferEventReports = async function (obj, log) {
  const { eventReports = [] } = obj;

  const promises = eventReports.map(
    eventReport => emitEvent({ log, ...eventReport }),
  );
  await Promise.all(promises);

  return { ...obj, eventReports: [] };
};

module.exports = {
  bufferEventReport,
  unbufferEventReports,
};
