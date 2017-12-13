'use strict';

const { request, METHODS } = require('http');
const { URL } = require('url');

const rawBody = require('raw-body');

const { throwError, addGenErrorHandler } = require('../../../error');

// Report log with a HTTP request
// TODO: use a proper HTTP request library
const report = function ({ log, opts: { url, method = 'POST' } }) {
  const methodA = method.toUpperCase();

  validateOpts({ url, method: methodA });

  const body = JSON.stringify(log);

  const req = getRequest({ url, method: methodA, body });

  // eslint-disable-next-line promise/avoid-new
  const promise = new Promise((resolve, reject) =>
    reqToPromise({ req, resolve, reject }));

  req.end(body);

  return promise;
};

const validateOpts = function ({ url, method }) {
  if (url === undefined) {
    const message = `Option 'url' for the log provider 'http' must be defined`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }

  if (!METHODS.includes(method)) {
    const message = `Option 'method' for the log provider 'http' must be a valid HTTP method`;
    throwError(message, { reason: 'CONF_VALIDATION' });
  }
};

const getRequest = function ({ url, method, body }) {
  const { hostname, port, auth, path } = eParseUrl({ url });

  const headers = getHeaders({ body });

  const req = request({
    method,
    hostname,
    port,
    auth,
    path,
    headers,
    timeout: TIMEOUT,
  });
  return req;
};

const TIMEOUT = 5e3;

const parseUrl = function ({ url }) {
  const {
    hostname,
    port,
    auth,
    pathname = '',
    search = '',
    hash = '',
  } = new URL(url);
  const path = `${pathname}${search}${hash}`;

  return { hostname, port, auth, path };
};

const eParseUrl = addGenErrorHandler(parseUrl, {
  message: 'Option \'url\' for the log provider \'http\' must be a valid URL',
  reason: 'CONF_VALIDATION',
});

const getHeaders = function ({ body }) {
  return {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  };
};

const reqToPromise = function ({ req, resolve, reject }) {
  req.on('response', res => responseHandler({ res, resolve, reject }));

  req.on('error', reject);
};

const responseHandler = async function ({ res, resolve, reject }) {
  const isSuccess = String(res.statusCode).startsWith('2');
  if (isSuccess) { resolve(); }

  const response = await rawBody(res, 'utf-8');
  const responseA = JSON.stringify(response);
  reject(responseA);
};

module.exports = {
  report,
};
