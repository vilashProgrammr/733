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
import * as xml from "./xml_helper";
import { I18nError } from "../ast/parse_util";
import { Parser } from "../ast/parser";
import { getXmlTagDefinition } from "../ast/xml_tags";
import { HtmlToXmlParser } from "./serializer";
import { digest } from "./digest";
const /** @type {?} */ _VERSION = "1.2";
const /** @type {?} */ _XMLNS = "urn:oasis:names:tc:xliff:document:1.2";
const /** @type {?} */ _PLACEHOLDER_TAG = "x";
const /** @type {?} */ _FILE_TAG = "file";
const /** @type {?} */ _SOURCE_TAG = "source";
const /** @type {?} */ _TARGET_TAG = "target";
const /** @type {?} */ _UNIT_TAG = "trans-unit";
const /** @type {?} */ _CONTEXT_GROUP_TAG = "context-group";
const /** @type {?} */ _CONTEXT_TAG = "context";
const /** @type {?} */ _DEFAULT_SOURCE_LANG = "en";
/**
 * @param {?} content
 * @return {?}
 */
export function xliffLoadToI18n(content) {
    // xliff to xml nodes
    const /** @type {?} */ xliffParser = new XliffParser();
    const { msgIdToHtml, errors } = xliffParser.parse(content);
    // xml nodes to i18n messages
    const /** @type {?} */ i18nMessagesById = {};
    const /** @type {?} */ converter = new XmlToI18n();
    Object.keys(msgIdToHtml).forEach(msgId => {
        const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId]);
        errors.push(...e);
        i18nMessagesById[msgId] = i18nNodes;
    });
    if (errors.length) {
        throw new Error(`xliff parse errors:\n${errors.join("\n")}`);
    }
    return i18nMessagesById;
}
/**
 * @param {?} content
 * @return {?}
 */
export function xliffLoadToXml(content) {
    const /** @type {?} */ parser = new HtmlToXmlParser(_UNIT_TAG);
    const { xmlMessagesById, errors } = parser.parse(content);
    if (errors.length) {
        throw new Error(`xliff parse errors:\n${errors.join("\n")}`);
    }
    return xmlMessagesById;
}
/**
 * @param {?} messages
 * @param {?} locale
 * @param {?=} existingNodes
 * @return {?}
 */
