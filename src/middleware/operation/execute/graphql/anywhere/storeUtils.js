const {
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

const SCALAR_TYPES = {
  StringValue: true,
  BooleanValue: true,
  EnumValue: true,
};

function isScalarValue(value) {
  return !!SCALAR_TYPES[value.kind];
}

const NUMBER_TYPES = {
  IntValue: true,
  FloatValue: true,
};

function isNumberValue(value) {
  return NUMBER_TYPES[value.kind];
}

function isVariable(value) {
  return value.kind === 'Variable';
}

function isObject(value) {
  return value.kind === 'ObjectValue';
}

function isList(value) {
  return value.kind === 'ListValue';
}

function valueToObjectRepresentation(argObj, name, value, variables = {}) {
  if (isNumberValue(value)) {
    argObj[name.value] = Number(value.value);
  } else if (isScalarValue(value)) {
    argObj[name.value] = value.value;
  } else if (isObject(value)) {
    const nestedArgObj = {};
    value.fields.map((obj) => valueToObjectRepresentation(nestedArgObj, obj.name, obj.value, variables));
    argObj[name.value] = nestedArgObj;
  } else if (isVariable(value)) {
    const variableValue = variables[value.name.value];
    argObj[name.value] = variableValue;
  } else if (isList(value)) {
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

module.exports.argumentsObjectFromField = function (field, variables) {
  if (field.arguments && field.arguments.length) {
    const argObj = {};
    field.arguments.forEach(({name, value}) => valueToObjectRepresentation(
      argObj, name, value, variables));
    return argObj;
  }

  return null;
}

module.exports.resultKeyNameFromField = function (field) {
  return field.alias ? field.alias.value : field.name.value;
}

module.exports.isField = function (selection) {
  return selection.kind === 'Field';
}

module.exports.isInlineFragment = function (selection) {
  return selection.kind === 'InlineFragment';
}

module.exports.graphQLResultHasError = function (result) {
  return result.errors && result.errors.length;
}
