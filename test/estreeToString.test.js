import {
  commentParserToESTree,
  estreeToString,
  parseComment
} from '../src/index.js';

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const singleLineWithTag = {
  type: 'JsdocBlock',
  delimiter: '/**',
  delimiterLineBreak: '',
  description: '',
  descriptionLines: [],
  initial: '',
  hasPreterminalDescription: 0,
  terminal: '*/',
  preterminalLineBreak: '',
  endLine: 0,
  lastDescriptionLine: 0,
  lineEnd: '',
  inlineTags: [],
  postDelimiter: ' ',
  tags: [
    {
      delimiter: '',
      description: '',
      descriptionLines: [],
      name: '',
      inlineTags: [],
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: '',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'type',
      type: 'JsdocTag',
      rawType: 'string',
      initial: '',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const jsdocBlock = {
  type: 'JsdocBlock',
  delimiter: '/**',
  delimiterLineBreak: '\n',
  description: '',
  descriptionLines: [],
  initial: '',
  hasPreterminalDescription: 0,
  terminal: '*/',
  preterminalLineBreak: '\n',
  endLine: 4,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  inlineTags: [],
  tags: [
    {
      delimiter: '*',
      description: 'multi-line\ndescription',
      descriptionLines: [
        {
          delimiter: '',
          description: '',
          postDelimiter: '',
          initial: '',
          type: 'JsdocDescriptionLine'
        },
        {
          delimiter: '*',
          description: 'multi-line',
          postDelimiter: ' ',
          initial: ' ',
          type: 'JsdocDescriptionLine'
        },
        {
          delimiter: '',
          description: 'description',
          postDelimiter: '',
          initial: ' ',
          type: 'JsdocDescriptionLine'
        }
      ],
      inlineTags: [],
      name: 'Some',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'param',
      type: 'JsdocTag',
      rawType: 'string',
      initial: ' ',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const jsdocBlockMultilineDesc = {
  type: 'JsdocBlock',
  delimiter: '/**',
  delimiterLineBreak: '\n',
  description: '',
  descriptionLines: [
    {
      delimiter: '*',
      description: 'multi-line',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    },
    {
      delimiter: '*',
      description: 'description',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  initial: '',
  hasPreterminalDescription: 0,
  inlineTags: [],
  terminal: '*/',
  preterminalLineBreak: '\n',
  endLine: 4,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: 'multi-line\ndescription',
      descriptionLines: [
      ],
      inlineTags: [],
      name: 'Some',
      parsedType: {
        type: 'JsdocTypeName',
        value: 'string'
      },
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: ' ',
      tag: 'param',
      type: 'JsdocTag',
      rawType: 'string',
      initial: ' ',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          initial: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const jsdocBlockNoTags = {
  type: 'JsdocBlock',
  delimiter: '/**',
  delimiterLineBreak: '\n',
  description: 'test',
  descriptionLines: [
    {
      delimiter: '*',
      description: 'test',
      postDelimiter: ' ',
      initial: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  initial: '',
  hasPreterminalDescription: 0,
  terminal: '*/',
  preterminalLineBreak: '\n',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  inlineTags: [],
  tags: []
};

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const blockWithTagNameYetNoType = {
  delimiter: '/**',
  delimiterLineBreak: '\n',
  description: '',
  descriptionLines: [],
  initial: '',
  hasPreterminalDescription: 0,
  terminal: '*/',
  preterminalLineBreak: '\n',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  inlineTags: [],
  tags: [
    {
      delimiter: '*',
      description: '',
      descriptionLines: [],
      inlineTags: [],
      name: 'TagNameNoType',
      parsedType: null,
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: '',
      rawType: '',
      initial: ' ',
      tag: 'param',
      type: 'JsdocTag',
      typeLines: []
    }
  ],
  type: 'JsdocBlock'
};

/** @type {import('../src/commentParserToESTree').JsdocBlock} */
const jsdocBlockEmptyTags = {
  ...structuredClone(jsdocBlockNoTags),
  tags: []
};

describe('`estreeToString`', function () {
  it(
    'handles stringifying block with multi-line block description',
    function () {
      const str = estreeToString(jsdocBlockMultilineDesc);
      expect(str).to.equal(`/**
 * multi-line
 * description
 * @param {string} Some
 */`);
    }
  );

  it('handles stringifying block with multi-line tag description', function () {
    const str = estreeToString(jsdocBlock);
    expect(str).to.equal(`/**
 * @param {string} Some
 * multi-line
 description
 */`);
  });

  it('handles stringifying single line', function () {
    const str = estreeToString(singleLineWithTag);
    expect(str).to.equal(`/** @type {string} */`);
  });

  it('handles stringifying block without tags', function () {
    const str = estreeToString(jsdocBlockNoTags);
    expect(str).to.equal(`/**
 * test
 */`);
  });

  it('handles stringifying block with missing `tags`', function () {
    const str = estreeToString(jsdocBlockEmptyTags);
    expect(str).to.equal(`/**
 * test
 */`);
  });

  it('handles stringifying block with tag name yet no type', function () {
    const str = estreeToString(blockWithTagNameYetNoType);
    expect(str).to.equal(`/**
 * @param TagNameNoType
 */`);
  });

  it(
    'handles multiline jsdoc comment with tag and ' +
      'multiline type (preserving multiline)',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @typedef {{
 *   a: string;
 * }} SomeName
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast, {
        preferRawType: true
      });
      expect(str).to.equal(`/**
 * @typedef {{
 *   a: string;
 * }} SomeName
 */`);
    }
  );

  it(
    'handles `preferRawType` with no `typeLines`',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @typedef SomeName
 `
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast, {
        preferRawType: true
      });
      expect(str).to.equal(`/**
 * @typedef SomeName
 */`);
    }
  );

  it(
    'handles single line with indent',
    () => {
      const parsedComment = parseComment({
        value: `* @type {SomeType} `
      }, '    ');

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast);
      expect(str).to.equal(`    /** @type {SomeType} */`);
    }
  );

  it(
    'handles multiline jsdoc comment with tag and multiline type',
    () => {
      const parsedComment = parseComment({
        value: `*
 * @type {{
 *   a: string;
 * }} SomeName
 *`
      });

      const ast = commentParserToESTree(parsedComment, 'typescript');
      const str = estreeToString(ast);
      expect(str).to.equal(`/**
 * @type {{a: string}} SomeName
 */`);
    }
  );

  it('handles pipe inline tag', function () {
    /** @type {import('../src/commentParserToESTree').JsdocInlineTag} */
    const ast = {
      tag: 'link',
      namepathOrURL: 'Something',
      text: 'something awesome!',
      format: 'pipe',
      type: 'JsdocInlineTag'
    };
    const str = estreeToString(ast);
    expect(str).to.equal('{@link Something|something awesome!}');
  });

  it('handles plain inline tag', function () {
    /** @type {import('../src/commentParserToESTree').JsdocInlineTag} */
    const ast = {
      tag: 'link',
      namepathOrURL: 'Something',
      text: '',
      format: 'plain',
      type: 'JsdocInlineTag'
    };
    const str = estreeToString(ast);
    expect(str).to.equal('{@link Something}');
  });

  it('handles space inline tag', function () {
    /** @type {import('../src/commentParserToESTree').JsdocInlineTag} */
    const ast = {
      tag: 'link',
      namepathOrURL: 'Something',
      text: 'something awesome!',
      format: 'space',
      type: 'JsdocInlineTag'
    };
    const str = estreeToString(ast);
    expect(str).to.equal('{@link Something something awesome!}');
  });

  it('handles prefix inline tag', function () {
    /** @type {import('../src/commentParserToESTree').JsdocInlineTag} */
    const ast = {
      tag: 'link',
      namepathOrURL: 'Something',
      text: 'something awesome!',
      format: 'prefix',
      type: 'JsdocInlineTag'
    };
    const str = estreeToString(ast);
    expect(str).to.equal('[something awesome!]{@link Something}');
  });

  it('throws upon encountering an unhandled node type', function () {
    expect(() => {
      /**
       * @typedef {any} BadArgument
       */
      estreeToString(/** @type {BadArgument} */ ({
        type: 'UnknownType'
      }));
    }).to.throw('Unhandled node type: UnknownType');
  });

  it('handles JsdocType / pratt type', function () {
    expect(estreeToString({
      type: 'JsdocTypeName',
      value: 'string'
    })).to.equal('{string}');
  });

  it('handles JsdocType / pratt type (preferRawType)', function () {
    expect(estreeToString({
      type: 'JsdocTypeName',
      value: 'string'
    }, {preferRawType: true})).to.equal('');
  });
});
