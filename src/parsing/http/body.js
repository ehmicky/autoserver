'use strict';

/**
 * Parses and serializes HTTP request body
 * Handles HTTP compression
 * Max limit 100KB
 * Recognizes: application/json, application/x-www-form-urlencoded,
 * string, binary
 **/

const bodyParser = require('body-parser');
const { promisify } = require('util');


const parse = {};

const addParseFunc = function ({
  type,
  exportsType = type,
  options = {},
} = {}) {
  const parser = promisify(bodyParser[type](options));
  parse[exportsType] = async function ({ specific: { req } }) {
    // body-parser will fill req.body = {} even if there is no body.
    // We want to know if there is a body or not though,
    // so must keep req.body to undefined if there is non
    const emptyBody = {};
    req.body = req.body || emptyBody;
    await parser(req, null);

    // We just want the body, and will only do this once,
    // so let's not pollute req
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
  {
    type: 'urlencoded',
    exportsType: 'urlencoded',
    options: { extended: true },
  },
  {
    type: 'text',
    exportsType: 'graphql',
    options: { type: 'application/graphql' },
  },
];
for (const bodyParam of bodyParams) {
  addParseFunc(bodyParam);
}

const hasPayload = function ({ specific: { req: { headers } } }) {
  return Number(headers['content-length']) > 0
    || headers['transfer-encoding'] !== undefined;
};


module.exports = {
  body: {
    parse: parse,
    hasPayload,
  },
};
