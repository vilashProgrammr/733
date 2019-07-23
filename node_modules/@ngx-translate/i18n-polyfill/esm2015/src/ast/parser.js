/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ParseError, ParseSourceSpan } from "./parse_util";
import * as html from "./ast";
import { DEFAULT_INTERPOLATION_CONFIG } from "./interpolation_config";
import * as lex from "./lexer";
import { getNsPrefix, isNgContainer, mergeNsAndName } from "./tags";
export class TreeError extends ParseError {
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     */
    constructor(elementName, span, msg) {
        super(span, msg);
        this.elementName = elementName;
    }
    /**
     * @param {?} elementName
     * @param {?} span
     * @param {?} msg
     * @return {?}
     */
    static create(elementName, span, msg) {
        return new TreeError(elementName, span, msg);
    }
}
function TreeError_tsickle_Closure_declarations() {
    /** @type {?} */
    TreeError.prototype.elementName;
}
export class ParseTreeResult {
    /**
     * @param {?} rootNodes
     * @param {?} errors
     */
    constructor(rootNodes, errors) {
        this.rootNodes = rootNodes;
        this.errors = errors;
    }
}
function ParseTreeResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseTreeResult.prototype.rootNodes;
    /** @type {?} */
    ParseTreeResult.prototype.errors;
}
export class Parser {
    /**
     * @param {?} getTagDefinition
     */
    constructor(getTagDefinition) {
        this.getTagDefinition = getTagDefinition;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @param {?=} interpolationConfig
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ tokensAndErrors = lex.tokenize(source, url, this.getTagDefinition, parseExpansionForms, interpolationConfig);
        const /** @type {?} */ treeAndErrors = new _TreeBuilder(tokensAndErrors.tokens, this.getTagDefinition).build();
        return new ParseTreeResult(treeAndErrors.rootNodes, (/** @type {?} */ (tokensAndErrors.errors)).concat(treeAndErrors.errors));
    }
}
function Parser_tsickle_Closure_declarations() {
    /** @type {?} */
    Parser.prototype.getTagDefinition;
}
class _TreeBuilder {
    /**
     * @param {?} tokens
     * @param {?} getTagDefinition
     */
    constructor(tokens, getTagDefinition) {
        this.tokens = tokens;
        this.getTagDefinition = getTagDefinition;
        this._index = -1;
        this._rootNodes = [];
        this._errors = [];
        this._elementStack = [];
        this._advance();
    }
    /**
     * @return {?}
     */
    build() {
        while (this._peek.type !== lex.TokenType.EOF) {
            if (this._peek.type === lex.TokenType.TAG_OPEN_START) {
                this._consumeStartTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TAG_CLOSE) {
                this._consumeEndTag(this._advance());
            }
            else if (this._peek.type === lex.TokenType.CDATA_START) {
                this._closeVoidElement();
                this._consumeCdata(this._advance());
            }
            else if (this._peek.type === lex.TokenType.COMMENT_START) {
                this._closeVoidElement();
                this._consumeComment(this._advance());
            }
            else if (this._peek.type === lex.TokenType.TEXT ||
                this._peek.type === lex.TokenType.RAW_TEXT ||
                this._peek.type === lex.TokenType.ESCAPABLE_RAW_TEXT) {
                this._closeVoidElement();
                this._consumeText(this._advance());
            }
            else if (this._peek.type === lex.TokenType.EXPANSION_FORM_START) {
                this._consumeExpansion(this._advance());
            }
            else {
                // Skip all other tokens...
                this._advance();
            }
        }
        return new ParseTreeResult(this._rootNodes, this._errors);
    }
    /**
     * @return {?}
     */
    _advance() {
        const /** @type {?} */ prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            // Note: there is always an EOF token at the end
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    _advanceIf(type) {
        if (this._peek.type === type) {
            return this._advance();
        }
        return null;
    }
    /**
     * @param {?} startToken
     * @return {?}
     */
    _consumeCdata(startToken) {
        this._consumeText(this._advance());
        this._advanceIf(lex.TokenType.CDATA_END);
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeComment(token) {
        const /** @type {?} */ text = this._advanceIf(lex.TokenType.RAW_TEXT);
        this._advanceIf(lex.TokenType.COMMENT_END);
        const /** @type {?} */ value = text !== null ? text.parts[0].trim() : null;
        this._addToParent(new html.Comment(value, token.sourceSpan));
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeExpansion(token) {
        const /** @type {?} */ switchValue = this._advance();
        const /** @type {?} */ type = this._advance();
        const /** @type {?} */ cases = [];
        // read =
        while (this._peek.type === lex.TokenType.EXPANSION_CASE_VALUE) {
            const /** @type {?} */ expCase = this._parseExpansionCase();
            if (!expCase) {
                return;
            } // error
            cases.push(expCase);
        }
        // read the final }
        if (this._peek.type !== lex.TokenType.EXPANSION_FORM_END) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '}'.`));
            return;
        }
        const /** @type {?} */ sourceSpan = new ParseSourceSpan(token.sourceSpan.start, this._peek.sourceSpan.end);
        this._addToParent(new html.Expansion(switchValue.parts[0], type.parts[0], cases, sourceSpan, switchValue.sourceSpan));
        this._advance();
    }
    /**
     * @return {?}
     */
    _parseExpansionCase() {
        const /** @type {?} */ value = this._advance();
        // read {
        if (this._peek.type !== lex.TokenType.EXPANSION_CASE_EXP_START) {
            this._errors.push(TreeError.create(null, this._peek.sourceSpan, `Invalid ICU message. Missing '{'.`));
            return null;
        }
        // read until }
        const /** @type {?} */ start = this._advance();
        const /** @type {?} */ exp = this._collectExpansionExpTokens(start);
        if (!exp) {
            return null;
        }
        const /** @type {?} */ end = this._advance();
        exp.push(new lex.Token(lex.TokenType.EOF, [], end.sourceSpan));
        // parse everything in between { and }
        const /** @type {?} */ parsedExp = new _TreeBuilder(exp, this.getTagDefinition).build();
        if (parsedExp.errors.length > 0) {
            this._errors = this._errors.concat(/** @type {?} */ (parsedExp.errors));
            return null;
        }
        const /** @type {?} */ sourceSpan = new ParseSourceSpan(value.sourceSpan.start, end.sourceSpan.end);
        const /** @type {?} */ expSourceSpan = new ParseSourceSpan(start.sourceSpan.start, end.sourceSpan.end);
        return new html.ExpansionCase(value.parts[0], parsedExp.rootNodes, sourceSpan, value.sourceSpan, expSourceSpan);
    }
    /**
     * @param {?} start
     * @return {?}
     */
    _collectExpansionExpTokens(start) {
        const /** @type {?} */ exp = [];
        const /** @type {?} */ expansionFormStack = [lex.TokenType.EXPANSION_CASE_EXP_START];
        while (true) {
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_START ||
                this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_START) {
                expansionFormStack.push(this._peek.type);
            }
            if (this._peek.type === lex.TokenType.EXPANSION_CASE_EXP_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_CASE_EXP_START)) {
                    expansionFormStack.pop();
                    if (expansionFormStack.length === 0) {
                        return exp;
                    }
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EXPANSION_FORM_END) {
                if (lastOnStack(expansionFormStack, lex.TokenType.EXPANSION_FORM_START)) {
                    expansionFormStack.pop();
                }
                else {
                    this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                    return null;
                }
            }
            if (this._peek.type === lex.TokenType.EOF) {
                this._errors.push(TreeError.create(null, start.sourceSpan, `Invalid ICU message. Missing '}'.`));
                return null;
            }
            exp.push(this._advance());
        }
    }
    /**
     * @param {?} token
     * @return {?}
     */
    _consumeText(token) {
        let /** @type {?} */ text = token.parts[0];
        if (text.length > 0 && text[0] === "\n") {
            const /** @type {?} */ parent = this._getParentElement();
            if (parent !== null && parent.children.length === 0 && this.getTagDefinition(parent.name).ignoreFirstLf) {
                text = text.substring(1);
            }
        }
        if (text.length > 0) {
            this._addToParent(new html.Text(text, token.sourceSpan));
        }
    }
    /**
     * @return {?}
     */
    _closeVoidElement() {
        const /** @type {?} */ el = this._getParentElement();
        if (el && this.getTagDefinition(el.name).isVoid) {
            this._elementStack.pop();
        }
    }
    /**
     * @param {?} startTagToken
     * @return {?}
     */
    _consumeStartTag(startTagToken) {
        const /** @type {?} */ prefix = startTagToken.parts[0];
        const /** @type {?} */ name = startTagToken.parts[1];
        const /** @type {?} */ attrs = [];
        while (this._peek.type === lex.TokenType.ATTR_NAME) {
            attrs.push(this._consumeAttr(this._advance()));
        }
        const /** @type {?} */ fullName = this._getElementFullName(prefix, name, this._getParentElement());
        let /** @type {?} */ selfClosing = false;
        // Note: There could have been a tokenizer error
        // so that we don't get a token for the end tag...
        if (this._peek.type === lex.TokenType.TAG_OPEN_END_VOID) {
            this._advance();
            selfClosing = true;
            const /** @type {?} */ tagDef = this.getTagDefinition(fullName);
            if (!(tagDef.canSelfClose || getNsPrefix(fullName) !== null || tagDef.isVoid)) {
                this._errors.push(TreeError.create(fullName, startTagToken.sourceSpan, `Only void and foreign elements can be self closed "${startTagToken.parts[1]}"`));
            }
        }
        else if (this._peek.type === lex.TokenType.TAG_OPEN_END) {
            this._advance();
            selfClosing = false;
        }
        const /** @type {?} */ end = this._peek.sourceSpan.start;
        const /** @type {?} */ span = new ParseSourceSpan(startTagToken.sourceSpan.start, end);
        const /** @type {?} */ el = new html.Element(fullName, attrs, [], span, span, undefined);
        this._pushElement(el);
        if (selfClosing) {
            this._popElement(fullName);
            el.endSourceSpan = span;
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    _pushElement(el) {
        const /** @type {?} */ parentEl = this._getParentElement();
        if (parentEl && this.getTagDefinition(parentEl.name).isClosedByChild(el.name)) {
            this._elementStack.pop();
        }
        const /** @type {?} */ tagDef = this.getTagDefinition(el.name);
        const { parent, container } = this._getParentElementSkippingContainers();
        if (parent && tagDef.requireExtraParent(parent.name)) {
            const /** @type {?} */ newParent = new html.Element(tagDef.parentToAdd, [], [], el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
            this._insertBeforeContainer(parent, container, newParent);
        }
        this._addToParent(el);
        this._elementStack.push(el);
    }
    /**
     * @param {?} endTagToken
     * @return {?}
     */
    _consumeEndTag(endTagToken) {
        const /** @type {?} */ fullName = this._getElementFullName(endTagToken.parts[0], endTagToken.parts[1], this._getParentElement());
        if (this._getParentElement()) {
            /** @type {?} */ ((this._getParentElement())).endSourceSpan = endTagToken.sourceSpan;
        }
        if (this.getTagDefinition(fullName).isVoid) {
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, `Void elements do not have end tags "${endTagToken.parts[1]}"`));
        }
        else if (!this._popElement(fullName)) {
            const /** @type {?} */ errMsg = `Unexpected closing tag "${fullName}". It may happen when the tag has already been closed by another tag. For more info see https://www.w3.org/TR/html5/syntax.html#closing-elements-that-have-implied-end-tags`;
            this._errors.push(TreeError.create(fullName, endTagToken.sourceSpan, errMsg));
        }
    }
    /**
     * @param {?} fullName
     * @return {?}
     */
    _popElement(fullName) {
        for (let /** @type {?} */ stackIndex = this._elementStack.length - 1; stackIndex >= 0; stackIndex--) {
            const /** @type {?} */ el = this._elementStack[stackIndex];
            if (el.name === fullName) {
                this._elementStack.splice(stackIndex, this._elementStack.length - stackIndex);
                return true;
            }
            if (!this.getTagDefinition(el.name).closedByParent) {
                return false;
            }
        }
        return false;
    }
    /**
     * @param {?} attrName
     * @return {?}
     */
    _consumeAttr(attrName) {
        const /** @type {?} */ fullName = mergeNsAndName(attrName.parts[0], attrName.parts[1]);
        let /** @type {?} */ end = attrName.sourceSpan.end;
        let /** @type {?} */ value = "";
        let /** @type {?} */ valueSpan = /** @type {?} */ ((undefined));
        if (this._peek.type === lex.TokenType.ATTR_VALUE) {
            const /** @type {?} */ valueToken = this._advance();
            value = valueToken.parts[0];
            end = valueToken.sourceSpan.end;
            valueSpan = valueToken.sourceSpan;
        }
        return new html.Attribute(fullName, value, new ParseSourceSpan(attrName.sourceSpan.start, end), valueSpan);
    }
    /**
     * @return {?}
     */
    _getParentElement() {
        return this._elementStack.length > 0 ? this._elementStack[this._elementStack.length - 1] : null;
    }
    /**
     * Returns the parent in the DOM and the container.
     *
     * `<ng-container>` elements are skipped as they are not rendered as DOM element.
     * @return {?}
     */
    _getParentElementSkippingContainers() {
        let /** @type {?} */ container = null;
        for (let /** @type {?} */ i = this._elementStack.length - 1; i >= 0; i--) {
            if (!isNgContainer(this._elementStack[i].name)) {
                return { parent: this._elementStack[i], container };
            }
            container = this._elementStack[i];
        }
        return { parent: null, container };
    }
    /**
     * @param {?} node
     * @return {?}
     */
    _addToParent(node) {
        const /** @type {?} */ parent = this._getParentElement();
        if (parent !== null) {
            parent.children.push(node);
        }
        else {
            this._rootNodes.push(node);
        }
    }
    /**
     * Insert a node between the parent and the container.
     * When no container is given, the node is appended as a child of the parent.
     * Also updates the element stack accordingly.
     *
     * \@internal
     * @param {?} parent
     * @param {?} container
     * @param {?} node
     * @return {?}
     */
    _insertBeforeContainer(parent, container, node) {
        if (!container) {
            this._addToParent(node);
            this._elementStack.push(node);
        }
        else {
            if (parent) {
                // replace the container with the new node in the children
                const /** @type {?} */ index = parent.children.indexOf(container);
                parent.children[index] = node;
            }
            else {
                this._rootNodes.push(node);
            }
            node.children.push(container);
            this._elementStack.splice(this._elementStack.indexOf(container), 0, node);
        }
    }
    /**
     * @param {?} prefix
     * @param {?} localName
     * @param {?} parentElement
     * @return {?}
     */
    _getElementFullName(prefix, localName, parentElement) {
        if (prefix === null) {
            prefix = /** @type {?} */ ((this.getTagDefinition(localName).implicitNamespacePrefix));
            if (prefix === null && parentElement !== null) {
                prefix = getNsPrefix(parentElement.name);
            }
        }
        return mergeNsAndName(prefix, localName);
    }
}
function _TreeBuilder_tsickle_Closure_declarations() {
    /** @type {?} */
    _TreeBuilder.prototype._index;
    /** @type {?} */
    _TreeBuilder.prototype._peek;
    /** @type {?} */
    _TreeBuilder.prototype._rootNodes;
    /** @type {?} */
    _TreeBuilder.prototype._errors;
    /** @type {?} */
    _TreeBuilder.prototype._elementStack;
    /** @type {?} */
    _TreeBuilder.prototype.tokens;
    /** @type {?} */
    _TreeBuilder.prototype.getTagDefinition;
}
/**
 * @param {?} stack
 * @param {?} element
 * @return {?}
 */
function lastOnStack(stack, element) {
    return stack.length > 0 && stack[stack.length - 1] === element;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9hc3QvcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBU0EsT0FBTyxFQUFDLFVBQVUsRUFBRSxlQUFlLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFekQsT0FBTyxLQUFLLElBQUksTUFBTSxPQUFPLENBQUM7QUFDOUIsT0FBTyxFQUFDLDRCQUE0QixFQUFzQixNQUFNLHdCQUF3QixDQUFDO0FBQ3pGLE9BQU8sS0FBSyxHQUFHLE1BQU0sU0FBUyxDQUFDO0FBQy9CLE9BQU8sRUFBZ0IsV0FBVyxFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFFakYsTUFBTSxnQkFBaUIsU0FBUSxVQUFVOzs7Ozs7SUFLdkMsWUFBbUIsV0FBMEIsRUFBRSxJQUFxQixFQUFFLEdBQVc7UUFDL0UsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQURBLGdCQUFXLEdBQVgsV0FBVyxDQUFlO0tBRTVDOzs7Ozs7O0lBTkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUEwQixFQUFFLElBQXFCLEVBQUUsR0FBVztRQUMxRSxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM5QztDQUtGOzs7OztBQUVELE1BQU07Ozs7O0lBQ0osWUFBbUIsU0FBc0IsRUFBUyxNQUFvQjtRQUFuRCxjQUFTLEdBQVQsU0FBUyxDQUFhO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBYztLQUFJO0NBQzNFOzs7Ozs7O0FBRUQsTUFBTTs7OztJQUNKLFlBQW1CLGdCQUFvRDtRQUFwRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQW9DO0tBQUk7Ozs7Ozs7O0lBRTNFLEtBQUssQ0FDSCxNQUFjLEVBQ2QsR0FBVyxFQUNYLG1CQUFtQixHQUFHLEtBQUss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QUM7WUFDbkUsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxhQUFhLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDOUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUM7U0FDRjtRQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztDQUU1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVELHFCQUFxQixLQUFZLEVBQUUsT0FBWTtJQUM3QyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDO0NBQ2hFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuaW1wb3J0IHtQYXJzZUVycm9yLCBQYXJzZVNvdXJjZVNwYW59IGZyb20gXCIuL3BhcnNlX3V0aWxcIjtcblxuaW1wb3J0ICogYXMgaHRtbCBmcm9tIFwiLi9hc3RcIjtcbmltcG9ydCB7REVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRywgSW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSBcIi4vaW50ZXJwb2xhdGlvbl9jb25maWdcIjtcbmltcG9ydCAqIGFzIGxleCBmcm9tIFwiLi9sZXhlclwiO1xuaW1wb3J0IHtUYWdEZWZpbml0aW9uLCBnZXROc1ByZWZpeCwgaXNOZ0NvbnRhaW5lciwgbWVyZ2VOc0FuZE5hbWV9IGZyb20gXCIuL3RhZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFRyZWVFcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBzdGF0aWMgY3JlYXRlKGVsZW1lbnROYW1lOiBzdHJpbmcgfCBudWxsLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKTogVHJlZUVycm9yIHtcbiAgICByZXR1cm4gbmV3IFRyZWVFcnJvcihlbGVtZW50TmFtZSwgc3BhbiwgbXNnKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50TmFtZTogc3RyaW5nIHwgbnVsbCwgc3BhbjogUGFyc2VTb3VyY2VTcGFuLCBtc2c6IHN0cmluZykge1xuICAgIHN1cGVyKHNwYW4sIG1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlVHJlZVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByb290Tm9kZXM6IGh0bWwuTm9kZVtdLCBwdWJsaWMgZXJyb3JzOiBQYXJzZUVycm9yW10pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZ2V0VGFnRGVmaW5pdGlvbjogKHRhZ05hbWU6IHN0cmluZykgPT4gVGFnRGVmaW5pdGlvbikge31cblxuICBwYXJzZShcbiAgICBzb3VyY2U6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBwYXJzZUV4cGFuc2lvbkZvcm1zID0gZmFsc2UsXG4gICAgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyA9IERFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUdcbiAgKTogUGFyc2VUcmVlUmVzdWx0IHtcbiAgICBjb25zdCB0b2tlbnNBbmRFcnJvcnMgPSBsZXgudG9rZW5pemUoc291cmNlLCB1cmwsIHRoaXMuZ2V0VGFnRGVmaW5pdGlvbiwgcGFyc2VFeHBhbnNpb25Gb3JtcywgaW50ZXJwb2xhdGlvbkNvbmZpZyk7XG5cbiAgICBjb25zdCB0cmVlQW5kRXJyb3JzID0gbmV3IF9UcmVlQnVpbGRlcih0b2tlbnNBbmRFcnJvcnMudG9rZW5zLCB0aGlzLmdldFRhZ0RlZmluaXRpb24pLmJ1aWxkKCk7XG5cbiAgICByZXR1cm4gbmV3IFBhcnNlVHJlZVJlc3VsdChcbiAgICAgIHRyZWVBbmRFcnJvcnMucm9vdE5vZGVzLFxuICAgICAgKHRva2Vuc0FuZEVycm9ycy5lcnJvcnMgYXMgUGFyc2VFcnJvcltdKS5jb25jYXQodHJlZUFuZEVycm9ycy5lcnJvcnMpXG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBfVHJlZUJ1aWxkZXIge1xuICBwcml2YXRlIF9pbmRleCA9IC0xO1xuICBwcml2YXRlIF9wZWVrOiBsZXguVG9rZW47XG5cbiAgcHJpdmF0ZSBfcm9vdE5vZGVzOiBodG1sLk5vZGVbXSA9IFtdO1xuICBwcml2YXRlIF9lcnJvcnM6IFRyZWVFcnJvcltdID0gW107XG5cbiAgcHJpdmF0ZSBfZWxlbWVudFN0YWNrOiBodG1sLkVsZW1lbnRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdG9rZW5zOiBsZXguVG9rZW5bXSwgcHJpdmF0ZSBnZXRUYWdEZWZpbml0aW9uOiAodGFnTmFtZTogc3RyaW5nKSA9PiBUYWdEZWZpbml0aW9uKSB7XG4gICAgdGhpcy5fYWR2YW5jZSgpO1xuICB9XG5cbiAgYnVpbGQoKTogUGFyc2VUcmVlUmVzdWx0IHtcbiAgICB3aGlsZSAodGhpcy5fcGVlay50eXBlICE9PSBsZXguVG9rZW5UeXBlLkVPRikge1xuICAgICAgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5UQUdfT1BFTl9TVEFSVCkge1xuICAgICAgICB0aGlzLl9jb25zdW1lU3RhcnRUYWcodGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLlRBR19DTE9TRSkge1xuICAgICAgICB0aGlzLl9jb25zdW1lRW5kVGFnKHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5DREFUQV9TVEFSVCkge1xuICAgICAgICB0aGlzLl9jbG9zZVZvaWRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVDZGF0YSh0aGlzLl9hZHZhbmNlKCkpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuQ09NTUVOVF9TVEFSVCkge1xuICAgICAgICB0aGlzLl9jbG9zZVZvaWRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVDb21tZW50KHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuVEVYVCB8fFxuICAgICAgICB0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuUkFXX1RFWFQgfHxcbiAgICAgICAgdGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlVm9pZEVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5fY29uc3VtZVRleHQodGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUKSB7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVFeHBhbnNpb24odGhpcy5fYWR2YW5jZSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNraXAgYWxsIG90aGVyIHRva2Vucy4uLlxuICAgICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUGFyc2VUcmVlUmVzdWx0KHRoaXMuX3Jvb3ROb2RlcywgdGhpcy5fZXJyb3JzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FkdmFuY2UoKTogbGV4LlRva2VuIHtcbiAgICBjb25zdCBwcmV2ID0gdGhpcy5fcGVlaztcbiAgICBpZiAodGhpcy5faW5kZXggPCB0aGlzLnRva2Vucy5sZW5ndGggLSAxKSB7XG4gICAgICAvLyBOb3RlOiB0aGVyZSBpcyBhbHdheXMgYW4gRU9GIHRva2VuIGF0IHRoZSBlbmRcbiAgICAgIHRoaXMuX2luZGV4Kys7XG4gICAgfVxuICAgIHRoaXMuX3BlZWsgPSB0aGlzLnRva2Vuc1t0aGlzLl9pbmRleF07XG4gICAgcmV0dXJuIHByZXY7XG4gIH1cblxuICBwcml2YXRlIF9hZHZhbmNlSWYodHlwZTogbGV4LlRva2VuVHlwZSk6IGxleC5Ub2tlbiB8IG51bGwge1xuICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IHR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUNkYXRhKHN0YXJ0VG9rZW46IGxleC5Ub2tlbikge1xuICAgIHRoaXMuX2NvbnN1bWVUZXh0KHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgdGhpcy5fYWR2YW5jZUlmKGxleC5Ub2tlblR5cGUuQ0RBVEFfRU5EKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVDb21tZW50KHRva2VuOiBsZXguVG9rZW4pIHtcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5fYWR2YW5jZUlmKGxleC5Ub2tlblR5cGUuUkFXX1RFWFQpO1xuICAgIHRoaXMuX2FkdmFuY2VJZihsZXguVG9rZW5UeXBlLkNPTU1FTlRfRU5EKTtcbiAgICBjb25zdCB2YWx1ZSA9IHRleHQgIT09IG51bGwgPyB0ZXh0LnBhcnRzWzBdLnRyaW0oKSA6IG51bGw7XG4gICAgdGhpcy5fYWRkVG9QYXJlbnQobmV3IGh0bWwuQ29tbWVudCh2YWx1ZSwgdG9rZW4uc291cmNlU3BhbikpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUV4cGFuc2lvbih0b2tlbjogbGV4LlRva2VuKSB7XG4gICAgY29uc3Qgc3dpdGNoVmFsdWUgPSB0aGlzLl9hZHZhbmNlKCk7XG5cbiAgICBjb25zdCB0eXBlID0gdGhpcy5fYWR2YW5jZSgpO1xuICAgIGNvbnN0IGNhc2VzOiBodG1sLkV4cGFuc2lvbkNhc2VbXSA9IFtdO1xuXG4gICAgLy8gcmVhZCA9XG4gICAgd2hpbGUgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9WQUxVRSkge1xuICAgICAgY29uc3QgZXhwQ2FzZSA9IHRoaXMuX3BhcnNlRXhwYW5zaW9uQ2FzZSgpO1xuICAgICAgaWYgKCFleHBDYXNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gLy8gZXJyb3JcbiAgICAgIGNhc2VzLnB1c2goZXhwQ2FzZSk7XG4gICAgfVxuXG4gICAgLy8gcmVhZCB0aGUgZmluYWwgfVxuICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgIT09IGxleC5Ub2tlblR5cGUuRVhQQU5TSU9OX0ZPUk1fRU5EKSB7XG4gICAgICB0aGlzLl9lcnJvcnMucHVzaChUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHRoaXMuX3BlZWsuc291cmNlU3BhbiwgYEludmFsaWQgSUNVIG1lc3NhZ2UuIE1pc3NpbmcgJ30nLmApKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlU3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4odG9rZW4uc291cmNlU3Bhbi5zdGFydCwgdGhpcy5fcGVlay5zb3VyY2VTcGFuLmVuZCk7XG4gICAgdGhpcy5fYWRkVG9QYXJlbnQoXG4gICAgICBuZXcgaHRtbC5FeHBhbnNpb24oc3dpdGNoVmFsdWUucGFydHNbMF0sIHR5cGUucGFydHNbMF0sIGNhc2VzLCBzb3VyY2VTcGFuLCBzd2l0Y2hWYWx1ZS5zb3VyY2VTcGFuKVxuICAgICk7XG5cbiAgICB0aGlzLl9hZHZhbmNlKCk7XG4gIH1cblxuICBwcml2YXRlIF9wYXJzZUV4cGFuc2lvbkNhc2UoKTogaHRtbC5FeHBhbnNpb25DYXNlIHwgbnVsbCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hZHZhbmNlKCk7XG5cbiAgICAvLyByZWFkIHtcbiAgICBpZiAodGhpcy5fcGVlay50eXBlICE9PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCkge1xuICAgICAgdGhpcy5fZXJyb3JzLnB1c2goVHJlZUVycm9yLmNyZWF0ZShudWxsLCB0aGlzLl9wZWVrLnNvdXJjZVNwYW4sIGBJbnZhbGlkIElDVSBtZXNzYWdlLiBNaXNzaW5nICd7Jy5gKSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyByZWFkIHVudGlsIH1cbiAgICBjb25zdCBzdGFydCA9IHRoaXMuX2FkdmFuY2UoKTtcblxuICAgIGNvbnN0IGV4cCA9IHRoaXMuX2NvbGxlY3RFeHBhbnNpb25FeHBUb2tlbnMoc3RhcnQpO1xuICAgIGlmICghZXhwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBlbmQgPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgZXhwLnB1c2gobmV3IGxleC5Ub2tlbihsZXguVG9rZW5UeXBlLkVPRiwgW10sIGVuZC5zb3VyY2VTcGFuKSk7XG5cbiAgICAvLyBwYXJzZSBldmVyeXRoaW5nIGluIGJldHdlZW4geyBhbmQgfVxuICAgIGNvbnN0IHBhcnNlZEV4cCA9IG5ldyBfVHJlZUJ1aWxkZXIoZXhwLCB0aGlzLmdldFRhZ0RlZmluaXRpb24pLmJ1aWxkKCk7XG4gICAgaWYgKHBhcnNlZEV4cC5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fZXJyb3JzID0gdGhpcy5fZXJyb3JzLmNvbmNhdChwYXJzZWRFeHAuZXJyb3JzIGFzIFRyZWVFcnJvcltdKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZVNwYW4gPSBuZXcgUGFyc2VTb3VyY2VTcGFuKHZhbHVlLnNvdXJjZVNwYW4uc3RhcnQsIGVuZC5zb3VyY2VTcGFuLmVuZCk7XG4gICAgY29uc3QgZXhwU291cmNlU3BhbiA9IG5ldyBQYXJzZVNvdXJjZVNwYW4oc3RhcnQuc291cmNlU3Bhbi5zdGFydCwgZW5kLnNvdXJjZVNwYW4uZW5kKTtcbiAgICByZXR1cm4gbmV3IGh0bWwuRXhwYW5zaW9uQ2FzZSh2YWx1ZS5wYXJ0c1swXSwgcGFyc2VkRXhwLnJvb3ROb2Rlcywgc291cmNlU3BhbiwgdmFsdWUuc291cmNlU3BhbiwgZXhwU291cmNlU3Bhbik7XG4gIH1cblxuICBwcml2YXRlIF9jb2xsZWN0RXhwYW5zaW9uRXhwVG9rZW5zKHN0YXJ0OiBsZXguVG9rZW4pOiBsZXguVG9rZW5bXSB8IG51bGwge1xuICAgIGNvbnN0IGV4cDogbGV4LlRva2VuW10gPSBbXTtcbiAgICBjb25zdCBleHBhbnNpb25Gb3JtU3RhY2sgPSBbbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlRdO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUIHx8XG4gICAgICAgIHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlRcbiAgICAgICkge1xuICAgICAgICBleHBhbnNpb25Gb3JtU3RhY2sucHVzaCh0aGlzLl9wZWVrLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9FTkQpIHtcbiAgICAgICAgaWYgKGxhc3RPblN0YWNrKGV4cGFuc2lvbkZvcm1TdGFjaywgbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlQpKSB7XG4gICAgICAgICAgZXhwYW5zaW9uRm9ybVN0YWNrLnBvcCgpO1xuICAgICAgICAgIGlmIChleHBhbnNpb25Gb3JtU3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9lcnJvcnMucHVzaChUcmVlRXJyb3IuY3JlYXRlKG51bGwsIHN0YXJ0LnNvdXJjZVNwYW4sIGBJbnZhbGlkIElDVSBtZXNzYWdlLiBNaXNzaW5nICd9Jy5gKSk7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fRk9STV9FTkQpIHtcbiAgICAgICAgaWYgKGxhc3RPblN0YWNrKGV4cGFuc2lvbkZvcm1TdGFjaywgbGV4LlRva2VuVHlwZS5FWFBBTlNJT05fRk9STV9TVEFSVCkpIHtcbiAgICAgICAgICBleHBhbnNpb25Gb3JtU3RhY2sucG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZXJyb3JzLnB1c2goVHJlZUVycm9yLmNyZWF0ZShudWxsLCBzdGFydC5zb3VyY2VTcGFuLCBgSW52YWxpZCBJQ1UgbWVzc2FnZS4gTWlzc2luZyAnfScuYCkpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9wZWVrLnR5cGUgPT09IGxleC5Ub2tlblR5cGUuRU9GKSB7XG4gICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKFRyZWVFcnJvci5jcmVhdGUobnVsbCwgc3RhcnQuc291cmNlU3BhbiwgYEludmFsaWQgSUNVIG1lc3NhZ2UuIE1pc3NpbmcgJ30nLmApKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGV4cC5wdXNoKHRoaXMuX2FkdmFuY2UoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVRleHQodG9rZW46IGxleC5Ub2tlbikge1xuICAgIGxldCB0ZXh0ID0gdG9rZW4ucGFydHNbMF07XG4gICAgaWYgKHRleHQubGVuZ3RoID4gMCAmJiB0ZXh0WzBdID09PSBcIlxcblwiKSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG4gICAgICBpZiAocGFyZW50ICE9PSBudWxsICYmIHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPT09IDAgJiYgdGhpcy5nZXRUYWdEZWZpbml0aW9uKHBhcmVudC5uYW1lKS5pZ25vcmVGaXJzdExmKSB7XG4gICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hZGRUb1BhcmVudChuZXcgaHRtbC5UZXh0KHRleHQsIHRva2VuLnNvdXJjZVNwYW4pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jbG9zZVZvaWRFbGVtZW50KCk6IHZvaWQge1xuICAgIGNvbnN0IGVsID0gdGhpcy5fZ2V0UGFyZW50RWxlbWVudCgpO1xuICAgIGlmIChlbCAmJiB0aGlzLmdldFRhZ0RlZmluaXRpb24oZWwubmFtZSkuaXNWb2lkKSB7XG4gICAgICB0aGlzLl9lbGVtZW50U3RhY2sucG9wKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVN0YXJ0VGFnKHN0YXJ0VGFnVG9rZW46IGxleC5Ub2tlbikge1xuICAgIGNvbnN0IHByZWZpeCA9IHN0YXJ0VGFnVG9rZW4ucGFydHNbMF07XG4gICAgY29uc3QgbmFtZSA9IHN0YXJ0VGFnVG9rZW4ucGFydHNbMV07XG4gICAgY29uc3QgYXR0cnM6IGh0bWwuQXR0cmlidXRlW10gPSBbXTtcbiAgICB3aGlsZSAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkFUVFJfTkFNRSkge1xuICAgICAgYXR0cnMucHVzaCh0aGlzLl9jb25zdW1lQXR0cih0aGlzLl9hZHZhbmNlKCkpKTtcbiAgICB9XG4gICAgY29uc3QgZnVsbE5hbWUgPSB0aGlzLl9nZXRFbGVtZW50RnVsbE5hbWUocHJlZml4LCBuYW1lLCB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCkpO1xuICAgIGxldCBzZWxmQ2xvc2luZyA9IGZhbHNlO1xuICAgIC8vIE5vdGU6IFRoZXJlIGNvdWxkIGhhdmUgYmVlbiBhIHRva2VuaXplciBlcnJvclxuICAgIC8vIHNvIHRoYXQgd2UgZG9uJ3QgZ2V0IGEgdG9rZW4gZm9yIHRoZSBlbmQgdGFnLi4uXG4gICAgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5UQUdfT1BFTl9FTkRfVk9JRCkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgc2VsZkNsb3NpbmcgPSB0cnVlO1xuICAgICAgY29uc3QgdGFnRGVmID0gdGhpcy5nZXRUYWdEZWZpbml0aW9uKGZ1bGxOYW1lKTtcbiAgICAgIGlmICghKHRhZ0RlZi5jYW5TZWxmQ2xvc2UgfHwgZ2V0TnNQcmVmaXgoZnVsbE5hbWUpICE9PSBudWxsIHx8IHRhZ0RlZi5pc1ZvaWQpKSB7XG4gICAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKFxuICAgICAgICAgIFRyZWVFcnJvci5jcmVhdGUoXG4gICAgICAgICAgICBmdWxsTmFtZSxcbiAgICAgICAgICAgIHN0YXJ0VGFnVG9rZW4uc291cmNlU3BhbixcbiAgICAgICAgICAgIGBPbmx5IHZvaWQgYW5kIGZvcmVpZ24gZWxlbWVudHMgY2FuIGJlIHNlbGYgY2xvc2VkIFwiJHtzdGFydFRhZ1Rva2VuLnBhcnRzWzFdfVwiYFxuICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuX3BlZWsudHlwZSA9PT0gbGV4LlRva2VuVHlwZS5UQUdfT1BFTl9FTkQpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHNlbGZDbG9zaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHRoaXMuX3BlZWsuc291cmNlU3Bhbi5zdGFydDtcbiAgICBjb25zdCBzcGFuID0gbmV3IFBhcnNlU291cmNlU3BhbihzdGFydFRhZ1Rva2VuLnNvdXJjZVNwYW4uc3RhcnQsIGVuZCk7XG4gICAgY29uc3QgZWwgPSBuZXcgaHRtbC5FbGVtZW50KGZ1bGxOYW1lLCBhdHRycywgW10sIHNwYW4sIHNwYW4sIHVuZGVmaW5lZCk7XG4gICAgdGhpcy5fcHVzaEVsZW1lbnQoZWwpO1xuICAgIGlmIChzZWxmQ2xvc2luZykge1xuICAgICAgdGhpcy5fcG9wRWxlbWVudChmdWxsTmFtZSk7XG4gICAgICBlbC5lbmRTb3VyY2VTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9wdXNoRWxlbWVudChlbDogaHRtbC5FbGVtZW50KSB7XG4gICAgY29uc3QgcGFyZW50RWwgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCk7XG5cbiAgICBpZiAocGFyZW50RWwgJiYgdGhpcy5nZXRUYWdEZWZpbml0aW9uKHBhcmVudEVsLm5hbWUpLmlzQ2xvc2VkQnlDaGlsZChlbC5uYW1lKSkge1xuICAgICAgdGhpcy5fZWxlbWVudFN0YWNrLnBvcCgpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ0RlZiA9IHRoaXMuZ2V0VGFnRGVmaW5pdGlvbihlbC5uYW1lKTtcbiAgICBjb25zdCB7cGFyZW50LCBjb250YWluZXJ9ID0gdGhpcy5fZ2V0UGFyZW50RWxlbWVudFNraXBwaW5nQ29udGFpbmVycygpO1xuXG4gICAgaWYgKHBhcmVudCAmJiB0YWdEZWYucmVxdWlyZUV4dHJhUGFyZW50KHBhcmVudC5uYW1lKSkge1xuICAgICAgY29uc3QgbmV3UGFyZW50ID0gbmV3IGh0bWwuRWxlbWVudChcbiAgICAgICAgdGFnRGVmLnBhcmVudFRvQWRkLFxuICAgICAgICBbXSxcbiAgICAgICAgW10sXG4gICAgICAgIGVsLnNvdXJjZVNwYW4sXG4gICAgICAgIGVsLnN0YXJ0U291cmNlU3BhbixcbiAgICAgICAgZWwuZW5kU291cmNlU3BhblxuICAgICAgKTtcbiAgICAgIHRoaXMuX2luc2VydEJlZm9yZUNvbnRhaW5lcihwYXJlbnQsIGNvbnRhaW5lciwgbmV3UGFyZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRUb1BhcmVudChlbCk7XG4gICAgdGhpcy5fZWxlbWVudFN0YWNrLnB1c2goZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUVuZFRhZyhlbmRUYWdUb2tlbjogbGV4LlRva2VuKSB7XG4gICAgY29uc3QgZnVsbE5hbWUgPSB0aGlzLl9nZXRFbGVtZW50RnVsbE5hbWUoZW5kVGFnVG9rZW4ucGFydHNbMF0sIGVuZFRhZ1Rva2VuLnBhcnRzWzFdLCB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KCkpO1xuXG4gICAgaWYgKHRoaXMuX2dldFBhcmVudEVsZW1lbnQoKSkge1xuICAgICAgdGhpcy5fZ2V0UGFyZW50RWxlbWVudCgpIS5lbmRTb3VyY2VTcGFuID0gZW5kVGFnVG9rZW4uc291cmNlU3BhbjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5nZXRUYWdEZWZpbml0aW9uKGZ1bGxOYW1lKS5pc1ZvaWQpIHtcbiAgICAgIHRoaXMuX2Vycm9ycy5wdXNoKFxuICAgICAgICBUcmVlRXJyb3IuY3JlYXRlKFxuICAgICAgICAgIGZ1bGxOYW1lLFxuICAgICAgICAgIGVuZFRhZ1Rva2VuLnNvdXJjZVNwYW4sXG4gICAgICAgICAgYFZvaWQgZWxlbWVudHMgZG8gbm90IGhhdmUgZW5kIHRhZ3MgXCIke2VuZFRhZ1Rva2VuLnBhcnRzWzFdfVwiYFxuICAgICAgICApXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BvcEVsZW1lbnQoZnVsbE5hbWUpKSB7XG4gICAgICBjb25zdCBlcnJNc2cgPSBgVW5leHBlY3RlZCBjbG9zaW5nIHRhZyBcIiR7XG4gICAgICAgIGZ1bGxOYW1lXG4gICAgICB9XCIuIEl0IG1heSBoYXBwZW4gd2hlbiB0aGUgdGFnIGhhcyBhbHJlYWR5IGJlZW4gY2xvc2VkIGJ5IGFub3RoZXIgdGFnLiBGb3IgbW9yZSBpbmZvIHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvc3ludGF4Lmh0bWwjY2xvc2luZy1lbGVtZW50cy10aGF0LWhhdmUtaW1wbGllZC1lbmQtdGFnc2A7XG4gICAgICB0aGlzLl9lcnJvcnMucHVzaChUcmVlRXJyb3IuY3JlYXRlKGZ1bGxOYW1lLCBlbmRUYWdUb2tlbi5zb3VyY2VTcGFuLCBlcnJNc2cpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9wb3BFbGVtZW50KGZ1bGxOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBmb3IgKGxldCBzdGFja0luZGV4ID0gdGhpcy5fZWxlbWVudFN0YWNrLmxlbmd0aCAtIDE7IHN0YWNrSW5kZXggPj0gMDsgc3RhY2tJbmRleC0tKSB7XG4gICAgICBjb25zdCBlbCA9IHRoaXMuX2VsZW1lbnRTdGFja1tzdGFja0luZGV4XTtcbiAgICAgIGlmIChlbC5uYW1lID09PSBmdWxsTmFtZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50U3RhY2suc3BsaWNlKHN0YWNrSW5kZXgsIHRoaXMuX2VsZW1lbnRTdGFjay5sZW5ndGggLSBzdGFja0luZGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5nZXRUYWdEZWZpbml0aW9uKGVsLm5hbWUpLmNsb3NlZEJ5UGFyZW50KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUF0dHIoYXR0ck5hbWU6IGxleC5Ub2tlbik6IGh0bWwuQXR0cmlidXRlIHtcbiAgICBjb25zdCBmdWxsTmFtZSA9IG1lcmdlTnNBbmROYW1lKGF0dHJOYW1lLnBhcnRzWzBdLCBhdHRyTmFtZS5wYXJ0c1sxXSk7XG4gICAgbGV0IGVuZCA9IGF0dHJOYW1lLnNvdXJjZVNwYW4uZW5kO1xuICAgIGxldCB2YWx1ZSA9IFwiXCI7XG4gICAgbGV0IHZhbHVlU3BhbjogUGFyc2VTb3VyY2VTcGFuID0gdW5kZWZpbmVkITtcbiAgICBpZiAodGhpcy5fcGVlay50eXBlID09PSBsZXguVG9rZW5UeXBlLkFUVFJfVkFMVUUpIHtcbiAgICAgIGNvbnN0IHZhbHVlVG9rZW4gPSB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICB2YWx1ZSA9IHZhbHVlVG9rZW4ucGFydHNbMF07XG4gICAgICBlbmQgPSB2YWx1ZVRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgICAgdmFsdWVTcGFuID0gdmFsdWVUb2tlbi5zb3VyY2VTcGFuO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IGh0bWwuQXR0cmlidXRlKGZ1bGxOYW1lLCB2YWx1ZSwgbmV3IFBhcnNlU291cmNlU3BhbihhdHRyTmFtZS5zb3VyY2VTcGFuLnN0YXJ0LCBlbmQpLCB2YWx1ZVNwYW4pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFyZW50RWxlbWVudCgpOiBodG1sLkVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFN0YWNrLmxlbmd0aCA+IDAgPyB0aGlzLl9lbGVtZW50U3RhY2tbdGhpcy5fZWxlbWVudFN0YWNrLmxlbmd0aCAtIDFdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBwYXJlbnQgaW4gdGhlIERPTSBhbmQgdGhlIGNvbnRhaW5lci5cbiAgICpcbiAgICogYDxuZy1jb250YWluZXI+YCBlbGVtZW50cyBhcmUgc2tpcHBlZCBhcyB0aGV5IGFyZSBub3QgcmVuZGVyZWQgYXMgRE9NIGVsZW1lbnQuXG4gICAqL1xuICBwcml2YXRlIF9nZXRQYXJlbnRFbGVtZW50U2tpcHBpbmdDb250YWluZXJzKCk6IHtwYXJlbnQ6IGh0bWwuRWxlbWVudCB8IG51bGw7IGNvbnRhaW5lcjogaHRtbC5FbGVtZW50IHwgbnVsbH0ge1xuICAgIGxldCBjb250YWluZXI6IGh0bWwuRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX2VsZW1lbnRTdGFjay5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKCFpc05nQ29udGFpbmVyKHRoaXMuX2VsZW1lbnRTdGFja1tpXS5uYW1lKSkge1xuICAgICAgICByZXR1cm4ge3BhcmVudDogdGhpcy5fZWxlbWVudFN0YWNrW2ldLCBjb250YWluZXJ9O1xuICAgICAgfVxuICAgICAgY29udGFpbmVyID0gdGhpcy5fZWxlbWVudFN0YWNrW2ldO1xuICAgIH1cblxuICAgIHJldHVybiB7cGFyZW50OiBudWxsLCBjb250YWluZXJ9O1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkVG9QYXJlbnQobm9kZTogaHRtbC5Ob2RlKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5fZ2V0UGFyZW50RWxlbWVudCgpO1xuICAgIGlmIChwYXJlbnQgIT09IG51bGwpIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yb290Tm9kZXMucHVzaChub2RlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGEgbm9kZSBiZXR3ZWVuIHRoZSBwYXJlbnQgYW5kIHRoZSBjb250YWluZXIuXG4gICAqIFdoZW4gbm8gY29udGFpbmVyIGlzIGdpdmVuLCB0aGUgbm9kZSBpcyBhcHBlbmRlZCBhcyBhIGNoaWxkIG9mIHRoZSBwYXJlbnQuXG4gICAqIEFsc28gdXBkYXRlcyB0aGUgZWxlbWVudCBzdGFjayBhY2NvcmRpbmdseS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9pbnNlcnRCZWZvcmVDb250YWluZXIocGFyZW50OiBodG1sLkVsZW1lbnQsIGNvbnRhaW5lcjogaHRtbC5FbGVtZW50IHwgbnVsbCwgbm9kZTogaHRtbC5FbGVtZW50KSB7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHRoaXMuX2FkZFRvUGFyZW50KG5vZGUpO1xuICAgICAgdGhpcy5fZWxlbWVudFN0YWNrLnB1c2gobm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgLy8gcmVwbGFjZSB0aGUgY29udGFpbmVyIHdpdGggdGhlIG5ldyBub2RlIGluIHRoZSBjaGlsZHJlblxuICAgICAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKGNvbnRhaW5lcik7XG4gICAgICAgIHBhcmVudC5jaGlsZHJlbltpbmRleF0gPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcm9vdE5vZGVzLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgICBub2RlLmNoaWxkcmVuLnB1c2goY29udGFpbmVyKTtcbiAgICAgIHRoaXMuX2VsZW1lbnRTdGFjay5zcGxpY2UodGhpcy5fZWxlbWVudFN0YWNrLmluZGV4T2YoY29udGFpbmVyKSwgMCwgbm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0RWxlbWVudEZ1bGxOYW1lKHByZWZpeDogc3RyaW5nLCBsb2NhbE5hbWU6IHN0cmluZywgcGFyZW50RWxlbWVudDogaHRtbC5FbGVtZW50IHwgbnVsbCk6IHN0cmluZyB7XG4gICAgaWYgKHByZWZpeCA9PT0gbnVsbCkge1xuICAgICAgcHJlZml4ID0gdGhpcy5nZXRUYWdEZWZpbml0aW9uKGxvY2FsTmFtZSkuaW1wbGljaXROYW1lc3BhY2VQcmVmaXghO1xuICAgICAgaWYgKHByZWZpeCA9PT0gbnVsbCAmJiBwYXJlbnRFbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHByZWZpeCA9IGdldE5zUHJlZml4KHBhcmVudEVsZW1lbnQubmFtZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lcmdlTnNBbmROYW1lKHByZWZpeCwgbG9jYWxOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsYXN0T25TdGFjayhzdGFjazogYW55W10sIGVsZW1lbnQ6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gc3RhY2subGVuZ3RoID4gMCAmJiBzdGFja1tzdGFjay5sZW5ndGggLSAxXSA9PT0gZWxlbWVudDtcbn1cbiJdfQ==