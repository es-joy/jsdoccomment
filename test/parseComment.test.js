import {parseComment} from '../src/index.js';

describe('parseComment (node)', function () {
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
          name: '[SomeName=DefaultValue]',
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
                name: '[SomeName=DefaultValue]',
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
            name: '[SomeName=DefaultValue]',
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

  it('Honors an escaped brace in a pipe label (#25 repro)', function () {
    const inlineTag = String.raw`{@link https://example.com|a\}b}`;
    const parsed = parseComment({value: `* See ${inlineTag}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'https://example.com',
        text: 'a}b',
        format: 'pipe',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Honors an escaped bracket in a prefix label (#25 repro)', function () {
    const inlineTag = String.raw`[a\]b]{@link https://example.com}`;
    const parsed = parseComment({value: `* See ${inlineTag}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'https://example.com',
        text: 'a]b',
        format: 'prefix',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Stops at a brace after an escaped backslash pair (A2)', function () {
    const description = String.raw`See {@link https://example.com|a\\}b}`;
    const matchedTag = String.raw`{@link https://example.com|a\\}`;
    const parsed = parseComment({value: `* ${description}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'https://example.com',
        text: 'a\\',
        format: 'pipe',
        start: 4,
        end: 4 + matchedTag.length
      }
    ]);
  });

  it('Requires an unescaped suffixed-label terminator (A3)', function () {
    // Back-compat delta: 0.88.0 parsed this as a truncated `text: 'a\\'`.
    const parsed = parseComment({
      value: String.raw`* See {@link url|a\}`
    }, '');
    expect(parsed.inlineTags).to.deep.equal([]);
  });

  it('Requires an unescaped prefix-label terminator (A3)', function () {
    // Back-compat delta: 0.88.0 parsed this as a truncated `text: 'a\\'`.
    const parsed = parseComment({
      value: String.raw`* See [a\]{@link url}`
    }, '');
    expect(parsed.inlineTags).to.deep.equal([]);
  });

  it('Honors an escaped brace in a space label', function () {
    const inlineTag = String.raw`{@link url a\}b}`;
    const parsed = parseComment({value: `* See ${inlineTag}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'url',
        text: 'a}b',
        format: 'space',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Honors escaped labels in a tag description', function () {
    const inlineTag = String.raw`{@link url|a\}b}`;
    const parsed = parseComment({value: `* @see See ${inlineTag}`}, '');
    expect(parsed.tags[0].inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'url',
        text: 'a}b',
        format: 'pipe',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Still stops at the first unescaped nested brace (A5)', function () {
    const description = 'See {@link url|a{b}c}';
    const matchedTag = '{@link url|a{b}';
    const parsed = parseComment({value: `* ${description}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'url',
        text: 'a{b',
        format: 'pipe',
        start: 4,
        end: 4 + matchedTag.length
      }
    ]);
  });

  it('Keeps escaped-bracket lookbehind limitation (A6)', function () {
    // Known limitation: the unchanged `(?<!\])` lookbehind rejects `\]{@`.
    const parsed = parseComment({
      value: String.raw`* See a\]{@link x}`
    }, '');
    expect(parsed.inlineTags).to.deep.equal([]);
  });

  it('Passes through backslash-pipe sequences (A8)', function () {
    const inlineTag = String.raw`{@link a\|b\|c}`;
    const parsed = parseComment({value: `* See ${inlineTag}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'a\\',
        text: String.raw`b\|c`,
        format: 'pipe',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Leaves plain inline tags untouched (A9)', function () {
    const inlineTag = '{@link url}';
    const parsed = parseComment({value: `* See ${inlineTag}`}, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'url',
        text: '',
        format: 'plain',
        start: 4,
        end: 4 + inlineTag.length
      }
    ]);
  });

  it('Honors escapes in multiline labels', function () {
    const parsed = parseComment({
      value: String.raw`* See {@link url|a\}b
* c}`
    }, '');
    expect(parsed.inlineTags).to.deep.equal([
      {
        tag: 'link',
        namepathOrURL: 'url',
        text: 'a}b c',
        format: 'pipe',
        start: 4,
        end: parsed.description.length
      }
    ]);
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

describe('parseComment (string)', function () {
  it('Handle simple @template', function () {
    const parsed = parseComment(`/**\n * @template SomeName\n */`);

    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: 'SomeName',
          type: '',
          optional: false,
          description: '',
          problems: [],
          source: [
            {
              number: 1,
              source: ' * @template SomeName',
              tokens: {
                start: ' ',
                delimiter: '*',
                postDelimiter: ' ',
                tag: '@template',
                postTag: ' ',
                name: 'SomeName',
                postName: '',
                type: '',
                postType: '',
                description: '',
                end: '',
                lineEnd: ''
              }
            },
            {
              number: 2,
              source: ' */',
              tokens: {
                start: ' ',
                delimiter: '',
                postDelimiter: '',
                tag: '',
                postTag: '',
                name: '',
                postName: '',
                type: '',
                postType: '',
                description: '',
                end: '*/',
                lineEnd: ''
              }
            }
          ],
          inlineTags: []
        }
      ],
      source: [
        {
          number: 0,
          source: '/**',
          tokens: {
            start: '',
            delimiter: '/**',
            postDelimiter: '',
            tag: '',
            postTag: '',
            name: '',
            postName: '',
            type: '',
            postType: '',
            description: '',
            end: '',
            lineEnd: ''
          }
        },
        {
          number: 1,
          source: ' * @template SomeName',
          tokens: {
            start: ' ',
            delimiter: '*',
            postDelimiter: ' ',
            tag: '@template',
            postTag: ' ',
            name: 'SomeName',
            postName: '',
            type: '',
            postType: '',
            description: '',
            end: '',
            lineEnd: ''
          }
        },
        {
          number: 2,
          source: ' */',
          tokens: {
            start: ' ',
            delimiter: '',
            postDelimiter: '',
            tag: '',
            postTag: '',
            name: '',
            postName: '',
            type: '',
            postType: '',
            description: '',
            end: '*/',
            lineEnd: ''
          }
        }
      ],
      problems: [],
      inlineTags: []
    });
  });

  it('Handle simple @template with bracketed name', function () {
    const parsed = parseComment(
      `/**\n * @template [SomeBracketedName] Desc.\n */`
    );

    expect(parsed).to.deep.equal({
      description: '',
      tags: [
        {
          tag: 'template',
          name: '[SomeBracketedName]',
          type: '',
          optional: false,
          description: 'Desc.',
          problems: [],
          source: [
            {
              number: 1,
              source: ' * @template [SomeBracketedName] Desc.',
              tokens: {
                start: ' ',
                delimiter: '*',
                postDelimiter: ' ',
                tag: '@template',
                postTag: ' ',
                name: '[SomeBracketedName]',
                postName: ' ',
                type: '',
                postType: '',
                description: 'Desc.',
                end: '',
                lineEnd: ''
              }
            },
            {
              number: 2,
              source: ' */',
              tokens: {
                start: ' ',
                delimiter: '',
                postDelimiter: '',
                tag: '',
                postTag: '',
                name: '',
                postName: '',
                type: '',
                postType: '',
                description: '',
                end: '*/',
                lineEnd: ''
              }
            }
          ],
          inlineTags: []
        }
      ],
      source: [
        {
          number: 0,
          source: '/**',
          tokens: {
            start: '',
            delimiter: '/**',
            postDelimiter: '',
            tag: '',
            postTag: '',
            name: '',
            postName: '',
            type: '',
            postType: '',
            description: '',
            end: '',
            lineEnd: ''
          }
        },
        {
          number: 1,
          source: ' * @template [SomeBracketedName] Desc.',
          tokens: {
            start: ' ',
            delimiter: '*',
            postDelimiter: ' ',
            tag: '@template',
            postTag: ' ',
            name: '[SomeBracketedName]',
            postName: ' ',
            type: '',
            postType: '',
            description: 'Desc.',
            end: '',
            lineEnd: ''
          }
        },
        {
          number: 2,
          source: ' */',
          tokens: {
            start: ' ',
            delimiter: '',
            postDelimiter: '',
            tag: '',
            postTag: '',
            name: '',
            postName: '',
            type: '',
            postType: '',
            description: '',
            end: '*/',
            lineEnd: ''
          }
        }
      ],
      problems: [],
      inlineTags: []
    });
  });
});

describe('parseComment (error)', function () {
  it('Throws on invalid argument (null)', function () {
    // @ts-expect-error -- Testing bad arg.
    expect(() => parseComment(null)).to.throw(
      `'commentOrNode' is not a string or object.`
    );
  });

  it('Throws on invalid argument (boolean)', function () {
    // @ts-expect-error -- Testing bad arg.
    expect(() => parseComment(false)).to.throw(
      `'commentOrNode' is not a string or object.`
    );
  });

  it('Throws on badly formed string', function () {
    expect(() => parseComment('')).to.throw(
      ``
    );
  });
});
