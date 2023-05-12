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
export type InlineTag = import('./index.js').InlineTag;
//# sourceMappingURL=parseInlineTags.d.ts.map