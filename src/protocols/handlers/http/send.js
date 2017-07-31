'use strict';

const { promisify } = require('util');

// Sends response
const send = async function ({
  specific,
  specific: { res },
  content,
  contentType,
  status,
}) {
  if (status) {
    // eslint-disable-next-line no-param-reassign
    res.statusCode = status;
  }

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(content));

  await promisify(res.end.bind(res))(content);

  return specific;
};

const sendJson = function ({
  specific,
  content = {},
  contentType = 'application/json',
  status,
}) {
  const contentString = JSON.stringify(content, null, 2);
  return send({ specific, content: contentString, contentType, status });
};

const sendHtml = function ({
  specific,
  content = '',
  contentType = 'text/html',
  status,
}) {
  return send({ specific, content, contentType, status });
};

const sendText = function ({
  specific,
  content = '',
  contentType = 'text/plain',
  status,
}) {
  return send({ specific, content, contentType, status });
};

// This function is special because it might be fired very early during the
// request, i.e. when responseSend middleware has not been reached yet.
// This will be fired to make sure socket does not hang.
const sendNothing = async function ({
  specific,
  specific: { res } = {},
  status,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  if (status) {
    // eslint-disable-next-line no-param-reassign
    res.statusCode = status;
  }

  await promisify(res.end.bind(res))();

  return specific;
};

module.exports = {
  send: {
    json: sendJson,
    html: sendHtml,
    text: sendText,
    nothing: sendNothing,
  },
};
