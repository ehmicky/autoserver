'use strict';

const { readFile } = require('fs');
const { promisify } = require('util');

const { render } = require('mustache');

const renderTemplate = async function ({ template, data }) {
  const htmlFile = await promisify(readFile)(template, { encoding: 'utf-8' });
  const htmlString = render(htmlFile, data);
  return htmlString;
};

module.exports = {
  renderTemplate,
};
