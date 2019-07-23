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
import { Parser } from "../ast/parser";
import { getXmlTagDefinition } from "../ast/xml_tags";
import { I18nError } from "../ast/parse_util";
import { HtmlToXmlParser } from "./serializer";
import { decimalDigest } from "./digest";
const /** @type {?} */ _VERSION = "2.0";
const /** @type {?} */ _XMLNS = "urn:oasis:names:tc:xliff:document:2.0";
const /** @type {?} */ _DEFAULT_SOURCE_LANG = "en";
const /** @type {?} */ _PLACEHOLDER_TAG = "ph";
const /** @type {?} */ _PLACEHOLDER_SPANNING_TAG = "pc";
const /** @type {?} */ _XLIFF_TAG = "xliff";
const /** @type {?} */ _SOURCE_TAG = "source";
const /** @type {?} */ _TARGET_TAG = "target";
const /** @type {?} */ _UNIT_TAG = "unit";
const /** @type {?} */ _NOTES_TAG = "notes";
const /** @type {?} */ _NOTE_TAG = "note";
const /** @type {?} */ _SEGMENT_TAG = "segment";
const /** @type {?} */ _FILE_TAG = "file";
/**
 * @param {?} content
 * @return {?}
 */
export function xliff2LoadToI18n(content) {
    // xliff to xml nodes
    const /** @type {?} */ xliff2Parser = new Xliff2Parser();
    const { msgIdToHtml, errors } = xliff2Parser.parse(content);
    // xml nodes to i18n nodes
    const /** @type {?} */ i18nNodesByMsgId = {};
    const /** @type {?} */ converter = new XmlToI18n();
    Object.keys(msgIdToHtml).forEach(msgId => {
        const { i18nNodes, errors: e } = converter.convert(msgIdToHtml[msgId]);
        errors.push(...e);
        i18nNodesByMsgId[msgId] = i18nNodes;
    });
    if (errors.length) {
        throw new Error(`xliff2 parse errors:\n${errors.join("\n")}`);
    }
    return i18nNodesByMsgId;
}
/**
 * @param {?} content
 * @return {?}
 */
export function xliff2LoadToXml(content) {
    const /** @type {?} */ parser = new HtmlToXmlParser(_UNIT_TAG);
    const { xmlMessagesById, errors } = parser.parse(content);
    if (errors.length) {
        throw new Error(`xliff2 parse errors:\n${errors.join("\n")}`);
    }
    return xmlMessagesById;
}
/**
 * @param {?} messages
 * @param {?} locale
 * @param {?=} existingNodes
 * @return {?}
 */
