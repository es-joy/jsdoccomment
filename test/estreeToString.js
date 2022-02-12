import estreeToString from '../src/estreeToString.js';

const singleLineWithTag = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  end: '*/',
  endLine: 0,
  lastDescriptionLine: 0,
  lineEnd: '',
  postDelimiter: ' ',
  tags: [
    {
      delimiter: '',
      description: '',
      descriptionLines: [],
      lineEnd: '',
      name: '',
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
      start: '',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          start: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

const jsdocBlock = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  end: '*/',
  endLine: 4,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: 'multi-line\ndescription',
      descriptionLines: [
        {
          delimiter: '*',
          description: 'multi-line',
          postDelimiter: ' ',
          start: ' ',
          type: 'JsdocDescriptionLine'
        },
        {
          delimiter: '',
          description: 'description',
          postDelimiter: '',
          start: ' ',
          type: 'JsdocDescriptionLine'
        }
      ],
      lineEnd: '',
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
      start: ' ',
      typeLines: [
        {
          delimiter: '',
          postDelimiter: '',
          rawType: 'string',
          start: '',
          type: 'JsdocTypeLine'
        }
      ]
    }
  ]
};

const jsdocBlockNoTags = {
  type: 'JsdocBlock',
  delimiter: '/**',
  description: 'test',
  descriptionLines: [
    {
      delimiter: '*',
      description: 'test',
      postDelimiter: ' ',
      start: ' ',
      type: 'JsdocDescriptionLine'
    }
  ],
  end: '*/',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: []
};

const blockWithTagNameYetNoType = {
  delimiter: '/**',
  description: '',
  descriptionLines: [],
  end: '*/',
  endLine: 2,
  lastDescriptionLine: 1,
  lineEnd: '',
  postDelimiter: '',
  tags: [
    {
      delimiter: '*',
      description: '',
      descriptionLines: [],
      lineEnd: '',
      name: 'TagNameNoType',
      parsedType: null,
      postDelimiter: ' ',
      postName: '',
      postTag: ' ',
      postType: '',
      rawType: '',
      start: ' ',
      tag: 'param',
      type: 'JsdocTag',
      typeLines: []
    }
  ],
  type: 'JsdocBlock'
};

const jsdocBlockNoTagsArray = {
  ...JSON.parse(JSON.stringify(jsdocBlockNoTags)),
  tags: undefined
};

describe('`estreeToString`', function () {
  it('handles stringifying block', function () {
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
    const str = estreeToString(jsdocBlockNoTagsArray);
    expect(str).to.equal(`/**
 * test
 */`);
  });

  it('handles stringifying block with missing `tags`', function () {
    const str = estreeToString(blockWithTagNameYetNoType);
    expect(str).to.equal(`/**
 * @param TagNameNoType
 */`);
  });

  it('throws upon encountering an unhandled node type', function () {
    expect(() => {
      estreeToString({
        type: 'UnknownType'
      });
    }).to.throw('Unhandled node type: UnknownType');
  });
});
