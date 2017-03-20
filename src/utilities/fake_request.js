'use strict';


const http = require('http');

const console = require('./console');


const fakeRequest = function ({ host = 'localhost', port = 5001 } = {}) {
  const method = 'GET';
  const query = '';
  const path = `/graphql?${query}`;
  const body = JSON.stringify({
    query: `{
      pet {
        name
        best_friend {
          name
          photo_urls
        }
      }
    }`,
  });
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Accept': 'application/json',
  };

  http
    .request({
      method,
      host,
      port,
      path,
      headers,
    }, responseHandler)
    .end(body);
};

const responseHandler = function (res) {
  console.log(`Response: ${res.statusCode}`);

  res.setEncoding('utf-8');
  let response = '';
  res.on('data', chunk => response += chunk);
  res.on('end', () => {
    try {
      let data = JSON.parse(response);
      console.log(data);
    } catch (e) {
      console.log(e.message);
    }
  });
};


module.exports = {
  fakeRequest,
};
