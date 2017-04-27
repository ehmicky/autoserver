'use strict';


// Looks for unescaped `$` to find $variables
const variablesRegExp = /((?:(?:[^\\])\$)|(?:^\$))([^{]|$)/g;

// Execute JSL statements using eval()
// Likely to throw exceptions
const evalJsl = ({ defaultShortcut }) => function ({ value, name, variables }) {
  /* eslint-disable no-unused-vars */
  const $ = variables;
  /* eslint-enable no-unused-vars */

  // Replace $var by $.var
  const valueWithoutShortcuts = processJslShortcuts({ value, name, defaultShortcut });

  // Beware local (and global) variables are available inside eval(), i.e. must keep it to a minimal
  // TODO: this is highly insecure. E.g. value 'while (true) {}' would freeze the whole server. Also it has access to
  // global variables, including global.process. Problem is that alternatives are much slower, so we need to find a solution.
  const newValue = eval(valueWithoutShortcuts);
  return newValue;
};

// Looks for single $ signs, unescaped
const jslSingleDollarRegExp = /((?:(?:[^\\])\$)|(?:^\$))([^A-Za-z0-9_{]|$)/g;
// Looks for unescaped $variable that looks like an attribute name
const jslAttrNameRegExp = /((?:(?:[^\\])\$)|(?:^\$))([a-z0-9_]+)/g;
// Modifies JSL $ shortcut notations
const processJslShortcuts = function ({ value, name, defaultShortcut }) {
  // Replace $ by $attr
  value = value.replace(jslSingleDollarRegExp, `$1${name}$2`);

  // Replace $attr by $MODEL.attr
  value = value.replace(jslAttrNameRegExp, `$1${defaultShortcut}.$2`);

  // Replace $var by $.var
  value = value.replace(variablesRegExp, '$1.$2');

  return value;
};


module.exports = {
  evalJslModel: evalJsl({ defaultShortcut: 'MODEL' }),
  evalJslData: evalJsl({ defaultShortcut: 'DATA' }),
};
