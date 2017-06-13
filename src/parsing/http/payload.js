'use strict';


const bodyParser = require('body-parser');
const { promisify } = require('util');

const { assignObject } = require('../../utilities');


// Retrieves all parsers
const getParsers = function () {
  return parsers
    .map(({ type, exportsType = type, opts }) => {
      const parser = promisify(bodyParser[type](opts));
      const boundParseFunc = parseFunc.bind(null, parser);
      return { [exportsType]: boundParseFunc };
    })
    .reduce(assignObject, {});
};

const parsers = [
  {
    type: 'text',
    exportsType: 'graphql',
    opts: { type: 'application/graphql' },
  },
  { type: 'json' },
  {
    type: 'urlencoded',
    opts: { extended: true },
  },
  { type: 'text' },
  { type: 'raw' },
];

// Parses and serializes HTTP request payload
// Handles HTTP compression
// Max limit 100KB
// Recognizes: application/json, application/x-www-form-urlencoded,
// string, binary
const parseFunc = async function (parser, { specific: { req } }) {
  // body-parser will fill req.body = {} even if there is no body.
  // We want to know if there is a body or not though,
  // so must keep req.body to undefined if there is none
  const previousBody = req.body = req.body || {};

  await parser(req, null);

  const body = req.body === previousBody ? undefined : req.body;

  // We just want the body, and will only do this once,
  // so let's not pollute req
  delete req.body;
  delete req._body;

  return body;
};

const parse = getParsers();

const hasPayload = function ({ specific: { req: { headers } } }) {
  return Number(headers['content-length']) > 0
    || headers['transfer-encoding'] !== undefined;
};


module.exports = {
  payload: {
    parse,
    hasPayload,
  },
};
