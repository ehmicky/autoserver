'use strict';


const { promisify } = require('util');


// Sends response
const send = async function ({
  specific: { res },
  content,
  contentType,
  status,
}) {
  if (status) {
    res.statusCode = status;
  }
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(content));
  await promisify(res.end.bind(res))(content);
  return content;
};

const sendJson = async function ({
  specific,
  content = {},
  contentType = 'application/json',
  status,
}) {
  content = JSON.stringify(content, null, 2);
  return await send({ specific, content, contentType, status });
};

const sendHtml = async function ({
  specific,
  content = '',
  contentType = 'text/html',
  status,
}) {
  return await send({ specific, content, contentType, status });
};

const sendText = async function ({
  specific,
  content = '',
  contentType = 'text/plain',
  status,
}) {
  return await send({ specific, content, contentType, status });
};

const sendNothing = async function ({ specific: { res } }) {
  await promisify(res.end.bind(res))();
};



module.exports = {
  send: {
    json: sendJson,
    html: sendHtml,
    text: sendText,
    nothing: sendNothing
  },
};
