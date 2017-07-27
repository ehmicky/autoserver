'use strict';

const { render } = require('mustache');

const { pReadFile } = require('./promise');

const renderTemplate = async function ({ template, data }) {
  const htmlFile = await pReadFile(template, { encoding: 'utf-8' });
  const htmlString = render(htmlFile, data);
  return htmlString;
};

module.exports = {
  renderTemplate,
};
