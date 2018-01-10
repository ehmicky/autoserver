'use strict';

const mergeSelectRename = function ({ selectRename, name }) {
  const values = selectRename
    .map(({ [name]: value }) => value)
    .filter(value => value !== undefined);
  if (values.length === 0) { return; }

  const valuesA = values.join(',');
  return valuesA;
};

module.exports = {
  mergeSelectRename,
};
