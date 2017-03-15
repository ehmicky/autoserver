'use strict';


const http = require('http');

const { appHeaders: appHeadersParams, body, queryString } = require('./params');


const protocolHandler = async function (req, res) {
  if (!(req instanceof http.IncomingMessage)) { return req; }

  const protocol = `HTTP${req.httpVersion}`;
  const url = req.url;
  const headers = req.headers;

  const method = req.method;
  const route = req.route;

  // Does not differentiate from where the input is from (query variables, body, headers)
  // so the next layer can be protocol-agnostic

  // Query variables
  const queryVars = queryString.parse(req.url);

  // JSON request body
  const jsonBodyVars = await body.parse.json(req);

  // x-www-form-urlencoded request body
  const urlencodedBodyVars = await body.parse.urlencoded(req);

  // string request body
  let textBodyVars = await body.parse.text(req);
  if (typeof textBodyVars !== 'string') { textBodyVars = null; }

  // binary request body
  let rawBodyVars = await body.parse.raw(req);
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
  const appHeaders = appHeadersParams.parse(req);

  const params = Object.assign({}, queryVars, bodyVars, appHeaders);

  const request = {
    protocol,
    url,
    headers,

    method,
    route,
    params,
  };

  let { type, content: response } = await this.next(request);
  if (response && type) {
    if (type === 'application/json') {
      response = body.serialize.json({ res, message: response });
    } else if (type === 'text/html') {
      response = body.serialize.html({ res, message: response });
    }
  }

  return response;
};


module.exports = {
  protocolHandler,
};