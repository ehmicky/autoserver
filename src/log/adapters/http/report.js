import { Buffer } from 'node:buffer'
import { request } from 'node:http'

import rawBody from 'raw-body'

const { byteLength } = Buffer

// Report log with a HTTP request
// TODO: use a proper HTTP request library
export const report = ({ log, opts: { method = 'POST', ...opts } }) => {
  const methodA = method.toUpperCase()

  const body = JSON.stringify(log)

  const req = getRequest({ method: methodA, body, ...opts })

  // eslint-disable-next-line promise/avoid-new
  const promise = new Promise((resolve, reject) => {
    reqToPromise({ req, resolve, reject })
  })

  req.end(body)

  return promise
}

const getRequest = ({ method, body, hostname, port, auth, path }) => {
  const headers = getHeaders({ body })

  const req = request({
    method,
    hostname,
    port,
    auth,
    path,
    headers,
    timeout: TIMEOUT,
  })
  return req
}

const TIMEOUT = 5e3

const getHeaders = ({ body }) => ({
  'Content-Type': 'application/json',
  'Content-Length': byteLength(body),
})

const reqToPromise = ({ req, resolve, reject }) => {
  req.on('response', (res) => responseHandler({ res, resolve, reject }))

  req.on('error', reject)
}

const responseHandler = async ({ res, resolve, reject }) => {
  const isSuccess = String(res.statusCode).startsWith('2')

  if (isSuccess) {
    resolve()
  }

  const response = await rawBody(res, 'utf8')
  const responseA = JSON.stringify(response)
  reject(responseA)
}
