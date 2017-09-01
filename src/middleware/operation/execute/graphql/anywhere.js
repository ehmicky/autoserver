/* eslint-disable */

const { assignObject, deepMerge } = require('../../../../utilities');

const {
  DocumentNode,
  SelectionSetNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
  DirectiveNode,
  FieldNode,
  IntValueNode,
  FloatValueNode,
  StringValueNode,
  BooleanValueNode,
  ObjectValueNode,
  ListValueNode,
  EnumValueNode,
  VariableNode,
  InlineFragmentNode,
  ValueNode,
  SelectionNode,
  ExecutionResult,
  NameNode,
} = require('graphql');

const graphql = async function (
  resolver,
  document,
  mainDefinition,
  contextValue,
  variables = {},
  rootValue = {},
) {
  const fragmentMap = createFragmentMap(document);

  return await executeSelectionSet({
    selectionSet: mainDefinition.selectionSet,
    rootValue,
    fragmentMap,
    contextValue,
    variables,
    resolver,
  });
}

const createFragmentMap = function (doc) {
  return doc.definitions
    .filter(definition => definition.kind === 'FragmentDefinition')
    .map(fragment => ({ [fragment.name.value]: fragment }))
    .reduce(assignObject, {});
}

const executeSelectionSet = async function ({
  selectionSet,
  rootValue,
  fragmentMap,
  contextValue,
  variables,
  resolver,
}) {
  if (!selectionSet || rootValue == null) { return rootValue; }

  const resultPromises = selectionSet.selections
    .map(async field => {
      const {
        name: { value: fieldName } = {},
        selectionSet,
        arguments,
        kind,
        directives,
      } = field;

      if (!applyDirectives({ directives, variables })) { return; }

      if (kind === 'Field') {
        const args = argumentsObjectFromField(arguments, variables);

        const result = await resolver(fieldName, rootValue, args, contextValue);

        const { value: resultFieldKey } = field.alias || field.name;

        let fieldResult;
        if (Array.isArray(result)) {
          const promises = result.map(async item => {
            return await executeSelectionSet({
              selectionSet,
              rootValue: item,
              fragmentMap,
              contextValue,
              variables,
              resolver,
            });
          });
          fieldResult = await Promise.all(promises);
        } else {
          fieldResult = await executeSelectionSet({
            selectionSet,
            rootValue: result,
            fragmentMap,
            contextValue,
            variables,
            resolver,
          });
        }

        return { [resultFieldKey]: fieldResult };
      }

      const fragmentSet = getFragmentSet({
        fragmentMap,
        kind,
        selectionSet,
        fieldName,
      });

      return await executeSelectionSet({
        selectionSet: fragmentSet,
        rootValue,
        fragmentMap,
        contextValue,
        variables,
        resolver,
      });
    });
  const results = await Promise.all(resultPromises);
  return deepMerge(...results);
}

const getFragmentSet = function ({
  fragmentMap,
  kind,
  selectionSet,
  fieldName,
}) {
  if (kind === 'InlineFragment') {
    return selectionSet;
  }

  const fragment = fragmentMap[fieldName];

  if (!fragment) {
    throw new Error(`No fragment named ${fieldName}`);
  }

  return fragment.selectionSet;
};

const applyDirectives = function ({ directives = [], variables }) {
  return directives.every(applyDirective.bind(null, variables));
};

const applyDirective = function (
  variables,
  {
    arguments,
    name: { value: directiveName },
  },
) {
  if (directiveName === 'include') {
    return checkDirective({ variables, arguments, directiveName });
  }

  if (directiveName === 'skip') {
    return !checkDirective({ variables, arguments, directiveName });
  }

  return true;
};

const checkDirective = function ({ variables, arguments, directiveName }) {
  if (arguments.length !== 1) {
    throw new Error(`Incorrect number of arguments for the @${directiveName} directive.`);
  }

  const [{
    name: { value: ifArgName } = {},
    value: { kind: ifKind, value: ifValue, name: { value: ifValueName } = {} },
  }] = arguments;

  if (ifArgName !== 'if') {
    throw new Error(`Invalid argument for the @${directiveName} directive.`);
  }

  const checkSpecificDirective = directivesCheckers[ifKind];

  if (!checkSpecificDirective) {
    throw new Error(`Argument for the @${directiveName} directive must be a variable or a boolean value.`);
  }

  return checkSpecificDirective({
    ifValue,
    variables,
    ifValueName,
    directiveName,
  });
};

const checkBooleanDirective = function ({ ifValue }) {
  return ifValue;
};

const checkVariableDirective = function ({
  variables,
  ifValueName,
  directiveName,
}) {
  const evaledValue = variables[ifValueName];

  if (typeof evaledValue !== 'boolean') {
    throw new Error(`Invalid variable referenced in @${directiveName} directive.`);
  }

  return evaledValue;
};

const directivesCheckers = {
  BooleanValue: checkBooleanDirective,
  Variable: checkVariableDirective,
};

/**
 * Returns the first operation definition found in this document.
 * If no operation definition is found, the first fragment definition will be returned.
 * If no definitions are found, an error will be thrown.
 */
const argumentsObjectFromField = function (arguments, variables) {
  if (arguments && arguments.length) {
    const argObj = {};
    arguments.forEach(({name, value}) => valueToObjectRepresentation(
      argObj, name, value, variables));
    return argObj;
  }

  return null;
}

function valueToObjectRepresentation(argObj, name, value, variables) {
  if (value.kind === 'IntValue' || value.kind === 'FloatValue') {
    argObj[name.value] = Number(value.value);
  } else if (value.kind === 'StringValue' || value.kind === 'BooleanValue' || value.kind === 'EnumValue') {
    argObj[name.value] = value.value;
  } else if (value.kind === 'ObjectValue') {
    const nestedArgObj = {};
    value.fields.map((obj) => valueToObjectRepresentation(nestedArgObj, obj.name, obj.value, variables));
    argObj[name.value] = nestedArgObj;
  } else if (value.kind === 'Variable') {
    const variable = variables[value.name.value];
    argObj[name.value] = variable;
  } else if (value.kind === 'ListValue') {
    argObj[name.value] = value.values.map((listValue) => {
      const nestedArgArrayObj = {};
      valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
      return nestedArgArrayObj[name.value];
    });
  } else {
    // There are no other types of values we know of, but some might be added later and we want
    // to have a nice error for that case.
    throw new Error(`The inline argument "${name.value}" of kind "${value.kind}" is not \
supported. Use variables instead of inline arguments to overcome this limitation.`);
  }
}

module.exports = {
  graphql,
};
