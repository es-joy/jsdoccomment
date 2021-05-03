# @es-joy/jsdoccomment

This project aims to preserve and expand upon the
`SourceCode#getJSDocComment` functionality of the deprecated ESLint method.

It also exports a number of functions currently for working with JSDoc:

- `parseComment` - For parsing `comment-parser` in a JSDoc-specific manner.
- `commentHandler` - Used by `eslint-plugin-jsdoc`. Might be removed in future.
- `commentParserToESTree`- Converts [comment-parser](https://github.com/syavorsky/comment-parser)
    AST to ESTree/ESLint/Babel friendly AST
- `jsdoctypeparserToESTree`- Converts [jsdoctypeparser](https://github.com/jsdoctypeparser/jsdoctypeparser)
    AST to ESTree/ESLint/Babel friendly AST
- `jsdocVisitorKeys` - The [VisitorKeys](https://github.com/eslint/eslint-visitor-keys)
    for `JSDocBlock`, `JSDocDescriptionLine`, and `JSDocTag`. Might change.
- `jsdocTypeVisitorKeys` - [VisitorKeys](https://github.com/eslint/eslint-visitor-keys)
    for jsdoctypeparser. More likely to be subject to change.
- `getTokenizers` - A utility. Might be removed in future.
- `toCamelCase` - A utility. Might be removed in future.

## Installation

```shell
npm i @es-joy/jsdoccomment
```

## Changelog

The changelog can be found on the [CHANGES.md](./CHANGES.md).
<!--## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](CONTRIBUTING.md).
-->
## Authors and license

[Brett Zamir](http://brett-zamir.me/) and
[contributors](https://github.com/es-joy/jsdoc-eslint-parser/graphs/contributors).

MIT License, see the included [LICENSE-MIT.txt](LICENSE-MIT.txt) file.

## To-dos

1. Get complete code coverage
2. If `comment-parser` (and `jsdoctypeparser`) are not exporting proper
    ESLint AST, then provide simple utilities to convert their AST
