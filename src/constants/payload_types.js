'use strict';

const PAYLOAD_TYPES = [
  {
    type: 'json',
    title: 'JSON',
    mime: ['application/json', '+json'],
    // JSON specification also allows UTF-32, but iconv-lite does not support it
    charsets: ['utf-8', 'utf-16', 'utf-16be', 'utf-16le'],
  },
  {
    type: 'urlencoded',
    title: 'URL encoded',
    mime: ['application/x-www-form-urlencoded'],
    charsets: ['utf-8'],
  },
  {
    type: 'text',
    title: 'plain text',
    mime: ['text/plain'],
  },
  {
    type: 'raw',
    title: 'binary',
    mime: ['application/octet-stream'],
    defaultCharset: 'binary',
  },
];

module.exports = {
  PAYLOAD_TYPES,
};
