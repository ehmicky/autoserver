'use strict';

/**
 * Parses and serializes HTTP request body
 * Handles HTTP compression
 * Max limit 100KB
 * Recognizes: application/json, application/x-www-form-urlencoded, string, binary
 **/


const bodyParser = require('body-parser');

const connectToPromise = require('../../utilities/connect_to_promise');


const parse = {};

const addParseFunc = function ({ type, exportsType = type, options = {} } = {}) {
  const parser = connectToPromise(bodyParser[type](options));
  parse[exportsType] = async function (req) {
    await parser(req);

    // We just want the body, and will only do this once, so let's not pollute req
    const body = req.body;
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
];
for (const bodyParam of bodyParams) {
  addParseFunc(bodyParam);
}


const serialize = {};

serialize.json = function ({ res, message }) {
  res.setHeader('Content-Type', 'application/json');
  message = JSON.stringify(message);
  res.setHeader('Content-Length', Buffer.byteLength(message));
  res.end(message);
  return message;
};

serialize.html = function ({ res, message }) {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(message));
  res.end(message);
  return message;
};


module.exports = {
  parse,
  serialize,
};