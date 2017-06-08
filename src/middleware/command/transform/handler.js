'use strict';


const { getTransformsMap } = require('./map');
const { applyTransforms } = require('./transformer');


/**
 * Applies schema `transform`
 * Those are mapping functions applies on input for a particular attribute.
 * They can be any static value or JSL.
 * Note: transforms do not have to be idempotent.
 * Transforms format:
 *   - value {any} - same as { value: value }
 *   - options {object}:
 *      - value {(jsl|any)} - value to transform to.
 *        Can use JSL, including $ and $$.
 *      - [test] {(jsl|bool)} - if false, the transform is not applied
 *        Note that without `test`, $ can be undefined in `value`.
 *      - [using] {str|str[]} - list of attribute names that one desires to
 *        use as $$.ATTRIBUTE in either `value` or `test`
 **/
const handleTransforms = function ({ idl, startupLog }) {
  const perf = startupLog.perf.start('command.handleTransforms', 'middleware');
  const transformsMap = getTransformsMap({ idl });
  perf.stop();

  return async function handleTransforms(input) {
    const { args, modelName, log, jsl } = input;
    const { data } = args;
    const perf = log.perf.start('command.handleTransforms', 'middleware');

    if (data) {
      const transforms = transformsMap[modelName];
      args.data = data instanceof Array
        ? data.map(datum => applyTransforms({ data: datum, transforms, jsl }))
        : applyTransforms({ data, transforms, jsl });
    }

    perf.stop();
    const response = await this.next(input);
    return response;
  };
};


module.exports = {
  handleTransforms,
};
