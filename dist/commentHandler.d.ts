export default commentHandler;
export type CommentHandler = (commentSelector: string, jsdoc: import('comment-parser').Block & {
    inlineTags: import('./commentParserToESTree.js').JsdocInlineTagNoType[];
}) => boolean;
/**
 * @callback CommentHandler
 * @param {string} commentSelector
 * @param {import('comment-parser').Block & {
 *   inlineTags: import('./commentParserToESTree.js').JsdocInlineTagNoType[]
* }} jsdoc
 * @returns {boolean}
 */
/**
 * @param {{[name: string]: any}} settings
 * @returns {CommentHandler}
 */
declare function commentHandler(settings: {
    [name: string]: any;
}): CommentHandler;
//# sourceMappingURL=commentHandler.d.ts.map