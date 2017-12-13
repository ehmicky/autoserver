# Coding style

We follow the [standard JavaScript style](https://standardjs.com), except
for semicolons and trailing commas.

Additionally, we enforce a pretty strong functional programming style with
[ESLint](http://eslint.org/), which includes:
  - no complex/big functions/files
  - no object-oriented programming
  - immutability everywhere
  - pure functions
  - no complex loops nor structures

Also we prefer:
  - named arguments over positional
  - async/await over raw promises or callbacks
  - destructuring
  - `...object` over `Object.assign()`

# Tooling

We are using [editorconfig](http://editorconfig.org/), so please install the
plugin for your IDE.
