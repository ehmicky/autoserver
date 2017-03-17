'use strict';


const http = require('http');

const { httpAppHeaders, httpBody, httpQueryString } = require('../../parsing');


const getParams = async function (input) {
  const { req, route } = input;
  if (!(req instanceof http.IncomingMessage)) { return req; }

  const protocol = `HTTP${req.httpVersion}`;
  const url = req.url;
  const headers = req.headers;

  const method = req.method;

  // Does not differentiate from where the input is from (query variables, body, headers)
  // so the next layer can be protocol-agnostic

  // Query variables
  const queryVars = httpQueryString.parse(req.url);

  // JSON request body
  const jsonBodyVars = await httpBody.parse.json(req);

  // x-www-form-urlencoded request body
  const urlencodedBodyVars = await httpBody.parse.urlencoded(req);

  // string request body
  let textBodyVars = await httpBody.parse.text(req);
  if (typeof textBodyVars !== 'string') { textBodyVars = null; }

  // binary request body
  let rawBodyVars = await httpBody.parse.raw(req);
  rawBodyVars = rawBodyVars instanceof Buffer ? rawBodyVars.toString() : null;

  const bodyVars = Object.assign(
    {},
    jsonBodyVars,
    urlencodedBodyVars
  );
  const rawBody = textBodyVars || rawBodyVars;
  if (rawBody) {
    // Use symbols to avoid collisions, e.g. if user supplies a parameter called `raw`
    bodyVars[Symbol.for('raw')] = rawBody;
  }

  // Namespaced HTTP headers
  const appHeaders = httpAppHeaders.parse(req);

  const params = Object.assign({}, queryVars, bodyVars, appHeaders);

  const request = {
    protocol,
    url,
    headers,

    method,
    route,
    params,
  };

  const response = await this.next(request);
  return response;
};


module.exports = {
  httpGetParams: getParams,
};