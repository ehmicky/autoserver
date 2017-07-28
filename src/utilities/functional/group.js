'use strict';

// Group array of objects together according to a specific key
// `key` can a string (the object key), an array (several object keys) or
// a function returning a string.
const groupBy = function (array, key) {
  return array.reduce((groups, obj) => {
    const groupName = getGroupName(key, obj);
    const currentGroup = groups[groupName] || [];
    const newGroup = [...currentGroup, obj];
    return { ...groups, [groupName]: newGroup };
  }, []);
};

const getGroupName = function (key, obj) {
  if (typeof key === 'function') {
    return key(obj);
  }

  if (Array.isArray(key)) {
    return key.map(name => obj[name]).join(',');
  }

  return obj[key];
};

module.exports = {
  groupBy,
};
