'use strict';


const RefParser = require('json-schema-ref-parser');

const { getYaml } = require('./yaml');


/**
 * Dereference JSON references. RFC: https://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
 * I.e. { $ref: "path|url" } will be replaced by the target, which can be accessed locally (local path) or remotely (HTTP[S])
 * Targets can be JSON or YAML files.
 * Circular references are supported.
 * Siblings attributes to `$ref` will be merged (with higher priority), although this is not standard|spec behavior.
 * This method might throw for several reasons, e.g. YAML|JSON parsing error, cannot access remote|local file, etc.
 */
const dereferenceRefs = async function (obj) {
  return await RefParser.dereference(obj, {
    parse: {
      json: {
        allowEmpty: false,
      },
      yaml: {
        allowEmpty: false,
        // We need to override YAML parsing, as we use stricter YAML parsing (CORE_SCHEMA only)
        async parse({ data }) {
          if (Buffer.isBuffer(data)) {
            data = data.toString();
          }
          if (typeof data !== 'string') { return data; }
          // `content` cannot be `null` because of a bug with `json-schema-ref-parser`
          const content = await getYaml({ content: data }) || undefined;
          return content;
        },
      },
      text: false,
      binary: false,
    },
  });
};


module.exports = {
  dereferenceRefs,
};