export function xliffWrite(messages, locale, existingNodes) {
    const /** @type {?} */ visitor = new WriteVisitor();
    const /** @type {?} */ transUnits = existingNodes && existingNodes.length ? [new xml.CR(6), ...existingNodes] : [];
    messages.forEach(message => {
        const /** @type {?} */ contextTags = [];
        message.sources.forEach((source) => {
            const /** @type {?} */ contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: "location" });
            contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "sourcefile" }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "linenumber" }, [new xml.Text(`${source.startLine}`)]), new xml.CR(8));
            contextTags.push(new xml.CR(8), contextGroupTag);
        });
        const /** @type {?} */ transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: "html" });
        transUnit.children.push(new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), ...contextTags);
        if (message.description) {
            transUnit.children.push(new xml.CR(8), new xml.Tag("note", { priority: "1", from: "description" }, [new xml.Text(message.description)]));
        }
        if (message.meaning) {
            transUnit.children.push(new xml.CR(8), new xml.Tag("note", { priority: "1", from: "meaning" }, [new xml.Text(message.meaning)]));
        }
        transUnit.children.push(new xml.CR(6));
        transUnits.push(new xml.CR(6), transUnit);
    });
    const /** @type {?} */ body = new xml.Tag("body", {}, [...transUnits, new xml.CR(4)]);
    const /** @type {?} */ file = new xml.Tag("file", {
        "source-language": locale || _DEFAULT_SOURCE_LANG,
        datatype: "plaintext",
        original: "ng2.template"
    }, [new xml.CR(4), body, new xml.CR(2)]);
    const /** @type {?} */ xliff = new xml.Tag("xliff", { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
    return xml.serialize([new xml.Declaration({ version: "1.0", encoding: "UTF-8" }), new xml.CR(), xliff, new xml.CR()]);
}
export const /** @type {?} */ xliffDigest = digest;
class XliffParser {
    /**
     * @param {?} content
     * @return {?}
     */
    parse(content) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const /** @type {?} */ parser = new Parser(getXmlTagDefinition).parse(content, "", false);
        this._errors = parser.errors;
        ml.visitAll(this, parser.rootNodes, null);
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
            case _UNIT_TAG:
                this._unitMlString = /** @type {?} */ ((null));
                const /** @type {?} */ idAttr = element.attrs.find(attr => attr.name === "id");
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG}> misses the "id" attribute`);
                }
                else {
                    const /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                        if (typeof this._unitMlString === "string") {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, `Message ${id} misses a translation`);
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                const /** @type {?} */ innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                const /** @type {?} */ innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                const /** @type {?} */ content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                const /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                ml.visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                ml.visitAll(this, element.children, null);
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
function XliffParser_tsickle_Closure_declarations() {
    /** @type {?} */
    XliffParser.prototype._unitMlString;
    /** @type {?} */
    XliffParser.prototype._errors;
    /** @type {?} */
    XliffParser.prototype._msgIdToHtml;
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
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const /** @type {?} */ nameAttr = el.attrs.find(attr => attr.name === "id");
            if (nameAttr) {
                return new i18n.Placeholder("", nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "id" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        const /** @type {?} */ caseMap = {};
        ml.visitAll(this, icu.cases).forEach((c) => {
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
class WriteVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) {
        return [new xml.Text(text.value)];
    }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ nodes = [new xml.Text(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new xml.Text(`${c} {`), ...icu.cases[c].visit(this), new xml.Text(`} `));
        });
        nodes.push(new xml.Text(`}`));
        return nodes;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, "equiv-text": `<${ph.tag}/>` })];
        }
        const /** @type {?} */ startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, "equiv-text": `<${ph.tag}>` });
        const /** @type {?} */ closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype, "equiv-text": `</${ph.tag}>` });
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": `{{${ph.value}}}` })];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        const /** @type {?} */ equivText = `{${ph.value.expression}, ${ph.value.type}, ${Object.keys(ph.value.cases)
            .map((value) => value + " {...}")
            .join(" ")}}`;
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": equivText })];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
/**
 * @param {?} tag
 * @return {?}
 */
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case "br":
            return "lb";
        case "img":
            return "image";
        default:
            return `x-${tag}`;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL3NlcmlhbGl6ZXJzL3hsaWZmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxLQUFLLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDakMsT0FBTyxLQUFLLElBQUksTUFBTSxpQkFBaUIsQ0FBQztBQUN4QyxPQUFPLEtBQUssR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUNwQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFvQyxNQUFNLGNBQWMsQ0FBQztBQUNoRixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWhDLHVCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdkIsdUJBQU0sTUFBTSxHQUFHLHVDQUF1QyxDQUFDO0FBQ3ZELHVCQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUM3Qix1QkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLHVCQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDN0IsdUJBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM3Qix1QkFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDO0FBQy9CLHVCQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQztBQUMzQyx1QkFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDO0FBQy9CLHVCQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQzs7Ozs7QUFFbEMsTUFBTSwwQkFBMEIsT0FBZTs7SUFFN0MsdUJBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFDdEMsTUFBTSxFQUFDLFdBQVcsRUFBRSxN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QUcsQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQzthQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNoQixNQUFNLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2hGOzs7OztJQUVELFNBQVMsQ0FBQyxLQUFrQjtRQUMxQixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMxRDtDQUNGOzs7OztBQUVELHdCQUF3QixHQUFXO0lBQ2pDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsS0FBSyxJQUFJO1lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLEtBQUssS0FBSztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakI7WUFDRSxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztLQUNyQjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBtbCBmcm9tIFwiLi4vYXN0L2FzdFwiO1xuaW1wb3J0ICogYXMgaTE4biBmcm9tIFwiLi4vYXN0L2kxOG5fYXN0XCI7XG5pbXBvcnQgKiBhcyB4bWwgZnJvbSBcIi4veG1sX2hlbHBlclwiO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gXCIuLi9hc3QvcGFyc2VfdXRpbFwiO1xuaW1wb3J0IHtQYXJzZXJ9IGZyb20gXCIuLi9hc3QvcGFyc2VyXCI7XG5pbXBvcnQge2dldFhtbFRhZ0RlZmluaXRpb259IGZyb20gXCIuLi9hc3QveG1sX3RhZ3NcIjtcbmltcG9ydCB7SHRtbFRvWG1sUGFyc2VyLCBJMThuTWVzc2FnZXNCeUlkLCBYbWxNZXNzYWdlc0J5SWR9IGZyb20gXCIuL3NlcmlhbGl6ZXJcIjtcbmltcG9ydCB7ZGlnZXN0fSBmcm9tIFwiLi9kaWdlc3RcIjtcblxuY29uc3QgX1ZFUlNJT04gPSBcIjEuMlwiO1xuY29uc3QgX1hNTE5TID0gXCJ1cm46b2FzaXM6bmFtZXM6dGM6eGxpZmY6ZG9jdW1lbnQ6MS4yXCI7XG5jb25zdCBfUExBQ0VIT0xERVJfVEFHID0gXCJ4XCI7XG5jb25zdCBfRklMRV9UQUcgPSBcImZpbGVcIjtcbmNvbnN0IF9TT1VSQ0VfVEFHID0gXCJzb3VyY2VcIjtcbmNvbnN0IF9UQVJHRVRfVEFHID0gXCJ0YXJnZXRcIjtcbmNvbnN0IF9VTklUX1RBRyA9IFwidHJhbnMtdW5pdFwiO1xuY29uc3QgX0NPTlRFWFRfR1JPVVBfVEFHID0gXCJjb250ZXh0LWdyb3VwXCI7XG5jb25zdCBfQ09OVEVYVF9UQUcgPSBcImNvbnRleHRcIjtcbmNvbnN0IF9ERUZBVUxUX1NPVVJDRV9MQU5HID0gXCJlblwiO1xuXG5leHBvcnQgZnVuY3Rpb24geGxpZmZMb2FkVG9JMThuKGNvbnRlbnQ6IHN0cmluZyk6IEkxOG5NZXNzYWdlc0J5SWQge1xuICAvLyB4bGlmZiB0byB4bWwgbm9kZXNcbiAgY29uc3QgeGxpZmZQYXJzZXIgPSBuZXcgWGxpZmZQYXJzZXIoKTtcbiAgY29uc3Qge21zZ0lkVG9IdG1sLCBlcnJvcnN9ID0geGxpZmZQYXJzZXIucGFyc2UoY29udGVudCk7XG5cbiAgLy8geG1sIG5vZGVzIHRvIGkxOG4gbWVzc2FnZXNcbiAgY29uc3QgaTE4bk1lc3NhZ2VzQnlJZDoge1ttc2dJZDogc3RyaW5nXTogaTE4bi5Ob2RlW119ID0ge307XG4gIGNvbnN0IGNvbnZlcnRlciA9IG5ldyBYbWxUb0kxOG4oKTtcblxuICBPYmplY3Qua2V5cyhtc2dJZFRvSHRtbCkuZm9yRWFjaChtc2dJZCA9PiB7XG4gICAgY29uc3Qge2kxOG5Ob2RlcywgZXJyb3JzOiBlfSA9IGNvbnZlcnRlci5jb252ZXJ0KG1zZ0lkVG9IdG1sW21zZ0lkXSk7XG4gICAgZXJyb3JzLnB1c2goLi4uZSk7XG4gICAgaTE4bk1lc3NhZ2VzQnlJZFttc2dJZF0gPSBpMThuTm9kZXM7XG4gIH0pO1xuXG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB4bGlmZiBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvcnMuam9pbihcIlxcblwiKX1gKTtcbiAgfVxuXG4gIHJldHVybiBpMThuTWVzc2FnZXNCeUlkO1xufVxuXG4vLyB1c2VkIHRvIG1lcmdlIHRyYW5zbGF0aW9ucyB3aGVuIGV4dHJhY3RpbmdcbmV4cG9ydCBmdW5jdGlvbiB4bGlmZkxvYWRUb1htbChjb250ZW50OiBzdHJpbmcpOiBYbWxNZXNzYWdlc0J5SWQge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgSHRtbFRvWG1sUGFyc2VyKF9VTklUX1RBRyk7XG4gIGNvbnN0IHt4bWxNZXNzYWdlc0J5SWQsIGVycm9yc30gPSBwYXJzZXIucGFyc2UoY29udGVudCk7XG5cbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHhsaWZmIHBhcnNlIGVycm9yczpcXG4ke2Vycm9ycy5qb2luKFwiXFxuXCIpfWApO1xuICB9XG5cbiAgcmV0dXJuIHhtbE1lc3NhZ2VzQnlJZDtcbn1cblxuLy8gaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYvdjEuMi9vcy94bGlmZi1jb3JlLmh0bWxcbi8vIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIveGxpZmYtcHJvZmlsZS1odG1sL3hsaWZmLXByb2ZpbGUtaHRtbC0xLjIuaHRtbFxuZXhwb3J0IGZ1bmN0aW9uIHhsaWZmV3JpdGUobWVzc2FnZXM6IGkxOG4uTWVzc2FnZVtdLCBsb2NhbGU6IHN0cmluZyB8IG51bGwsIGV4aXN0aW5nTm9kZXM/OiB4bWwuTm9kZVtdKTogc3RyaW5nIHtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBXcml0ZVZpc2l0b3IoKTtcbiAgY29uc3QgdHJhbnNVbml0czogeG1sLk5vZGVbXSA9IGV4aXN0aW5nTm9kZXMgJiYgZXhpc3RpbmdOb2Rlcy5sZW5ndGggPyBbbmV3IHhtbC5DUig2KSwgLi4uZXhpc3RpbmdOb2Rlc10gOiBbXTtcblxuICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IGNvbnRleHRUYWdzOiB4bWwuTm9kZVtdID0gW107XG4gICAgbWVzc2FnZS5zb3VyY2VzLmZvckVhY2goKHNvdXJjZTogaTE4bi5NZXNzYWdlU3BhbikgPT4ge1xuICAgICAgY29uc3QgY29udGV4dEdyb3VwVGFnID0gbmV3IHhtbC5UYWcoX0NPTlRFWFRfR1JPVVBfVEFHLCB7cHVycG9zZTogXCJsb2NhdGlvblwifSk7XG4gICAgICBjb250ZXh0R3JvdXBUYWcuY2hpbGRyZW4ucHVzaChcbiAgICAgICAgbmV3IHhtbC5DUigxMCksXG4gICAgICAgIG5ldyB4bWwuVGFnKF9DT05URVhUX1RBRywge1wiY29udGV4dC10eXBlXCI6IFwic291cmNlZmlsZVwifSwgW25ldyB4bWwuVGV4dChzb3VyY2UuZmlsZVBhdGgpXSksXG4gICAgICAgIG5ldyB4bWwuQ1IoMTApLFxuICAgICAgICBuZXcgeG1sLlRhZyhfQ09OVEVYVF9UQUcsIHtcImNvbnRleHQtdHlwZVwiOiBcImxpbmVudW1iZXJcIn0sIFtuZXcgeG1sLlRleHQoYCR7c291cmNlLnN0YXJ0TGluZX1gKV0pLFxuICAgICAgICBuZXcgeG1sLkNSKDgpXG4gICAgICApO1xuICAgICAgY29udGV4dFRhZ3MucHVzaChuZXcgeG1sLkNSKDgpLCBjb250ZXh0R3JvdXBUYWcpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdHJhbnNVbml0ID0gbmV3IHhtbC5UYWcoX1VOSVRfVEFHLCB7aWQ6IG1lc3NhZ2UuaWQsIGRhdGF0eXBlOiBcImh0bWxcIn0pO1xuICAgIHRyYW5zVW5pdC5jaGlsZHJlbi5wdXNoKFxuICAgICAgbmV3IHhtbC5DUig4KSxcbiAgICAgIG5ldyB4bWwuVGFnKF9TT1VSQ0VfVEFHLCB7fSwgdmlzaXRvci5zZXJpYWxpemUobWVzc2FnZS5ub2RlcykpLFxuICAgICAgLi4uY29udGV4dFRhZ3NcbiAgICApO1xuXG4gICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgIHRyYW5zVW5pdC5jaGlsZHJlbi5wdXNoKFxuICAgICAgICBuZXcgeG1sLkNSKDgpLFxuICAgICAgICBuZXcgeG1sLlRhZyhcIm5vdGVcIiwge3ByaW9yaXR5OiBcIjFcIiwgZnJvbTogXCJkZXNjcmlwdGlvblwifSwgW25ldyB4bWwuVGV4dChtZXNzYWdlLmRlc2NyaXB0aW9uKV0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgIHRyYW5zVW5pdC5jaGlsZHJlbi5wdXNoKFxuICAgICAgICBuZXcgeG1sLkNSKDgpLFxuICAgICAgICBuZXcgeG1sLlRhZyhcIm5vdGVcIiwge3ByaW9yaXR5OiBcIjFcIiwgZnJvbTogXCJtZWFuaW5nXCJ9LCBbbmV3IHhtbC5UZXh0KG1lc3NhZ2UubWVhbmluZyldKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0cmFuc1VuaXQuY2hpbGRyZW4ucHVzaChuZXcgeG1sLkNSKDYpKTtcblxuICAgIHRyYW5zVW5pdHMucHVzaChuZXcgeG1sLkNSKDYpLCB0cmFuc1VuaXQpO1xuICB9KTtcblxuICBjb25zdCBib2R5ID0gbmV3IHhtbC5UYWcoXCJib2R5XCIsIHt9LCBbLi4udHJhbnNVbml0cywgbmV3IHhtbC5DUig0KV0pO1xuICBjb25zdCBmaWxlID0gbmV3IHhtbC5UYWcoXG4gICAgXCJmaWxlXCIsXG4gICAge1xuICAgICAgXCJzb3VyY2UtbGFuZ3VhZ2VcIjogbG9jYWxlIHx8IF9ERUZBVUxUX1NPVVJDRV9MQU5HLFxuICAgICAgZGF0YXR5cGU6IFwicGxhaW50ZXh0XCIsXG4gICAgICBvcmlnaW5hbDogXCJuZzIudGVtcGxhdGVcIlxuICAgIH0sXG4gICAgW25ldyB4bWwuQ1IoNCksIGJvZHksIG5ldyB4bWwuQ1IoMildXG4gICk7XG4gIGNvbnN0IHhsaWZmID0gbmV3IHhtbC5UYWcoXCJ4bGlmZlwiLCB7dmVyc2lvbjogX1ZFUlNJT04sIHhtbG5zOiBfWE1MTlN9LCBbbmV3IHhtbC5DUigyKSwgZmlsZSwgbmV3IHhtbC5DUigpXSk7XG5cbiAgcmV0dXJuIHhtbC5zZXJpYWxpemUoW25ldyB4bWwuRGVjbGFyYXRpb24oe3ZlcnNpb246IFwiMS4wXCIsIGVuY29kaW5nOiBcIlVURi04XCJ9KSwgbmV3IHhtbC5DUigpLCB4bGlmZiwgbmV3IHhtbC5DUigpXSk7XG59XG5cbmV4cG9ydCBjb25zdCB4bGlmZkRpZ2VzdCA9IGRpZ2VzdDtcblxuLy8gRXh0cmFjdCBtZXNzYWdlcyBhcyB4bWwgbm9kZXMgZnJvbSB0aGUgeGxpZmYgZmlsZVxuY2xhc3MgWGxpZmZQYXJzZXIgaW1wbGVtZW50cyBtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBfdW5pdE1sU3RyaW5nOiBzdHJpbmcgfCBudWxsO1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdO1xuICBwcml2YXRlIF9tc2dJZFRvSHRtbDoge1ttc2dJZDogc3RyaW5nXTogc3RyaW5nfTtcblxuICBwYXJzZShjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLl91bml0TWxTdHJpbmcgPSBudWxsO1xuICAgIHRoaXMuX21zZ0lkVG9IdG1sID0ge307XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGdldFhtbFRhZ0RlZmluaXRpb24pLnBhcnNlKGNvbnRlbnQsIFwiXCIsIGZhbHNlKTtcbiAgICB0aGlzLl9lcnJvcnMgPSBwYXJzZXIuZXJyb3JzO1xuICAgIG1sLnZpc2l0QWxsKHRoaXMsIHBhcnNlci5yb290Tm9kZXMsIG51bGwpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1zZ0lkVG9IdG1sOiB0aGlzLl9tc2dJZFRvSHRtbCxcbiAgICAgIGVycm9yczogdGhpcy5fZXJyb3JzXG4gICAgfTtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBtbC5FbGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN3aXRjaCAoZWxlbWVudC5uYW1lKSB7XG4gICAgICBjYXNlIF9VTklUX1RBRzpcbiAgICAgICAgdGhpcy5fdW5pdE1sU3RyaW5nID0gbnVsbCE7XG4gICAgICAgIGNvbnN0IGlkQXR0ciA9IGVsZW1lbnQuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJpZFwiKTtcbiAgICAgICAgaWYgKCFpZEF0dHIpIHtcbiAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbGVtZW50LCBgPCR7X1VOSVRfVEFHfT4gbWlzc2VzIHRoZSBcImlkXCIgYXR0cmlidXRlYCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaWQgPSBpZEF0dHIudmFsdWU7XG4gICAgICAgICAgaWYgKHRoaXMuX21zZ0lkVG9IdG1sLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYER1cGxpY2F0ZWQgdHJhbnNsYXRpb25zIGZvciBtc2cgJHtpZH1gKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbnVsbCk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuX3VuaXRNbFN0cmluZyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICB0aGlzLl9tc2dJZFRvSHRtbFtpZF0gPSB0aGlzLl91bml0TWxTdHJpbmc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbGVtZW50LCBgTWVzc2FnZSAke2lkfSBtaXNzZXMgYSB0cmFuc2xhdGlvbmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBfU09VUkNFX1RBRzpcbiAgICAgICAgLy8gaWdub3JlIHNvdXJjZSBtZXNzYWdlXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIF9UQVJHRVRfVEFHOlxuICAgICAgICBjb25zdCBpbm5lclRleHRTdGFydCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuIS5lbmQub2Zmc2V0O1xuICAgICAgICBjb25zdCBpbm5lclRleHRFbmQgPSBlbGVtZW50LmVuZFNvdXJjZVNwYW4hLnN0YXJ0Lm9mZnNldDtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGVsZW1lbnQuc3RhcnRTb3VyY2VTcGFuIS5zdGFydC5maWxlLmNvbnRlbnQ7XG4gICAgICAgIGNvbnN0IGlubmVyVGV4dCA9IGNvbnRlbnQuc2xpY2UoaW5uZXJUZXh0U3RhcnQsIGlubmVyVGV4dEVuZCk7XG4gICAgICAgIHRoaXMuX3VuaXRNbFN0cmluZyA9IGlubmVyVGV4dDtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgX0ZJTEVfVEFHOlxuICAgICAgICBtbC52aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIFRPRE8odmljYik6IGFzc2VydCBmaWxlIHN0cnVjdHVyZSwgeGxpZmYgdmVyc2lvblxuICAgICAgICAvLyBGb3Igbm93IG9ubHkgcmVjdXJzZSBvbiB1bmhhbmRsZWQgbm9kZXNcbiAgICAgICAgbWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBtbC5UZXh0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICBwcml2YXRlIF9hZGRFcnJvcihub2RlOiBtbC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG5vZGUuc291cmNlU3BhbiEsIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IG1sIG5vZGVzICh4bGlmZiBzeW50YXgpIHRvIGkxOG4gbm9kZXNcbmNsYXNzIFhtbFRvSTE4biBpbXBsZW1lbnRzIG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdO1xuXG4gIGNvbnZlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgeG1sSWN1ID0gbmV3IFBhcnNlcihnZXRYbWxUYWdEZWZpbml0aW9uKS5wYXJzZShtZXNzYWdlLCBcIlwiLCB0cnVlKTtcbiAgICB0aGlzLl9lcnJvcnMgPSB4bWxJY3UuZXJyb3JzO1xuXG4gICAgY29uc3QgaTE4bk5vZGVzID1cbiAgICAgIHRoaXMuX2Vycm9ycy5sZW5ndGggPiAwIHx8IHhtbEljdS5yb290Tm9kZXMubGVuZ3RoID09PSAwID8gW10gOiBtbC52aXNpdEFsbCh0aGlzLCB4bWxJY3Uucm9vdE5vZGVzKTtcblxuICAgIHJldHVybiB7XG4gICAgICBpMThuTm9kZXMsXG4gICAgICBlcnJvcnM6IHRoaXMuX2Vycm9yc1xuICAgIH07XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogbWwuVGV4dCwgY29udGV4dDogYW55KSB7XG4gICAgcmV0dXJuIG5ldyBpMThuLlRleHQodGV4dC52YWx1ZSwgdGV4dC5zb3VyY2VTcGFuISk7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWw6IG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGkxOG4uUGxhY2Vob2xkZXIgfCBudWxsIHtcbiAgICBpZiAoZWwubmFtZSA9PT0gX1BMQUNFSE9MREVSX1RBRykge1xuICAgICAgY29uc3QgbmFtZUF0dHIgPSBlbC5hdHRycy5maW5kKGF0dHIgPT4gYXR0ci5uYW1lID09PSBcImlkXCIpO1xuICAgICAgaWYgKG5hbWVBdHRyKSB7XG4gICAgICAgIHJldHVybiBuZXcgaTE4bi5QbGFjZWhvbGRlcihcIlwiLCBuYW1lQXR0ci52YWx1ZSwgZWwuc291cmNlU3BhbiEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9hZGRFcnJvcihlbCwgYDwke19QTEFDRUhPTERFUl9UQUd9PiBtaXNzZXMgdGhlIFwiaWRcIiBhdHRyaWJ1dGVgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYWRkRXJyb3IoZWwsIGBVbmV4cGVjdGVkIHRhZ2ApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uKGljdTogbWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpIHtcbiAgICBjb25zdCBjYXNlTWFwOiB7W3ZhbHVlOiBzdHJpbmddOiBpMThuLk5vZGV9ID0ge307XG5cbiAgICBtbC52aXNpdEFsbCh0aGlzLCBpY3UuY2FzZXMpLmZvckVhY2goKGM6IGFueSkgPT4ge1xuICAgICAgY2FzZU1hcFtjLnZhbHVlXSA9IG5ldyBpMThuLkNvbnRhaW5lcihjLm5vZGVzLCBpY3Uuc291cmNlU3Bhbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IGkxOG4uSWN1KGljdS5zd2l0Y2hWYWx1ZSwgaWN1LnR5cGUsIGNhc2VNYXAsIGljdS5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShpY3VDYXNlOiBtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogaWN1Q2FzZS52YWx1ZSxcbiAgICAgIG5vZGVzOiBtbC52aXNpdEFsbCh0aGlzLCBpY3VDYXNlLmV4cHJlc3Npb24pXG4gICAgfTtcbiAgfVxuXG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBtbC5Db21tZW50LCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSkge31cblxuICBwcml2YXRlIF9hZGRFcnJvcihub2RlOiBtbC5Ob2RlLCBtZXNzYWdlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG5vZGUuc291cmNlU3BhbiEsIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG5jbGFzcyBXcml0ZVZpc2l0b3IgaW1wbGVtZW50cyBpMThuLlZpc2l0b3Ige1xuICB2aXNpdFRleHQodGV4dDogaTE4bi5UZXh0LCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgcmV0dXJuIFtuZXcgeG1sLlRleHQodGV4dC52YWx1ZSldO1xuICB9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBpMThuLkNvbnRhaW5lciwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IG5vZGVzOiB4bWwuTm9kZVtdID0gW107XG4gICAgY29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2goKG5vZGU6IGkxOG4uTm9kZSkgPT4gbm9kZXMucHVzaCguLi5ub2RlLnZpc2l0KHRoaXMpKSk7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgdmlzaXRJY3UoaWN1OiBpMThuLkljdSwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IG5vZGVzID0gW25ldyB4bWwuVGV4dChgeyR7aWN1LmV4cHJlc3Npb25QbGFjZWhvbGRlcn0sICR7aWN1LnR5cGV9LCBgKV07XG5cbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgbm9kZXMucHVzaChuZXcgeG1sLlRleHQoYCR7Y30ge2ApLCAuLi5pY3UuY2FzZXNbY10udmlzaXQodGhpcyksIG5ldyB4bWwuVGV4dChgfSBgKSk7XG4gICAgfSk7XG5cbiAgICBub2Rlcy5wdXNoKG5ldyB4bWwuVGV4dChgfWApKTtcblxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIHZpc2l0VGFnUGxhY2Vob2xkZXIocGg6IGkxOG4uVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBjdHlwZSA9IGdldEN0eXBlRm9yVGFnKHBoLnRhZyk7XG5cbiAgICBpZiAocGguaXNWb2lkKSB7XG4gICAgICAvLyB2b2lkIHRhZ3MgaGF2ZSBubyBjaGlsZHJlbiBub3IgY2xvc2luZyB0YWdzXG4gICAgICByZXR1cm4gW25ldyB4bWwuVGFnKF9QTEFDRUhPTERFUl9UQUcsIHtpZDogcGguc3RhcnROYW1lLCBjdHlwZSwgXCJlcXVpdi10ZXh0XCI6IGA8JHtwaC50YWd9Lz5gfSldO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0VGFnUGggPSBuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7aWQ6IHBoLnN0YXJ0TmFtZSwgY3R5cGUsIFwiZXF1aXYtdGV4dFwiOiBgPCR7cGgudGFnfT5gfSk7XG4gICAgY29uc3QgY2xvc2VUYWdQaCA9IG5ldyB4bWwuVGFnKF9QTEFDRUhPTERFUl9UQUcsIHtpZDogcGguY2xvc2VOYW1lLCBjdHlwZSwgXCJlcXVpdi10ZXh0XCI6IGA8LyR7cGgudGFnfT5gfSk7XG5cbiAgICByZXR1cm4gW3N0YXJ0VGFnUGgsIC4uLnRoaXMuc2VyaWFsaXplKHBoLmNoaWxkcmVuKSwgY2xvc2VUYWdQaF07XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBpMThuLlBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgcmV0dXJuIFtuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7aWQ6IHBoLm5hbWUsIFwiZXF1aXYtdGV4dFwiOiBge3ske3BoLnZhbHVlfX19YH0pXTtcbiAgfVxuXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IGkxOG4uSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBlcXVpdlRleHQgPSBgeyR7cGgudmFsdWUuZXhwcmVzc2lvbn0sICR7cGgudmFsdWUudHlwZX0sICR7T2JqZWN0LmtleXMocGgudmFsdWUuY2FzZXMpXG4gICAgICAubWFwKCh2YWx1ZTogc3RyaW5nKSA9PiB2YWx1ZSArIFwiIHsuLi59XCIpXG4gICAgICAuam9pbihcIiBcIil9fWA7XG4gICAgcmV0dXJuIFtuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7aWQ6IHBoLm5hbWUsIFwiZXF1aXYtdGV4dFwiOiBlcXVpdlRleHR9KV07XG4gIH1cblxuICBzZXJpYWxpemUobm9kZXM6IGkxOG4uTm9kZVtdKTogeG1sLk5vZGVbXSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdCguLi5ub2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q3R5cGVGb3JUYWcodGFnOiBzdHJpbmcpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHRhZy50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSBcImJyXCI6XG4gICAgICByZXR1cm4gXCJsYlwiO1xuICAgIGNhc2UgXCJpbWdcIjpcbiAgICAgIHJldHVybiBcImltYWdlXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgeC0ke3RhZ31gO1xuICB9XG59XG4iXX0=