export function xliff2Write(messages, locale, existingNodes) {
    const /** @type {?} */ visitor = new WriteVisitor();
    const /** @type {?} */ units = existingNodes && existingNodes.length ? [new xml.CR(4), ...existingNodes] : [];
    messages.forEach(message => {
        const /** @type {?} */ unit = new xml.Tag(_UNIT_TAG, { id: message.id });
        const /** @type {?} */ notes = new xml.Tag(_NOTES_TAG);
        if (message.description || message.meaning) {
            if (message.description) {
                notes.children.push(new xml.CR(8), new xml.Tag(_NOTE_TAG, { category: "description" }, [new xml.Text(message.description)]));
            }
            if (message.meaning) {
                notes.children.push(new xml.CR(8), new xml.Tag(_NOTE_TAG, { category: "meaning" }, [new xml.Text(message.meaning)]));
            }
        }
        message.sources.forEach((source) => {
            notes.children.push(new xml.CR(8), new xml.Tag(_NOTE_TAG, { category: "location" }, [
                new xml.Text(`${source.filePath}:${source.startLine}${source.endLine !== source.startLine ? "," + source.endLine : ""}`)
            ]));
        });
        notes.children.push(new xml.CR(6));
        unit.children.push(new xml.CR(6), notes);
        const /** @type {?} */ segment = new xml.Tag(_SEGMENT_TAG);
        segment.children.push(new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new xml.CR(6));
        unit.children.push(new xml.CR(6), segment, new xml.CR(4));
        units.push(new xml.CR(4), unit);
    });
    const /** @type {?} */ file = new xml.Tag(_FILE_TAG, { original: "ng.template", id: "ngi18n" }, [...units, new xml.CR(2)]);
    const /** @type {?} */ xliff = new xml.Tag(_XLIFF_TAG, { version: _VERSION, xmlns: _XMLNS, srcLang: locale || _DEFAULT_SOURCE_LANG }, [
        new xml.CR(2),
        file,
        new xml.CR()
    ]);
    return xml.serialize([new xml.Declaration({ version: "1.0", encoding: "UTF-8" }), new xml.CR(), xliff, new xml.CR()]);
}
export const /** @type {?} */ xliff2Digest = decimalDigest;
class Xliff2Parser {
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
                this._unitMlString = null;
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
            case _XLIFF_TAG:
                const /** @type {?} */ versionAttr = element.attrs.find(attr => attr.name === "version");
                if (versionAttr) {
                    const /** @type {?} */ version = versionAttr.value;
                    if (version !== "2.0") {
                        this._addError(element, `The XLIFF file version ${version} is not compatible with XLIFF 2.0 serializer`);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                    }
                }
                break;
            default:
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
        this._errors.push(new I18nError(node.sourceSpan, message));
    }
}
function Xliff2Parser_tsickle_Closure_declarations() {
    /** @type {?} */
    Xliff2Parser.prototype._unitMlString;
    /** @type {?} */
    Xliff2Parser.prototype._errors;
    /** @type {?} */
    Xliff2Parser.prototype._msgIdToHtml;
}
class XmlToI18n {
    /**
     * @param {?} message
     * @return {?}
     */
    convert(message) {
        const /** @type {?} */ xmlIcu = new Parser(getXmlTagDefinition).parse(message, "", true);
        this._errors = xmlIcu.errors;
        const /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length === 0 ? [] : [].concat(...ml.visitAll(this, xmlIcu.rootNodes));
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
        return new i18n.Text(text.value, text.sourceSpan);
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        switch (el.name) {
            case _PLACEHOLDER_TAG:
                const /** @type {?} */ nameAttr = el.attrs.find(attr => attr.name === "equiv");
                if (nameAttr) {
                    return [new i18n.Placeholder("", nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "equiv" attribute`);
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                const /** @type {?} */ startAttr = el.attrs.find(attr => attr.name === "equivStart");
                const /** @type {?} */ endAttr = el.attrs.find(attr => attr.name === "equivEnd");
                if (!startAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "equivStart" attribute`);
                }
                else if (!endAttr) {
                    this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "equivEnd" attribute`);
                }
                else {
                    const /** @type {?} */ startId = startAttr.value;
                    const /** @type {?} */ endId = endAttr.value;
                    const /** @type {?} */ nodes = [];
                    return nodes.concat(new i18n.Placeholder("", startId, el.sourceSpan), ...el.children.map(node => node.visit(this, null)), new i18n.Placeholder("", endId, el.sourceSpan));
                }
                break;
            default:
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
            nodes: [].concat(...ml.visitAll(this, icuCase.expression))
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
        this._errors.push(new I18nError(node.sourceSpan, message));
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
        const /** @type {?} */ type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            const /** @type {?} */ tagPh = new xml.Tag(_PLACEHOLDER_TAG, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type,
                disp: `<${ph.tag}/>`
            });
            return [tagPh];
        }
        const /** @type {?} */ tagPc = new xml.Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type,
            dispStart: `<${ph.tag}>`,
            dispEnd: `</${ph.tag}>`
        });
        const /** @type {?} */ nodes = [].concat(...ph.children.map(node => node.visit(this)));
        if (nodes.length) {
            nodes.forEach((node) => tagPc.children.push(node));
        }
        else {
            tagPc.children.push(new xml.Text(""));
        }
        return [tagPc];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        const /** @type {?} */ idStr = (this._nextPlaceholderId++).toString();
        return [
            new xml.Tag(_PLACEHOLDER_TAG, {
                id: idStr,
                equiv: ph.name,
                disp: `{{${ph.value}}}`
            })
        ];
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        const /** @type {?} */ cases = Object.keys(ph.value.cases)
            .map((value) => value + " {...}")
            .join(" ");
        const /** @type {?} */ idStr = (this._nextPlaceholderId++).toString();
        return [
            new xml.Tag(_PLACEHOLDER_TAG, {
                id: idStr,
                equiv: ph.name,
                disp: `{${ph.value.expression}, ${ph.value.type}, ${cases}}`
            })
        ];
    }
    /**
     * @param {?} nodes
     * @return {?}
     */
    serialize(nodes) {
        this._nextPlaceholderId = 0;
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
function WriteVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    WriteVisitor.prototype._nextPlaceholderId;
}
/**
 * @param {?} tag
 * @return {?}
 */
function getTypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case "br":
        case "b":
        case "i":
        case "u":
            return "fmt";
        case "img":
            return "image";
        case "a":
            return "link";
        default:
            return "other";
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9zZXJpYWxpemVycy94bGlmZjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEtBQUssRUFBRSxNQUFNLFlBQVksQ0FBQztBQUNqQyxPQUFPLEtBQUssSUFBSSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sS0FBSyxHQUFHLE1BQU0sY0FBYyxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxlQUFlLEVBQW9DLE1BQU0sY0FBYyxDQUFDO0FBQ2hGLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFdkMsdUJBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztBQUN2Qix1QkFBTSxNQUFNLEdBQUcsdUNBQXVDLENBQUM7QUFDdkQsdUJBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLHVCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM5Qix1QkFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUM7QUFDdkMsdUJBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQztBQUMzQix1QkFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLHVCQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDN0IsdUJBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN6Qix1QkFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDO0FBQzNCLHVCQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDekIsdUJBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUMvQix1QkFBTSxTQUFTLEdBQUcsTUFBTSxDQUFD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O0tBQ2xCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCAqIGFzIG1sIGZyb20gXCIuLi9hc3QvYXN0XCI7XG5pbXBvcnQgKiBhcyBpMThuIGZyb20gXCIuLi9hc3QvaTE4bl9hc3RcIjtcbmltcG9ydCAqIGFzIHhtbCBmcm9tIFwiLi94bWxfaGVscGVyXCI7XG5pbXBvcnQge1BhcnNlcn0gZnJvbSBcIi4uL2FzdC9wYXJzZXJcIjtcbmltcG9ydCB7Z2V0WG1sVGFnRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2FzdC94bWxfdGFnc1wiO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gXCIuLi9hc3QvcGFyc2VfdXRpbFwiO1xuaW1wb3J0IHtIdG1sVG9YbWxQYXJzZXIsIEkxOG5NZXNzYWdlc0J5SWQsIFhtbE1lc3NhZ2VzQnlJZH0gZnJvbSBcIi4vc2VyaWFsaXplclwiO1xuaW1wb3J0IHtkZWNpbWFsRGlnZXN0fSBmcm9tIFwiLi9kaWdlc3RcIjtcblxuY29uc3QgX1ZFUlNJT04gPSBcIjIuMFwiO1xuY29uc3QgX1hNTE5TID0gXCJ1cm46b2FzaXM6bmFtZXM6dGM6eGxpZmY6ZG9jdW1lbnQ6Mi4wXCI7XG5jb25zdCBfREVGQVVMVF9TT1VSQ0VfTEFORyA9IFwiZW5cIjtcbmNvbnN0IF9QTEFDRUhPTERFUl9UQUcgPSBcInBoXCI7XG5jb25zdCBfUExBQ0VIT0xERVJfU1BBTk5JTkdfVEFHID0gXCJwY1wiO1xuY29uc3QgX1hMSUZGX1RBRyA9IFwieGxpZmZcIjtcbmNvbnN0IF9TT1VSQ0VfVEFHID0gXCJzb3VyY2VcIjtcbmNvbnN0IF9UQVJHRVRfVEFHID0gXCJ0YXJnZXRcIjtcbmNvbnN0IF9VTklUX1RBRyA9IFwidW5pdFwiO1xuY29uc3QgX05PVEVTX1RBRyA9IFwibm90ZXNcIjtcbmNvbnN0IF9OT1RFX1RBRyA9IFwibm90ZVwiO1xuY29uc3QgX1NFR01FTlRfVEFHID0gXCJzZWdtZW50XCI7XG5jb25zdCBfRklMRV9UQUcgPSBcImZpbGVcIjtcblxuLy8gaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcveGxpZmYveGxpZmYtY29yZS92Mi4wL29zL3hsaWZmLWNvcmUtdjIuMC1vcy5odG1sXG5leHBvcnQgZnVuY3Rpb24geGxpZmYyTG9hZFRvSTE4bihjb250ZW50OiBzdHJpbmcpOiBJMThuTWVzc2FnZXNCeUlkIHtcbiAgLy8geGxpZmYgdG8geG1sIG5vZGVzXG4gIGNvbnN0IHhsaWZmMlBhcnNlciA9IG5ldyBYbGlmZjJQYXJzZXIoKTtcbiAgY29uc3Qge21zZ0lkVG9IdG1sLCBlcnJvcnN9ID0geGxpZmYyUGFyc2VyLnBhcnNlKGNvbnRlbnQpO1xuXG4gIC8vIHhtbCBub2RlcyB0byBpMThuIG5vZGVzXG4gIGNvbnN0IGkxOG5Ob2Rlc0J5TXNnSWQ6IHtbbXNnSWQ6IHN0cmluZ106IGkxOG4uTm9kZVtdfSA9IHt9O1xuICBjb25zdCBjb252ZXJ0ZXIgPSBuZXcgWG1sVG9JMThuKCk7XG5cbiAgT2JqZWN0LmtleXMobXNnSWRUb0h0bWwpLmZvckVhY2gobXNnSWQgPT4ge1xuICAgIGNvbnN0IHtpMThuTm9kZXMsIGVycm9yczogZX0gPSBjb252ZXJ0ZXIuY29udmVydChtc2dJZFRvSHRtbFttc2dJZF0pO1xuICAgIGVycm9ycy5wdXNoKC4uLmUpO1xuICAgIGkxOG5Ob2Rlc0J5TXNnSWRbbXNnSWRdID0gaTE4bk5vZGVzO1xuICB9KTtcblxuICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgeGxpZmYyIHBhcnNlIGVycm9yczpcXG4ke2Vycm9ycy5qb2luKFwiXFxuXCIpfWApO1xuICB9XG5cbiAgcmV0dXJuIGkxOG5Ob2Rlc0J5TXNnSWQ7XG59XG5cbi8vIHVzZWQgdG8gbWVyZ2UgdHJhbnNsYXRpb25zIHdoZW4gZXh0cmFjdGluZ1xuZXhwb3J0IGZ1bmN0aW9uIHhsaWZmMkxvYWRUb1htbChjb250ZW50OiBzdHJpbmcpOiBYbWxNZXNzYWdlc0J5SWQge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgSHRtbFRvWG1sUGFyc2VyKF9VTklUX1RBRyk7XG4gIGNvbnN0IHt4bWxNZXNzYWdlc0J5SWQsIGVycm9yc30gPSBwYXJzZXIucGFyc2UoY29udGVudCk7XG5cbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHhsaWZmMiBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvcnMuam9pbihcIlxcblwiKX1gKTtcbiAgfVxuXG4gIHJldHVybiB4bWxNZXNzYWdlc0J5SWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4bGlmZjJXcml0ZShtZXNzYWdlczogaTE4bi5NZXNzYWdlW10sIGxvY2FsZTogc3RyaW5nIHwgbnVsbCwgZXhpc3RpbmdOb2Rlcz86IHhtbC5Ob2RlW10pOiBzdHJpbmcge1xuICBjb25zdCB2aXNpdG9yID0gbmV3IFdyaXRlVmlzaXRvcigpO1xuICBjb25zdCB1bml0czogeG1sLk5vZGVbXSA9IGV4aXN0aW5nTm9kZXMgJiYgZXhpc3RpbmdOb2Rlcy5sZW5ndGggPyBbbmV3IHhtbC5DUig0KSwgLi4uZXhpc3RpbmdOb2Rlc10gOiBbXTtcblxuICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IHVuaXQgPSBuZXcgeG1sLlRhZyhfVU5JVF9UQUcsIHtpZDogbWVzc2FnZS5pZH0pO1xuICAgIGNvbnN0IG5vdGVzID0gbmV3IHhtbC5UYWcoX05PVEVTX1RBRyk7XG5cbiAgICBpZiAobWVzc2FnZS5kZXNjcmlwdGlvbiB8fCBtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgIGlmIChtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIG5vdGVzLmNoaWxkcmVuLnB1c2goXG4gICAgICAgICAgbmV3IHhtbC5DUig4KSxcbiAgICAgICAgICBuZXcgeG1sLlRhZyhfTk9URV9UQUcsIHtjYXRlZ29yeTogXCJkZXNjcmlwdGlvblwifSwgW25ldyB4bWwuVGV4dChtZXNzYWdlLmRlc2NyaXB0aW9uKV0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChtZXNzYWdlLm1lYW5pbmcpIHtcbiAgICAgICAgbm90ZXMuY2hpbGRyZW4ucHVzaChcbiAgICAgICAgICBuZXcgeG1sLkNSKDgpLFxuICAgICAgICAgIG5ldyB4bWwuVGFnKF9OT1RFX1RBRywge2NhdGVnb3J5OiBcIm1lYW5pbmdcIn0sIFtuZXcgeG1sLlRleHQobWVzc2FnZS5tZWFuaW5nKV0pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVzc2FnZS5zb3VyY2VzLmZvckVhY2goKHNvdXJjZTogaTE4bi5NZXNzYWdlU3BhbikgPT4ge1xuICAgICAgbm90ZXMuY2hpbGRyZW4ucHVzaChcbiAgICAgICAgbmV3IHhtbC5DUig4KSxcbiAgICAgICAgbmV3IHhtbC5UYWcoX05PVEVfVEFHLCB7Y2F0ZWdvcnk6IFwibG9jYXRpb25cIn0sIFtcbiAgICAgICAgICBuZXcgeG1sLlRleHQoXG4gICAgICAgICAgICBgJHtzb3VyY2UuZmlsZVBhdGh9OiR7c291cmNlLnN0YXJ0TGluZX0ke3NvdXJjZS5lbmRMaW5lICE9PSBzb3VyY2Uuc3RhcnRMaW5lID8gXCIsXCIgKyBzb3VyY2UuZW5kTGluZSA6IFwiXCJ9YFxuICAgICAgICAgIClcbiAgICAgICAgXSlcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBub3Rlcy5jaGlsZHJlbi5wdXNoKG5ldyB4bWwuQ1IoNikpO1xuICAgIHVuaXQuY2hpbGRyZW4ucHVzaChuZXcgeG1sLkNSKDYpLCBub3Rlcyk7XG5cbiAgICBjb25zdCBzZWdtZW50ID0gbmV3IHhtbC5UYWcoX1NFR01FTlRfVEFHKTtcblxuICAgIHNlZ21lbnQuY2hpbGRyZW4ucHVzaChuZXcgeG1sLkNSKDgpLCBuZXcgeG1sLlRhZyhfU09VUkNFX1RBRywge30sIHZpc2l0b3Iuc2VyaWFsaXplKG1lc3NhZ2Uubm9kZXMpKSwgbmV3IHhtbC5DUig2KSk7XG5cbiAgICB1bml0LmNoaWxkcmVuLnB1c2gobmV3IHhtbC5DUig2KSwgc2VnbWVudCwgbmV3IHhtbC5DUig0KSk7XG5cbiAgICB1bml0cy5wdXNoKG5ldyB4bWwuQ1IoNCksIHVuaXQpO1xuICB9KTtcblxuICBjb25zdCBmaWxlID0gbmV3IHhtbC5UYWcoX0ZJTEVfVEFHLCB7b3JpZ2luYWw6IFwibmcudGVtcGxhdGVcIiwgaWQ6IFwibmdpMThuXCJ9LCBbLi4udW5pdHMsIG5ldyB4bWwuQ1IoMildKTtcblxuICBjb25zdCB4bGlmZiA9IG5ldyB4bWwuVGFnKF9YTElGRl9UQUcsIHt2ZXJzaW9uOiBfVkVSU0lPTiwgeG1sbnM6IF9YTUxOUywgc3JjTGFuZzogbG9jYWxlIHx8IF9ERUZBVUxUX1NPVVJDRV9MQU5HfSwgW1xuICAgIG5ldyB4bWwuQ1IoMiksXG4gICAgZmlsZSxcbiAgICBuZXcgeG1sLkNSKClcbiAgXSk7XG5cbiAgcmV0dXJuIHhtbC5zZXJpYWxpemUoW25ldyB4bWwuRGVjbGFyYXRpb24oe3ZlcnNpb246IFwiMS4wXCIsIGVuY29kaW5nOiBcIlVURi04XCJ9KSwgbmV3IHhtbC5DUigpLCB4bGlmZiwgbmV3IHhtbC5DUigpXSk7XG59XG5cbmV4cG9ydCBjb25zdCB4bGlmZjJEaWdlc3QgPSBkZWNpbWFsRGlnZXN0O1xuXG4vLyBFeHRyYWN0IG1lc3NhZ2VzIGFzIHhtbCBub2RlcyBmcm9tIHRoZSB4bGlmZiBmaWxlXG5jbGFzcyBYbGlmZjJQYXJzZXIgaW1wbGVtZW50cyBtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBfdW5pdE1sU3RyaW5nOiBzdHJpbmcgfCBudWxsO1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdO1xuICBwcml2YXRlIF9tc2dJZFRvSHRtbDoge1ttc2dJZDogc3RyaW5nXTogc3RyaW5nfTtcblxuICBwYXJzZShjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLl91bml0TWxTdHJpbmcgPSBudWxsO1xuICAgIHRoaXMuX21zZ0lkVG9IdG1sID0ge307XG5cbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGdldFhtbFRhZ0RlZmluaXRpb24pLnBhcnNlKGNvbnRlbnQsIFwiXCIsIGZhbHNlKTtcblxuICAgIHRoaXMuX2Vycm9ycyA9IHBhcnNlci5lcnJvcnM7XG4gICAgbWwudmlzaXRBbGwodGhpcywgcGFyc2VyLnJvb3ROb2RlcywgbnVsbCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbXNnSWRUb0h0bWw6IHRoaXMuX21zZ0lkVG9IdG1sLFxuICAgICAgZXJyb3JzOiB0aGlzLl9lcnJvcnNcbiAgICB9O1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgc3dpdGNoIChlbGVtZW50Lm5hbWUpIHtcbiAgICAgIGNhc2UgX1VOSVRfVEFHOlxuICAgICAgICB0aGlzLl91bml0TWxTdHJpbmcgPSBudWxsO1xuICAgICAgICBjb25zdCBpZEF0dHIgPSBlbGVtZW50LmF0dHJzLmZpbmQoYXR0ciA9PiBhdHRyLm5hbWUgPT09IFwiaWRcIik7XG4gICAgICAgIGlmICghaWRBdHRyKSB7XG4gICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYDwke19VTklUX1RBR30+IG1pc3NlcyB0aGUgXCJpZFwiIGF0dHJpYnV0ZWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlkID0gaWRBdHRyLnZhbHVlO1xuICAgICAgICAgIGlmICh0aGlzLl9tc2dJZFRvSHRtbC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbXNnICR7aWR9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl91bml0TWxTdHJpbmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbXNnSWRUb0h0bWxbaWRdID0gdGhpcy5fdW5pdE1sU3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYE1lc3NhZ2UgJHtpZH0gbWlzc2VzIGEgdHJhbnNsYXRpb25gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgX1NPVVJDRV9UQUc6XG4gICAgICAgIC8vIGlnbm9yZSBzb3VyY2UgbWVzc2FnZVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBfVEFSR0VUX1RBRzpcbiAgICAgICAgY29uc3QgaW5uZXJUZXh0U3RhcnQgPSBlbGVtZW50LnN0YXJ0U291cmNlU3BhbiEuZW5kLm9mZnNldDtcbiAgICAgICAgY29uc3QgaW5uZXJUZXh0RW5kID0gZWxlbWVudC5lbmRTb3VyY2VTcGFuIS5zdGFydC5vZmZzZXQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBlbGVtZW50LnN0YXJ0U291cmNlU3BhbiEuc3RhcnQuZmlsZS5jb250ZW50O1xuICAgICAgICBjb25zdCBpbm5lclRleHQgPSBjb250ZW50LnNsaWNlKGlubmVyVGV4dFN0YXJ0LCBpbm5lclRleHRFbmQpO1xuICAgICAgICB0aGlzLl91bml0TWxTdHJpbmcgPSBpbm5lclRleHQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIF9YTElGRl9UQUc6XG4gICAgICAgIGNvbnN0IHZlcnNpb25BdHRyID0gZWxlbWVudC5hdHRycy5maW5kKGF0dHIgPT4gYXR0ci5uYW1lID09PSBcInZlcnNpb25cIik7XG4gICAgICAgIGlmICh2ZXJzaW9uQXR0cikge1xuICAgICAgICAgIGNvbnN0IHZlcnNpb24gPSB2ZXJzaW9uQXR0ci52YWx1ZTtcbiAgICAgICAgICBpZiAodmVyc2lvbiAhPT0gXCIyLjBcIikge1xuICAgICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYFRoZSBYTElGRiBmaWxlIHZlcnNpb24gJHt2ZXJzaW9ufSBpcyBub3QgY29tcGF0aWJsZSB3aXRoIFhMSUZGIDIuMCBzZXJpYWxpemVyYCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdFRleHQodGV4dDogbWwuVGV4dCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogbWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogbWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4sIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG4vLyBDb252ZXJ0IG1sIG5vZGVzICh4bGlmZiBzeW50YXgpIHRvIGkxOG4gbm9kZXNcbmNsYXNzIFhtbFRvSTE4biBpbXBsZW1lbnRzIG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdO1xuXG4gIGNvbnZlcnQobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgeG1sSWN1ID0gbmV3IFBhcnNlcihnZXRYbWxUYWdEZWZpbml0aW9uKS5wYXJzZShtZXNzYWdlLCBcIlwiLCB0cnVlKTtcbiAgICB0aGlzLl9lcnJvcnMgPSB4bWxJY3UuZXJyb3JzO1xuXG4gICAgY29uc3QgaTE4bk5vZGVzID1cbiAgICAgIHRoaXMuX2Vycm9ycy5sZW5ndGggPiAwIHx8IHhtbEljdS5yb290Tm9kZXMubGVuZ3RoID09PSAwID8gW10gOiBbXS5jb25jYXQoLi4ubWwudmlzaXRBbGwodGhpcywgeG1sSWN1LnJvb3ROb2RlcykpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGkxOG5Ob2RlcyxcbiAgICAgIGVycm9yczogdGhpcy5fZXJyb3JzXG4gICAgfTtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBtbC5UZXh0LCBjb250ZXh0OiBhbnkpIHtcbiAgICByZXR1cm4gbmV3IGkxOG4uVGV4dCh0ZXh0LnZhbHVlLCB0ZXh0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsOiBtbC5FbGVtZW50LCBjb250ZXh0OiBhbnkpOiBpMThuLk5vZGVbXSB8IG51bGwge1xuICAgIHN3aXRjaCAoZWwubmFtZSkge1xuICAgICAgY2FzZSBfUExBQ0VIT0xERVJfVEFHOlxuICAgICAgICBjb25zdCBuYW1lQXR0ciA9IGVsLmF0dHJzLmZpbmQoYXR0ciA9PiBhdHRyLm5hbWUgPT09IFwiZXF1aXZcIik7XG4gICAgICAgIGlmIChuYW1lQXR0cikge1xuICAgICAgICAgIHJldHVybiBbbmV3IGkxOG4uUGxhY2Vob2xkZXIoXCJcIiwgbmFtZUF0dHIudmFsdWUsIGVsLnNvdXJjZVNwYW4pXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgPCR7X1BMQUNFSE9MREVSX1RBR30+IG1pc3NlcyB0aGUgXCJlcXVpdlwiIGF0dHJpYnV0ZWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgX1BMQUNFSE9MREVSX1NQQU5OSU5HX1RBRzpcbiAgICAgICAgY29uc3Qgc3RhcnRBdHRyID0gZWwuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJlcXVpdlN0YXJ0XCIpO1xuICAgICAgICBjb25zdCBlbmRBdHRyID0gZWwuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJlcXVpdkVuZFwiKTtcblxuICAgICAgICBpZiAoIXN0YXJ0QXR0cikge1xuICAgICAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgPCR7X1BMQUNFSE9MREVSX1RBR30+IG1pc3NlcyB0aGUgXCJlcXVpdlN0YXJ0XCIgYXR0cmlidXRlYCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIWVuZEF0dHIpIHtcbiAgICAgICAgICB0aGlzLl9hZGRFcnJvcihlbCwgYDwke19QTEFDRUhPTERFUl9UQUd9PiBtaXNzZXMgdGhlIFwiZXF1aXZFbmRcIiBhdHRyaWJ1dGVgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzdGFydElkID0gc3RhcnRBdHRyLnZhbHVlO1xuICAgICAgICAgIGNvbnN0IGVuZElkID0gZW5kQXR0ci52YWx1ZTtcblxuICAgICAgICAgIGNvbnN0IG5vZGVzOiBpMThuLk5vZGVbXSA9IFtdO1xuXG4gICAgICAgICAgcmV0dXJuIG5vZGVzLmNvbmNhdChcbiAgICAgICAgICAgIG5ldyBpMThuLlBsYWNlaG9sZGVyKFwiXCIsIHN0YXJ0SWQsIGVsLnNvdXJjZVNwYW4pLFxuICAgICAgICAgICAgLi4uZWwuY2hpbGRyZW4ubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzLCBudWxsKSksXG4gICAgICAgICAgICBuZXcgaTE4bi5QbGFjZWhvbGRlcihcIlwiLCBlbmRJZCwgZWwuc291cmNlU3BhbilcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWwsIGBVbmV4cGVjdGVkIHRhZ2ApO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oaWN1OiBtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSkge1xuICAgIGNvbnN0IGNhc2VNYXA6IHtbdmFsdWU6IHN0cmluZ106IGkxOG4uTm9kZX0gPSB7fTtcblxuICAgIG1sLnZpc2l0QWxsKHRoaXMsIGljdS5jYXNlcykuZm9yRWFjaCgoYzogYW55KSA9PiB7XG4gICAgICBjYXNlTWFwW2MudmFsdWVdID0gbmV3IGkxOG4uQ29udGFpbmVyKGMubm9kZXMsIGljdS5zb3VyY2VTcGFuKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgaTE4bi5JY3UoaWN1LnN3aXRjaFZhbHVlLCBpY3UudHlwZSwgY2FzZU1hcCwgaWN1LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGljdUNhc2U6IG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiBpY3VDYXNlLnZhbHVlLFxuICAgICAgbm9kZXM6IFtdLmNvbmNhdCguLi5tbC52aXNpdEFsbCh0aGlzLCBpY3VDYXNlLmV4cHJlc3Npb24pKVxuICAgIH07XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4sIG1lc3NhZ2UpKTtcbiAgfVxufVxuXG5jbGFzcyBXcml0ZVZpc2l0b3IgaW1wbGVtZW50cyBpMThuLlZpc2l0b3Ige1xuICBwcml2YXRlIF9uZXh0UGxhY2Vob2xkZXJJZDogbnVtYmVyO1xuXG4gIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICByZXR1cm4gW25ldyB4bWwuVGV4dCh0ZXh0LnZhbHVlKV07XG4gIH1cblxuICB2aXNpdENvbnRhaW5lcihjb250YWluZXI6IGkxOG4uQ29udGFpbmVyLCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgY29uc3Qgbm9kZXM6IHhtbC5Ob2RlW10gPSBbXTtcbiAgICBjb250YWluZXIuY2hpbGRyZW4uZm9yRWFjaCgobm9kZTogaTE4bi5Ob2RlKSA9PiBub2Rlcy5wdXNoKC4uLm5vZGUudmlzaXQodGhpcykpKTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IGkxOG4uSWN1LCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgY29uc3Qgbm9kZXMgPSBbbmV3IHhtbC5UZXh0KGB7JHtpY3UuZXhwcmVzc2lvblBsYWNlaG9sZGVyfSwgJHtpY3UudHlwZX0sIGApXTtcblxuICAgIE9iamVjdC5rZXlzKGljdS5jYXNlcykuZm9yRWFjaCgoYzogc3RyaW5nKSA9PiB7XG4gICAgICBub2Rlcy5wdXNoKG5ldyB4bWwuVGV4dChgJHtjfSB7YCksIC4uLmljdS5jYXNlc1tjXS52aXNpdCh0aGlzKSwgbmV3IHhtbC5UZXh0KGB9IGApKTtcbiAgICB9KTtcblxuICAgIG5vZGVzLnB1c2gobmV3IHhtbC5UZXh0KGB9YCkpO1xuXG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRUeXBlRm9yVGFnKHBoLnRhZyk7XG5cbiAgICBpZiAocGguaXNWb2lkKSB7XG4gICAgICBjb25zdCB0YWdQaCA9IG5ldyB4bWwuVGFnKF9QTEFDRUhPTERFUl9UQUcsIHtcbiAgICAgICAgaWQ6ICh0aGlzLl9uZXh0UGxhY2Vob2xkZXJJZCsrKS50b1N0cmluZygpLFxuICAgICAgICBlcXVpdjogcGguc3RhcnROYW1lLFxuICAgICAgICB0eXBlLFxuICAgICAgICBkaXNwOiBgPCR7cGgudGFnfS8+YFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gW3RhZ1BoXTtcbiAgICB9XG5cbiAgICBjb25zdCB0YWdQYyA9IG5ldyB4bWwuVGFnKF9QTEFDRUhPTERFUl9TUEFOTklOR19UQUcsIHtcbiAgICAgIGlkOiAodGhpcy5fbmV4dFBsYWNlaG9sZGVySWQrKykudG9TdHJpbmcoKSxcbiAgICAgIGVxdWl2U3RhcnQ6IHBoLnN0YXJ0TmFtZSxcbiAgICAgIGVxdWl2RW5kOiBwaC5jbG9zZU5hbWUsXG4gICAgICB0eXBlLFxuICAgICAgZGlzcFN0YXJ0OiBgPCR7cGgudGFnfT5gLFxuICAgICAgZGlzcEVuZDogYDwvJHtwaC50YWd9PmBcbiAgICB9KTtcbiAgICBjb25zdCBub2RlczogeG1sLk5vZGVbXSA9IFtdLmNvbmNhdCguLi5waC5jaGlsZHJlbi5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKSk7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZTogeG1sLk5vZGUpID0+IHRhZ1BjLmNoaWxkcmVuLnB1c2gobm9kZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWdQYy5jaGlsZHJlbi5wdXNoKG5ldyB4bWwuVGV4dChcIlwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFt0YWdQY107XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBpMThuLlBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgY29uc3QgaWRTdHIgPSAodGhpcy5fbmV4dFBsYWNlaG9sZGVySWQrKykudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IHhtbC5UYWcoX1BMQUNFSE9MREVSX1RBRywge1xuICAgICAgICBpZDogaWRTdHIsXG4gICAgICAgIGVxdWl2OiBwaC5uYW1lLFxuICAgICAgICBkaXNwOiBge3ske3BoLnZhbHVlfX19YFxuICAgICAgfSlcbiAgICBdO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IGNhc2VzID0gT2JqZWN0LmtleXMocGgudmFsdWUuY2FzZXMpXG4gICAgICAubWFwKCh2YWx1ZTogc3RyaW5nKSA9PiB2YWx1ZSArIFwiIHsuLi59XCIpXG4gICAgICAuam9pbihcIiBcIik7XG4gICAgY29uc3QgaWRTdHIgPSAodGhpcy5fbmV4dFBsYWNlaG9sZGVySWQrKykudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gW1xuICAgICAgbmV3IHhtbC5UYWcoX1BMQUNFSE9MREVSX1RBRywge1xuICAgICAgICBpZDogaWRTdHIsXG4gICAgICAgIGVxdWl2OiBwaC5uYW1lLFxuICAgICAgICBkaXNwOiBgeyR7cGgudmFsdWUuZXhwcmVzc2lvbn0sICR7cGgudmFsdWUudHlwZX0sICR7Y2FzZXN9fWBcbiAgICAgIH0pXG4gICAgXTtcbiAgfVxuXG4gIHNlcmlhbGl6ZShub2RlczogaTE4bi5Ob2RlW10pOiB4bWwuTm9kZVtdIHtcbiAgICB0aGlzLl9uZXh0UGxhY2Vob2xkZXJJZCA9IDA7XG4gICAgcmV0dXJuIFtdLmNvbmNhdCguLi5ub2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VHlwZUZvclRhZyh0YWc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHN3aXRjaCAodGFnLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlIFwiYnJcIjpcbiAgICBjYXNlIFwiYlwiOlxuICAgIGNhc2UgXCJpXCI6XG4gICAgY2FzZSBcInVcIjpcbiAgICAgIHJldHVybiBcImZtdFwiO1xuICAgIGNhc2UgXCJpbWdcIjpcbiAgICAgIHJldHVybiBcImltYWdlXCI7XG4gICAgY2FzZSBcImFcIjpcbiAgICAgIHJldHVybiBcImxpbmtcIjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFwib3RoZXJcIjtcbiAgfVxufVxuIl19