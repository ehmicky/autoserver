'use strict';

/**
 * Parses and serializes HTTP request body
 * Handles HTTP compression
 * Max limit 100KB
 * Recognizes: application/json, application/x-www-form-urlencoded, string, binary
 **/


const bodyParser = require('body-parser');

const { connectToPromise } = require('../../utilities');


const parse = {};

const addParseFunc = function ({ type, exportsType = type, options = {} } = {}) {
  const parser = connectToPromise(bodyParser[type](options));
  parse[exportsType] = async function (req) {
    // body-parser will fill req.body = {} even if there is no body.
    // We want to know if there is a body or not though, so must keep req.body to undefined if there is non
    const emptyBody = {};
    req.body = req.body || emptyBody;
    await parser(req);

    // We just want the body, and will only do this once, so let's not pollute req
    const body = req.body === emptyBody ? undefined : req.body;
    delete req.body;
    delete req._body;
    return body;
  };
};

const bodyParams = [
  { type: 'json' },
  { type: 'text' },
  { type: 'raw' },
  { type: 'urlencoded', exportsType: 'urlencoded', options: { extended: true } },
  { type: 'text', exportsType: 'graphql', options: { type: 'application/graphql' } },
];
for (const bodyParam of bodyParams) {
  addParseFunc(bodyParam);
}


const sendJson = function ({ res, message = {}, contentType = 'application/json' }) {
  message = JSON.stringify(message, null, 2);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', Buffer.byteLength(message));
  res.end(message);
  return message;
};

const sendHtml = function ({ res, message = '' }) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(message));
  res.end(message);
  return message;
};

const sendText = function ({ res, message = '' }) {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(message));
  res.end(message);
  return message;
};

const sendNoBody = function ({ res }) {
  res.end();
};


module.exports = {
  httpBody: {
    parse: parse,
    send: {
      json: sendJson,
      html: sendHtml,
      text: sendText,
      noBody: sendNoBody
    },
  },
};