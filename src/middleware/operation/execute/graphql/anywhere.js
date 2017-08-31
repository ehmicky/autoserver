/* eslint-disable */

const { assignObject } = require('../../../../utilities');

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
  rootValue,
  mainDefinition,
  contextValue,
  variables = {},
) {
  const fragmentMap = createFragmentMap(document);

  return await executeSelectionSet(
    mainDefinition.selectionSet,
    rootValue,
    fragmentMap,
    contextValue,
    variables,
    resolver,
  );
}

const createFragmentMap = function (doc) {
  return doc.definitions
    .filter(definition => definition.kind === 'FragmentDefinition')
    .map(fragment => ({ [fragment.name.value]: fragment }))
    .reduce(assignObject, {});
}

const executeSelectionSet = async function (
  selectionSet,
  rootValue,
  fragmentMap,
  contextValue,
  variables,
  resolver,
) {
  const result = {};

  const resultPromises = selectionSet.selections.map(async selection => {
    if (!applyDirectives({ selection, variables })) { return; }

    if (selection.kind === 'Field') {
      const fieldResult = await executeField(
        selection,
        rootValue,
        fragmentMap,
        contextValue,
        variables,
        resolver,
      );

      const resultFieldKey = resultKeyNameFromField(selection);

      if (fieldResult !== undefined) {
        if (result[resultFieldKey] === undefined) {
          result[resultFieldKey] = fieldResult;
        } else {
          merge(result[resultFieldKey], fieldResult);
        }
      }

      return result;
    }

    let fragment;

    if (selection.kind === 'InlineFragment') {
      fragment = selection;
    } else {
      // This is a named fragment
      fragment = fragmentMap[selection.name.value];

      if (!fragment) {
        throw new Error(`No fragment named ${selection.name.value}`);
      }
    }

    const fragmentResult = await executeSelectionSet(
      fragment.selectionSet,
      rootValue,
      fragmentMap,
      contextValue,
      variables,
      resolver,
    );

    merge(result, fragmentResult);
  });

  await Promise.all(resultPromises);
  return result;
}

const executeField = async function (
  field,
  rootValue,
  fragmentMap,
  contextValue,
  variables,
  resolver,
) {
  const fieldName = field.name.value;
  const args = argumentsObjectFromField(field, variables);

  const info = {
    isLeaf: !field.selectionSet,
    resultKey: resultKeyNameFromField(field),
    directives: getDirectiveInfoFromField(field, variables),
  };

  const resultOrDeferrable = resolver(fieldName, rootValue, args, contextValue, info);

  const result = await resultOrDeferrable;
  // Handle all scalar types here
  if (!field.selectionSet) {
    return result;
  }

  // From here down, the field has a selection set, which means it's trying to
  // query a GraphQLObjectType
  if (result == null) {
    // Basically any field in a GraphQL response can be null, or missing
    return result;
  }

  if (Array.isArray(result)) {
    return await executeSubSelectedArray(
      field,
      result,
      fragmentMap,
      contextValue,
      variables,
      resolver,
    );
  }

  // Returned value is an object, and the query has a sub-selection. Recurse.
  return await executeSelectionSet(
    field.selectionSet,
    result,
    fragmentMap,
    contextValue,
    variables,
    resolver,
  );
}

const executeSubSelectedArray = async function (
  field,
  result,
  fragmentMap,
  contextValue,
  variables,
  resolver,
) {
  const promises = result.map(async item => {
    // null value in array
    if (item === null) {
      return null;
    }

    // This is a nested array, recurse
    if (Array.isArray(item)) {
      return await executeSubSelectedArray(
        field,
        item,
        fragmentMap,
        contextValue,
        variables,
        resolver,
      );
    }

    // This is an object, run the selection set on it
    return await executeSelectionSet(
      field.selectionSet,
      item,
      fragmentMap,
      contextValue,
      variables,
      resolver,
    );
  });
  return Promise.all(promises);
}

function merge(dest, src) {
  if (
    src === null ||
    typeof src !== 'object'
  ) {
    // These types just override whatever was in dest
    return src;
  }

  // Merge sub-objects
  Object.keys(dest).forEach((destKey) => {
    if (src.hasOwnProperty(destKey)) {
      merge(dest[destKey], src[destKey]);
    }
  });

  // Add props only on src
  Object.keys(src).forEach((srcKey) => {
    if (!dest.hasOwnProperty(srcKey)) {
      dest[srcKey] = src[srcKey];
    }
  });
}

const getDirectiveInfoFromField = function (field, variables) {
  if (field.directives && field.directives.length) {
    let directiveObj = {};
    field.directives.forEach((directive) => {
      directiveObj[directive.name.value] = argumentsObjectFromField(directive, variables);
    });
    return directiveObj;
  }
  return null;
}

const applyDirectives = function ({
  selection: { directives = [] },
  variables,
}) {
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
const argumentsObjectFromField = function (field, variables) {
  if (field.arguments && field.arguments.length) {
    const argObj = {};
    field.arguments.forEach(({name, value}) => valueToObjectRepresentation(
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

const resultKeyNameFromField = function (field) {
  return field.alias ? field.alias.value : field.name.value;
}

module.exports = {
  graphql,
};
