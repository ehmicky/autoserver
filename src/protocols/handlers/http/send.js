'use strict';

// Sends response
const send = function ({
  specific,
  specific: { res },
  content,
  contentType,
  protocolStatus,
}) {
  if (protocolStatus) {
    // eslint-disable-next-line no-param-reassign, fp/no-mutation
    res.statusCode = protocolStatus;
  }

  if (contentType) {
    res.setHeader('Content-Type', contentType);
  }

  if (content) {
    res.setHeader('Content-Length', Buffer.byteLength(content));
  }

  res.end(content);

  return specific;
};

const sendJson = function ({
  specific,
  content = {},
  contentType = 'application/json',
  protocolStatus,
}) {
  const contentA = JSON.stringify(content, null, 2);
  return send({ specific, content: contentA, contentType, protocolStatus });
};

const sendHtml = function ({
  specific,
  content = '',
  contentType = 'text/html',
  protocolStatus,
}) {
  return send({ specific, content, contentType, protocolStatus });
};

const sendText = function ({
  specific,
  content = '',
  contentType = 'text/plain',
  protocolStatus,
}) {
  return send({ specific, content, contentType, protocolStatus });
};

// This function is special because it might be fired very early during the
// request, i.e. when responseSend middleware has not been reached yet.
// This will be fired to make sure socket does not hang.
const sendNothing = function ({
  specific,
  specific: { res } = {},
  protocolStatus,
}) {
  // `specific` might be undefined, if initial input was wrong.
  if (!res) { return; }

  // However, we are not sure a response has already been sent or not,
  // so we must check to avoid double responses
  if (res.finished) { return; }

  return send({ specific, protocolStatus });
};

module.exports = {
  send: {
    json: sendJson,
    html: sendHtml,
    text: sendText,
    nothing: sendNothing,
  },
};
