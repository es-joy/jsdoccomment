import {parse as jsdocTypePrattParse} from 'jsdoc-type-pratt-parser';

const stripEncapsulatingBrackets = (container, isArr) => {
  if (isArr) {
    const firstItem = container[0];
    firstItem.rawType = firstItem.rawType.replace(
      /^\{/u, ''
    );

    const lastItem = container[container.length - 1];
    lastItem.rawType = lastItem.rawType.replace(/\}$/u, '');

    return;
  }
  container.rawType = container.rawType.replace(
    /^\{/u, ''
  ).replace(/\}$/u, '');
};

const cleanUpLastTag = (lastTag, mode) => {
  // Strip out `}` that encapsulates and is not part of
  //   the type
  stripEncapsulatingBrackets(lastTag);
  if (lastTag.typeLines.length) {
    stripEncapsulatingBrackets(lastTag.typeLines, true);
  }

  // With even a multiline type now in full, add parsing
  let parsedType = null;
  try {
    parsedType = jsdocTypePrattParse(lastTag.rawType, mode);
  } catch {
    // Ignore
  }

  lastTag.parsedType = parsedType;
};

const commentParserToESTree = (jsdoc, mode) => {
  const {tokens: {
    delimiter: delimiterRoot,
    lineEnd: lineEndRoot,
    postDelimiter: postDelimiterRoot,
    end: endRoot,
    description: descriptionRoot
  }} = jsdoc.source[0];
  const ast = {
    delimiter: delimiterRoot,
    description: descriptionRoot,

    descriptionLines: [],

    // `end` will be overwritten if there are other entries
    end: endRoot,
    postDelimiter: postDelimiterRoot,
    lineEnd: lineEndRoot,

    type: 'JsdocBlock'
  };

  const tags = [];
  let lastDescriptionLine;
  let lastTag = null;

  const isSingleLineBlock = Boolean(jsdoc.source.length === 1 &&
    jsdoc.source[0].tokens.end);

  const source = isSingleLineBlock ? jsdoc.source : jsdoc.source.slice(1);

  source.forEach((info, idx) => {
    const {tokens} = info;
    const {
      delimiter,
      description,
      postDelimiter,
      start,
      tag,
      end,
      type: rawType
    } = tokens;

    if (tag || end) {
      if (lastDescriptionLine === undefined) {
        lastDescriptionLine = idx;
      }

      // Clean-up with last tag before end or new tag
      if (lastTag) {
        cleanUpLastTag(lastTag, mode);
      }

      // Stop the iteration when we reached the last tag
      // but only when we have multi-line block comment
      if (end && !isSingleLineBlock) {
        ast.end = end;

        return;
      }

      const {
        end: ed,
        ...tkns
      } = tokens;

      const tagObj = {
        ...tkns,
        descriptionLines: [],
        rawType: '',
        type: 'JsdocTag',
        typeLines: []
      };
      tagObj.tag = tagObj.tag.replace(/^@/u, '');

      lastTag = tagObj;

      tags.push(tagObj);
    }

    if (rawType) {
      // Will strip rawType brackets after this tag
      lastTag.typeLines.push(
        {
          delimiter,
          postDelimiter,
          rawType,
          start,
          type: 'JsdocTypeLine'
        }
      );
      lastTag.rawType += rawType;
    }

    if (description) {
      const holder = lastTag || ast;
      holder.descriptionLines.push({
        delimiter,
        description,
        postDelimiter,
        start,
        type: 'JsdocDescriptionLine'
      });
      holder.description += holder.description
        ? '\n' + description
        : description;
    }

    // Clean-up in single line mode
    if (isSingleLineBlock) {
      if (end) {
        ast.end = end;
      }

      if (lastTag) {
        cleanUpLastTag(lastTag, mode);
      }
    }
  });

  ast.lastDescriptionLine = lastDescriptionLine;
  ast.tags = tags;

  return ast;
};

const jsdocVisitorKeys = {
  JsdocBlock: ['tags', 'descriptionLines'],
  JsdocDescriptionLine: [],
  JsdocTypeLine: [],
  JsdocTag: ['descriptionLines', 'typeLines', 'parsedType']
};

export {commentParserToESTree, jsdocVisitorKeys};
