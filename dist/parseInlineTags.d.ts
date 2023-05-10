/**
 * Splits the `{@prefix}` from remaining `Spec.lines[].token.description`
 * into the `inlineTags` tokens, and populates `spec.inlineTags`
 * @param {import('comment-parser').Block & {
 *   inlineTags?: InlineTag[]
 * }} block
 * @returns {import('comment-parser').Block & {
 *   inlineTags: InlineTag[]
 * }}
 */
export default function parseInlineTags(block: import('comment-parser').Block & {
    inlineTags?: InlineTag[];
}): import('comment-parser').Block & {
    inlineTags: InlineTag[];
};
export type InlineTag = {
    format: 'pipe' | 'plain' | 'prefix' | 'space';
    namepathOrURL: string;
    tag: string;
    text: string;
    start: number;
    end: number;
};
//# sourceMappingURL=parseInlineTags.d.ts.map