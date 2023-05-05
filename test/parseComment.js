import {parseComment} from '../src/index.js';

describe('parseComment', function () {
  it('Handle simple @template', function () {
    const parsed = parseComment({value: `* @template SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName',
          type: '',
          optional: false,
          description: '',
          inlineTags: [],
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @template SomeName*/',
              tokens: {
                delimiter: '/**',
                description: '',
                end: '*/',
                lineEnd: '',
                name: 'SomeName',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@template',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @template SomeName*/',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            lineEnd: '',
            name: 'SomeName',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@template',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle @template with default', function () {
    const parsed = parseComment({value: `* @template [SomeName=DefaultValue]`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName',
          type: '',
          optional: true,
          description: '',
          inlineTags: [],
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @template [SomeName=DefaultValue]*/',
              tokens: {
                delimiter: '/**',
                description: '',
                end: '*/',
                lineEnd: '',
                name: 'SomeName',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@template',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @template [SomeName=DefaultValue]*/',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            lineEnd: '',
            name: 'SomeName',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@template',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle @template with commas and description', function () {
    const parsed = parseComment({
      value: `* @template SomeName, AnotherName - Some description`
    });
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName, AnotherName',
          type: '',
          optional: false,
          description: '- Some description',
          inlineTags: [],
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @template SomeName, ' +
                        'AnotherName - Some description*/',
              tokens: {
                delimiter: '/**',
                description: '- Some description',
                end: '*/',
                lineEnd: '',
                name: 'SomeName, AnotherName',
                postDelimiter: ' ',
                postName: ' ',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@template',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @template SomeName, AnotherName - Some description*/',
          tokens: {
            delimiter: '/**',
            description: '- Some description',
            end: '*/',
            lineEnd: '',
            name: 'SomeName, AnotherName',
            postDelimiter: ' ',
            postName: ' ',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@template',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle simple no-type tag (@see)', function () {
    const parsed = parseComment({value: `* @see SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'see',
          name: 'SomeName',
          type: '',
          optional: false,
          description: '',
          inlineTags: [],
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @see SomeName*/',
              tokens: {
                delimiter: '/**',
                description: '',
                end: '*/',
                lineEnd: '',
                name: 'SomeName',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@see',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @see SomeName*/',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            lineEnd: '',
            name: 'SomeName',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@see',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle simple no-name tag (@author)', function () {
    const parsed = parseComment({value: `* @author SomeName`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'author',
          name: '',
          type: '',
          optional: false,
          description: 'SomeName',
          inlineTags: [],
          problems: [],
          source: [
            {
              number: 0,
              source: '/** @author SomeName*/',
              tokens: {
                delimiter: '/**',
                description: 'SomeName',
                end: '*/',
                lineEnd: '',
                name: '',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@author',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @author SomeName*/',
          tokens: {
            delimiter: '/**',
            description: 'SomeName',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@author',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle plain inline tag in description', function () {
    const parsed = parseComment({value: `* A link to {@link Something}`});
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: '',
          format: 'plain',
          start: 10,
          end: 27
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to {@link Something}*/',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle multiple inline tags in multiline description', function () {
    const parsed = parseComment({
      value: `* A link to {@link Something}\n* and {@link SomethingElse}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something} and {@link SomethingElse}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: '',
          format: 'plain',
          start: 10,
          end: 27
        },
        {
          tag: 'link',
          namepathOrURL: 'SomethingElse',
          text: '',
          format: 'plain',
          start: 32,
          end: 53
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to {@link Something}',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something}',
            end: '',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        },
        {
          number: 1,
          source: '* and {@link SomethingElse}*/',
          tokens: {
            delimiter: '*',
            description: 'and {@link SomethingElse}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle inline tags with multiline text', function () {
    const parsed = parseComment({
      value: `* A link to {@link Something|multiple\nlines}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something|multiple lines}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: 'multiple lines',
          format: 'pipe',
          start: 10,
          end: 42
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to {@link Something|multiple',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something|multiple',
            end: '',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        },
        {
          number: 1,
          source: 'lines}*/',
          tokens: {
            delimiter: '',
            description: 'lines}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: '',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle inline tag with "spaced" text in description', function () {
    const parsed = parseComment({
      value: `* A link to {@link Something something awesome!}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something something awesome!}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: 'something awesome!',
          format: 'space',
          start: 10,
          end: 46
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to {@link Something something awesome!}*/',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something something awesome!}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle inline tag with "piped" text in description', function () {
    const parsed = parseComment({
      value: `* A link to {@link Something|something awesome!}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something|something awesome!}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: 'something awesome!',
          format: 'pipe',
          start: 10,
          end: 46
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to {@link Something|something awesome!}*/',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something|something awesome!}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle inline tag with "piped" spaced text in description', function () {
    const parsed = parseComment({
      value: `* A link to {@link Something  |  something awesome!}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to {@link Something  |  something awesome!}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: 'something awesome!',
          format: 'pipe',
          start: 10,
          end: 50
        }
      ],
      source: [
        {
          number: 0,
          source:
            '/** A link to {@link Something  |  something awesome!}*/',
          tokens: {
            delimiter: '/**',
            description:
              'A link to {@link Something  |  something awesome!}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle inline tag with "prefixed" text in description', function () {
    const parsed = parseComment({
      value: `* A link to [something awesome!]{@link Something}`
    });
    expect(parsed).to.deep.equal({
      description: 'A link to [something awesome!]{@link Something}',
      tags: [],
      inlineTags: [
        {
          tag: 'link',
          namepathOrURL: 'Something',
          text: 'something awesome!',
          format: 'prefix',
          start: 10,
          end: 47
        }
      ],
      source: [
        {
          number: 0,
          source: '/** A link to [something awesome!]{@link Something}*/',
          tokens: {
            delimiter: '/**',
            description: 'A link to [something awesome!]{@link Something}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Handle plain inline tag in tag', function () {
    const parsed = parseComment({value: `* @see A link to {@link Something}`});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'see',
          name: '',
          type: '',
          optional: false,
          description: 'A link to {@link Something}',
          problems: [],
          inlineTags: [
            {
              tag: 'link',
              namepathOrURL: 'Something',
              text: '',
              format: 'plain',
              start: 10,
              end: 27
            }
          ],
          source: [
            {
              number: 0,
              source: '/** @see A link to {@link Something}*/',
              tokens: {
                delimiter: '/**',
                description: 'A link to {@link Something}',
                end: '*/',
                lineEnd: '',
                name: '',
                postDelimiter: ' ',
                postName: '',
                postTag: ' ',
                postType: '',
                start: '',
                tag: '@see',
                type: ''
              }
            }
          ]
        }
      ],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** @see A link to {@link Something}*/',
          tokens: {
            delimiter: '/**',
            description: 'A link to {@link Something}',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: ' ',
            postType: '',
            start: '',
            tag: '@see',
            type: ''
          }
        }
      ],
      problems: []
    });
  });

  it('Default to simple empty block (comment-parser issue #128)', function () {
    const parsed = parseComment({value: `* `});
    expect(parsed).to.deep.equal({
      description: '',
      tags: [],
      inlineTags: [],
      source: [
        {
          number: 0,
          source: '/** */',
          tokens: {
            delimiter: '/**',
            description: '',
            end: '*/',
            lineEnd: '',
            name: '',
            postDelimiter: ' ',
            postName: '',
            postTag: '',
            postType: '',
            start: '',
            tag: '',
            type: ''
          }
        }
      ],
      problems: []
    });
  });
});
