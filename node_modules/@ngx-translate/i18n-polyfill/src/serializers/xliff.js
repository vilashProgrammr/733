"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ml = require("../ast/ast");
const i18n = require("../ast/i18n_ast");
const xml = require("./xml_helper");
const parse_util_1 = require("../ast/parse_util");
const parser_1 = require("../ast/parser");
const xml_tags_1 = require("../ast/xml_tags");
const serializer_1 = require("./serializer");
const digest_1 = require("./digest");
const _VERSION = "1.2";
const _XMLNS = "urn:oasis:names:tc:xliff:document:1.2";
const _PLACEHOLDER_TAG = "x";
const _FILE_TAG = "file";
const _SOURCE_TAG = "source";
const _TARGET_TAG = "target";
const _UNIT_TAG = "trans-unit";
const _CONTEXT_GROUP_TAG = "context-group";
const _CONTEXT_TAG = "context";
const _DEFAULT_SOURCE_LANG = "en";
function xliffLoadToI18n(content) {
    // xliff to xml nodes
    const xliffParser = new XliffParser();
    const { msgIdToHtml, errors } = xliffParser.parse(content);
    // xml nodes to i18n messages
    const i18nMessagesById = {};
    const converter = new XmlToI18n();
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
exports.xliffLoadToI18n = xliffLoadToI18n;
// used to merge translations when extracting
function xliffLoadToXml(content) {
    const parser = new serializer_1.HtmlToXmlParser(_UNIT_TAG);
    const { xmlMessagesById, errors } = parser.parse(content);
    if (errors.length) {
        throw new Error(`xliff parse errors:\n${errors.join("\n")}`);
    }
    return xmlMessagesById;
}
exports.xliffLoadToXml = xliffLoadToXml;
// http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
// http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
function xliffWrite(messages, locale, existingNodes) {
    const visitor = new WriteVisitor();
    const transUnits = existingNodes && existingNodes.length ? [new xml.CR(6), ...existingNodes] : [];
    messages.forEach(message => {
        const contextTags = [];
        message.sources.forEach((source) => {
            const contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: "location" });
            contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "sourcefile" }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "linenumber" }, [new xml.Text(`${source.startLine}`)]), new xml.CR(8));
            contextTags.push(new xml.CR(8), contextGroupTag);
        });
        const transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: "html" });
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
    const body = new xml.Tag("body", {}, [...transUnits, new xml.CR(4)]);
    const file = new xml.Tag("file", {
        "source-language": locale || _DEFAULT_SOURCE_LANG,
        datatype: "plaintext",
        original: "ng2.template"
    }, [new xml.CR(4), body, new xml.CR(2)]);
    const xliff = new xml.Tag("xliff", { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
    return xml.serialize([new xml.Declaration({ version: "1.0", encoding: "UTF-8" }), new xml.CR(), xliff, new xml.CR()]);
}
exports.xliffWrite = xliffWrite;
exports.xliffDigest = digest_1.digest;
// Extract messages as xml nodes from the xliff file
class XliffParser {
    parse(content) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        const parser = new parser_1.Parser(xml_tags_1.getXmlTagDefinition).parse(content, "", false);
        this._errors = parser.errors;
        ml.visitAll(this, parser.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors
        };
    }
    visitElement(element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = null;
                const idAttr = element.attrs.find(attr => attr.name === "id");
                if (!idAttr) {
                    this._addError(element, `<${_UNIT_TAG}> misses the "id" attribute`);
                }
                else {
                    const id = idAttr.value;
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
                const innerTextStart = element.startSourceSpan.end.offset;
                const innerTextEnd = element.endSourceSpan.start.offset;
                const content = element.startSourceSpan.start.file.content;
                const innerText = content.slice(innerTextStart, innerTextEnd);
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
    visitAttribute(attribute, context) { }
    visitText(text, context) { }
    visitComment(comment, context) { }
    visitExpansion(expansion, context) { }
    visitExpansionCase(expansionCase, context) { }
    _addError(node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    }
}
// Convert ml nodes (xliff syntax) to i18n nodes
class XmlToI18n {
    convert(message) {
        const xmlIcu = new parser_1.Parser(xml_tags_1.getXmlTagDefinition).parse(message, "", true);
        this._errors = xmlIcu.errors;
        const i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length === 0 ? [] : ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes,
            errors: this._errors
        };
    }
    visitText(text, context) {
        return new i18n.Text(text.value, text.sourceSpan);
    }
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const nameAttr = el.attrs.find(attr => attr.name === "id");
            if (nameAttr) {
                return new i18n.Placeholder("", nameAttr.value, el.sourceSpan);
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "id" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    visitExpansion(icu, context) {
        const caseMap = {};
        ml.visitAll(this, icu.cases).forEach((c) => {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    }
    visitExpansionCase(icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression)
        };
    }
    visitComment(comment, context) { }
    visitAttribute(attribute, context) { }
    _addError(node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    }
}
class WriteVisitor {
    visitText(text, context) {
        return [new xml.Text(text.value)];
    }
    visitContainer(container, context) {
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    visitIcu(icu, context) {
        const nodes = [new xml.Text(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new xml.Text(`${c} {`), ...icu.cases[c].visit(this), new xml.Text(`} `));
        });
        nodes.push(new xml.Text(`}`));
        return nodes;
    }
    visitTagPlaceholder(ph, context) {
        const ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, "equiv-text": `<${ph.tag}/>` })];
        }
        const startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype, "equiv-text": `<${ph.tag}>` });
        const closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype, "equiv-text": `</${ph.tag}>` });
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    visitPlaceholder(ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": `{{${ph.value}}}` })];
    }
    visitIcuPlaceholder(ph, context) {
        const equivText = `{${ph.value.expression}, ${ph.value.type}, ${Object.keys(ph.value.cases)
            .map((value) => value + " {...}")
            .join(" ")}}`;
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": equivText })];
    }
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
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
//# sourceMappingURL=xliff.js.map