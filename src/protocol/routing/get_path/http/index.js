'use strict';


const httpGetPath = async function (input) {
  const { req: { url } } = input;
  // Remove search string and hash
  const path = url.replace(/\?.*/, '');

  const output = Object.assign({}, input, { path });
  const response = await this.next(output);
  return response;
};


module.exports = {
  httpGetPath,
};