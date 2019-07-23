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
import * as ml from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import { I18nError } from "../ast/parse_util";
import { Parser } from "../ast/parser";
import { getXmlTagDefinition } from "../ast/xml_tags";
import { digest } from "./digest";
import { xmbMapper } from "./xmb";
const /** @type {?} */ _TRANSLATIONS_TAG = "translationbundle";
const /** @type {?} */ _TRANSLATION_TAG = "translation";
const /** @type {?} */ _PLACEHOLDER_TAG = "ph";
/**
 * @param {?} content
 * @return {?}
 */
export function xtbLoadToI18n(content) {
    // xtb to xml nodes
    const /** @type {?} */ xtbParser = new XtbParser();
    const { msgIdToHtml, errors: parseErrors } = xtbParser.parse(content);
    if (parseErrors.length) {
        throw new Error(`xtb parse errors:\n${parseErrors.join("\n")}`);
    }
    // xml nodes to i18n nodes
    const /** @type {?} */ i18nNodesByMsgId = {};
    const /** @type {?} */ converter = new XmlToI18n();
    // Because we should be able to load xtb files that rely on features not supported by angular,
    // we need to delay the conversion of html to i18n nodes so that non angular messages are not
    // converted
    Object.keys(msgIdToHtml).forEach(msgId => {
        const /** @type {?} */ valueFn = () => {
            const { i18nNodes, errors } = converter.convert(msgIdToHtml[msgId]);
            if (errors.length) {
                throw new Error(`xtb parse errors:\n${errors.join("\n")}`);
            }
            return i18nNodes;
        };
        createLazyProperty(i18nNodesByMsgId, msgId, valueFn);
    });
    return i18nNodesByMsgId;
}
export const /** @type {?} */ xtbDigest = digest;
export const /** @type {?} */ xtbMapper = xmbMapper;
/**
 * @param {?} messages
 * @param {?} id
 * @param {?} valueFn
 * @return {?}
 */
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: () => {
            const /** @type {?} */ value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value });
            return value;
        },
        set: _ => {
            throw new Error("Could not overwrite an XTB translation");
        }
    });
}
class XtbParser {
    /**
     * @param {?} xtb
     * @return {?}
     */
    parse(xtb) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        const /** @type {?} */ xml = new Parser(getXmlTagDefinition).parse(xtb, "", false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case _TRANSLATIONS_TAG:
                this._bundleDepth++;
                if (this._bundleDepth > 1) {
                    this._addError(element, `<${_TRANSLATIONS_TAG}> elements can not be nested`);
                }
                ml.visitAll(this, element.children, null);
                this._bundleDepth--;
                break;
            case _TRANSLATION_TAG:
                const /** @type {?} */ idAttr = element.attrs.find(attr => attr.name === "id");
                if (!idAttr) {
                    this._addError(element, `<${_TRANSLATION_TAG}> misses the "id" attribute`);
                }
                else {
                    const /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        const /** @type {?} */ innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                        const /** @type {?} */ innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                        const /** @type {?} */ content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                        const /** @type {?} */ innerText = content.slice(/** @type {?} */ ((innerTextStart)), /** @type {?} */ ((innerTextEnd)));
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, "Unexpected tag");
        }
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) { }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
function XtbParser_tsickle_Closure_declarations() {
    /** @type {?} */
    XtbParser.prototype._bundleDepth;
    /** @type {?} */
    XtbParser.prototype._errors;
    /** @type {?} */
    XtbParser.prototype._msgIdToHtml;
}
class XmlToI18n {
    /**
     * @param {?} message
     * @return {?}
     */
    convert(message) {
        const /** @type {?} */ xmlIcu = new Parser(getXmlTagDefinition).parse(message, "", true);
        this._errors = xmlIcu.errors;
        const /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length === 0 ? [] : ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes,
            errors: this._errors
        };
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        return new i18n.Text(text.value, /** @type {?} */ ((text.sourceSpan)));
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        const /** @type {?} */ caseMap = {};
        ml.visitAll(this, icu.cases).forEach(c => {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression)
        };
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const /** @type {?} */ nameAttr = el.attrs.find(attr => attr.name === "name");
            if (nameAttr) {
                return new i18n.Placeholder("", nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "name" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) { }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) { }
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    _addError(node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    }
}
function XmlToI18n_tsickle_Closure_declarations() {
    /** @type {?} */
    XmlToI18n.prototype._errors;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHRiLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9zZXJpYWxpemVycy94dGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNqQyxPQUFPLEtBQUssSUFBSSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXBELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDaEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUVoQyx1QkFBTSxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQztBQUM5Qyx1QkFBTSxnQkFBZ0IsR0FBRyxhQUFhLENBQUM7QUFDdkMsdUJBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOzs7OztBQUU5QixNQUFNLHdCQUF3QixPQUFlOztJQUUzQyx1QkFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztJQUNsQyxNQUFNLEVBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXBFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2pFOztJQUdELHVCQUFNLGdCQUFnQixHQUFtQyxFQUFFLENBQUM7SUFDNUQsdUJBQU0sU0FBUyxHQUFHLElBQUksU0FBUyxFQUFF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QUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLElBQUksZ0JBQWdCLCtCQUErQixDQUFDLENBQUM7U0FDekU7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDdEM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ2I7Ozs7OztJQUVELFlBQVksQ0FBQyxPQUFtQixFQUFFLE9BQVksS0FBSTs7Ozs7O0lBRWxELGNBQWMsQ0FBQyxTQUF1QixFQUFFLE9BQVksS0FBSTs7Ozs7O0lBRWhELFNBQVMsQ0FBQyxJQUFhLEVBQUUsT0FBZTtRQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsb0JBQUMsSUFBSSxDQUFDLFVBQVUsSUFBRyxPQUFPLENBQUMsQ0FBQyxDQUFDOztDQUUvRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbWwgZnJvbSBcIi4uL2FzdC9hc3RcIjtcbmltcG9ydCAqIGFzIGkxOG4gZnJvbSBcIi4uL2FzdC9pMThuX2FzdFwiO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gXCIuLi9hc3QvcGFyc2VfdXRpbFwiO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gXCIuLi9hc3QvcGFyc2VyXCI7XG5pbXBvcnQge2dldFhtbFRhZ0RlZmluaXRpb259IGZyb20gXCIuLi9hc3QveG1sX3RhZ3NcIjtcbmltcG9ydCB7STE4bk1lc3NhZ2VzQnlJZH0gZnJvbSBcIi4vc2VyaWFsaXplclwiO1xuaW1wb3J0IHtkaWdlc3R9IGZyb20gXCIuL2RpZ2VzdFwiO1xuaW1wb3J0IHt4bWJNYXBwZXJ9IGZyb20gXCIuL3htYlwiO1xuXG5jb25zdCBfVFJBTlNMQVRJT05TX1RBRyA9IFwidHJhbnNsYXRpb25idW5kbGVcIjtcbmNvbnN0IF9UUkFOU0xBVElPTl9UQUcgPSBcInRyYW5zbGF0aW9uXCI7XG5jb25zdCBfUExBQ0VIT0xERVJfVEFHID0gXCJwaFwiO1xuXG5leHBvcnQgZnVuY3Rpb24geHRiTG9hZFRvSTE4bihjb250ZW50OiBzdHJpbmcpOiBJMThuTWVzc2FnZXNCeUlkIHtcbiAgLy8geHRiIHRvIHhtbCBub2Rlc1xuICBjb25zdCB4dGJQYXJzZXIgPSBuZXcgWHRiUGFyc2VyKCk7XG4gIGNvbnN0IHttc2dJZFRvSHRtbCwgZXJyb3JzOiBwYXJzZUVycm9yc30gPSB4dGJQYXJzZXIucGFyc2UoY29udGVudCk7XG5cbiAgaWYgKHBhcnNlRXJyb3JzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgeHRiIHBhcnNlIGVycm9yczpcXG4ke3BhcnNlRXJyb3JzLmpvaW4oXCJcXG5cIil9YCk7XG4gIH1cblxuICAvLyB4bWwgbm9kZXMgdG8gaTE4biBub2Rlc1xuICBjb25zdCBpMThuTm9kZXNCeU1zZ0lkOiB7W21zZ0lkOiBzdHJpbmddOiBpMThuLk5vZGVbXX0gPSB7fTtcbiAgY29uc3QgY29udmVydGVyID0gbmV3IFhtbFRvSTE4bigpO1xuXG4gIC8vIEJlY2F1c2Ugd2Ugc2hvdWxkIGJlIGFibGUgdG8gbG9hZCB4dGIgZmlsZXMgdGhhdCByZWx5IG9uIGZlYXR1cmVzIG5vdCBzdXBwb3J0ZWQgYnkgYW5ndWxhcixcbiAgLy8gd2UgbmVlZCB0byBkZWxheSB0aGUgY29udmVyc2lvbiBvZiBodG1sIHRvIGkxOG4gbm9kZXMgc28gdGhhdCBub24gYW5ndWxhciBtZXNzYWdlcyBhcmUgbm90XG4gIC8vIGNvbnZlcnRlZFxuICBPYmplY3Qua2V5cyhtc2dJZFRvSHRtbCkuZm9yRWFjaChtc2dJZCA9PiB7XG4gICAgY29uc3QgdmFsdWVGbiA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHtpMThuTm9kZXMsIGVycm9yc30gPSBjb252ZXJ0ZXIuY29udmVydChtc2dJZFRvSHRtbFttc2dJZF0pO1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB4dGIgcGFyc2UgZXJyb3JzOlxcbiR7ZXJyb3JzLmpvaW4oXCJcXG5cIil9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaTE4bk5vZGVzO1xuICAgIH07XG4gICAgY3JlYXRlTGF6eVByb3BlcnR5KGkxOG5Ob2Rlc0J5TXNnSWQsIG1zZ0lkLCB2YWx1ZUZuKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGkxOG5Ob2Rlc0J5TXNnSWQ7XG59XG5cbmV4cG9ydCBjb25zdCB4dGJEaWdlc3QgPSBkaWdlc3Q7XG5cbmV4cG9ydCBjb25zdCB4dGJNYXBwZXIgPSB4bWJNYXBwZXI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUxhenlQcm9wZXJ0eShtZXNzYWdlczogYW55LCBpZDogc3RyaW5nLCB2YWx1ZUZuOiAoKSA9PiBhbnkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1lc3NhZ2VzLCBpZCwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogKCkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZUZuKCk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWVzc2FnZXMsIGlkLCB7ZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWV9KTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIHNldDogXyA9PiB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3Qgb3ZlcndyaXRlIGFuIFhUQiB0cmFuc2xhdGlvblwiKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBFeHRyYWN0IG1lc3NhZ2VzIGFzIHhtbCBub2RlcyBmcm9tIHRoZSB4dGIgZmlsZVxuY2xhc3MgWHRiUGFyc2VyIGltcGxlbWVudHMgbWwuVmlzaXRvciB7XG4gIHByaXZhdGUgX2J1bmRsZURlcHRoOiBudW1iZXI7XG4gIHByaXZhdGUgX2Vycm9yczogSTE4bkVycm9yW107XG4gIHByaXZhdGUgX21zZ0lkVG9IdG1sOiB7W21zZ0lkOiBzdHJpbmddOiBzdHJpbmd9O1xuXG4gIHBhcnNlKHh0Yjogc3RyaW5nKSB7XG4gICAgdGhpcy5fYnVuZGxlRGVwdGggPSAwO1xuICAgIHRoaXMuX21zZ0lkVG9IdG1sID0ge307XG5cbiAgICAvLyBXZSBjYW4gbm90IHBhcnNlIHRoZSBJQ1UgbWVzc2FnZXMgYXQgdGhpcyBwb2ludCBhcyBzb21lIG1lc3NhZ2VzIG1pZ2h0IG5vdCBvcmlnaW5hdGVcbiAgICAvLyBmcm9tIEFuZ3VsYXIgdGhhdCBjb3VsZCBub3QgYmUgbGV4J2QuXG4gICAgY29uc3QgeG1sID0gbmV3IFBhcnNlcihnZXRYbWxUYWdEZWZpbml0aW9uKS5wYXJzZSh4dGIsIFwiXCIsIGZhbHNlKTtcblxuICAgIHRoaXMuX2Vycm9ycyA9IHhtbC5lcnJvcnM7XG4gICAgbWwudmlzaXRBbGwodGhpcywgeG1sLnJvb3ROb2Rlcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbXNnSWRUb0h0bWw6IHRoaXMuX21zZ0lkVG9IdG1sLFxuICAgICAgZXJyb3JzOiB0aGlzLl9lcnJvcnNcbiAgICB9O1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgc3dpdGNoIChlbGVtZW50Lm5hbWUpIHtcbiAgICAgIGNhc2UgX1RSQU5TTEFUSU9OU19UQUc6XG4gICAgICAgIHRoaXMuX2J1bmRsZURlcHRoKys7XG4gICAgICAgIGlmICh0aGlzLl9idW5kbGVEZXB0aCA+IDEpIHtcbiAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbGVtZW50LCBgPCR7X1RSQU5TTEFUSU9OU19UQUd9PiBlbGVtZW50cyBjYW4gbm90IGJlIG5lc3RlZGApO1xuICAgICAgICB9XG4gICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgICAgICB0aGlzLl9idW5kbGVEZXB0aC0tO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBfVFJBTlNMQVRJT05fVEFHOlxuICAgICAgICBjb25zdCBpZEF0dHIgPSBlbGVtZW50LmF0dHJzLmZpbmQoYXR0ciA9PiBhdHRyLm5hbWUgPT09IFwiaWRcIik7XG4gICAgICAgIGlmICghaWRBdHRyKSB7XG4gICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYDwke19UUkFOU0xBVElPTl9UQUd9PiBtaXNzZXMgdGhlIFwiaWRcIiBhdHRyaWJ1dGVgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpZCA9IGlkQXR0ci52YWx1ZTtcbiAgICAgICAgICBpZiAodGhpcy5fbXNnSWRUb0h0bWwuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbGVtZW50LCBgRHVwbGljYXRlZCB0cmFuc2xhdGlvbnMgZm9yIG1zZyAke2lkfWApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBpbm5lclRleHRTdGFydCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuIS5lbmQub2Zmc2V0O1xuICAgICAgICAgICAgY29uc3QgaW5uZXJUZXh0RW5kID0gZWxlbWVudC5lbmRTb3VyY2VTcGFuIS5zdGFydC5vZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZWxlbWVudC5zdGFydFNvdXJjZVNwYW4hLnN0YXJ0LmZpbGUuY29udGVudDtcbiAgICAgICAgICAgIGNvbnN0IGlubmVyVGV4dCA9IGNvbnRlbnQuc2xpY2UoaW5uZXJUZXh0U3RhcnQhLCBpbm5lclRleHRFbmQhKTtcbiAgICAgICAgICAgIHRoaXMuX21zZ0lkVG9IdG1sW2lkXSA9IGlubmVyVGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsIFwiVW5leHBlY3RlZCB0YWdcIik7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBtbC5UZXh0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICBwcml2YXRlIF9hZGRFcnJvcihub2RlOiBtbC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG5vZGUuc291cmNlU3BhbiEsIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IG1sIG5vZGVzICh4dGIgc3ludGF4KSB0byBpMThuIG5vZGVzXG5jbGFzcyBYbWxUb0kxOG4gaW1wbGVtZW50cyBtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBfZXJyb3JzOiBJMThuRXJyb3JbXTtcblxuICBjb252ZXJ0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHhtbEljdSA9IG5ldyBQYXJzZXIoZ2V0WG1sVGFnRGVmaW5pdGlvbikucGFyc2UobWVzc2FnZSwgXCJcIiwgdHJ1ZSk7XG4gICAgdGhpcy5fZXJyb3JzID0geG1sSWN1LmVycm9ycztcblxuICAgIGNvbnN0IGkxOG5Ob2RlcyA9XG4gICAgICB0aGlzLl9lcnJvcnMubGVuZ3RoID4gMCB8fCB4bWxJY3Uucm9vdE5vZGVzLmxlbmd0aCA9PT0gMCA/IFtdIDogbWwudmlzaXRBbGwodGhpcywgeG1sSWN1LnJvb3ROb2Rlcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaTE4bk5vZGVzLFxuICAgICAgZXJyb3JzOiB0aGlzLl9lcnJvcnNcbiAgICB9O1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IG1sLlRleHQsIGNvbnRleHQ6IGFueSkge1xuICAgIHJldHVybiBuZXcgaTE4bi5UZXh0KHRleHQudmFsdWUsIHRleHQuc291cmNlU3BhbiEpO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oaWN1OiBtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSkge1xuICAgIGNvbnN0IGNhc2VNYXA6IHtbdmFsdWU6IHN0cmluZ106IGkxOG4uTm9kZX0gPSB7fTtcblxuICAgIG1sLnZpc2l0QWxsKHRoaXMsIGljdS5jYXNlcykuZm9yRWFjaChjID0+IHtcbiAgICAgIGNhc2VNYXBbYy52YWx1ZV0gPSBuZXcgaTE4bi5Db250YWluZXIoYy5ub2RlcywgaWN1LnNvdXJjZVNwYW4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBpMThuLkljdShpY3Uuc3dpdGNoVmFsdWUsIGljdS50eXBlLCBjYXNlTWFwLCBpY3Uuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoaWN1Q2FzZTogbWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGljdUNhc2UudmFsdWUsXG4gICAgICBub2RlczogbWwudmlzaXRBbGwodGhpcywgaWN1Q2FzZS5leHByZXNzaW9uKVxuICAgIH07XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWw6IG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGkxOG4uUGxhY2Vob2xkZXIgfCBudWxsIHtcbiAgICBpZiAoZWwubmFtZSA9PT0gX1BMQUNFSE9MREVSX1RBRykge1xuICAgICAgY29uc3QgbmFtZUF0dHIgPSBlbC5hdHRycy5maW5kKGF0dHIgPT4gYXR0ci5uYW1lID09PSBcIm5hbWVcIik7XG4gICAgICBpZiAobmFtZUF0dHIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBpMThuLlBsYWNlaG9sZGVyKFwiXCIsIG5hbWVBdHRyLnZhbHVlLCBlbC5zb3VyY2VTcGFuISk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgPCR7X1BMQUNFSE9MREVSX1RBR30+IG1pc3NlcyB0aGUgXCJuYW1lXCIgYXR0cmlidXRlYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgVW5leHBlY3RlZCB0YWdgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4hLCBtZXNzYWdlKSk7XG4gIH1cbn1cbiJdfQ==