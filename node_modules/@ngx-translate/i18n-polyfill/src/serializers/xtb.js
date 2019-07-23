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
const parse_util_1 = require("../ast/parse_util");
const parser_1 = require("../ast/parser");
const xml_tags_1 = require("../ast/xml_tags");
const digest_1 = require("./digest");
const xmb_1 = require("./xmb");
const _TRANSLATIONS_TAG = "translationbundle";
const _TRANSLATION_TAG = "translation";
const _PLACEHOLDER_TAG = "ph";
function xtbLoadToI18n(content) {
    // xtb to xml nodes
    const xtbParser = new XtbParser();
    const { msgIdToHtml, errors: parseErrors } = xtbParser.parse(content);
    if (parseErrors.length) {
        throw new Error(`xtb parse errors:\n${parseErrors.join("\n")}`);
    }
    // xml nodes to i18n nodes
    const i18nNodesByMsgId = {};
    const converter = new XmlToI18n();
    // Because we should be able to load xtb files that rely on features not supported by angular,
    // we need to delay the conversion of html to i18n nodes so that non angular messages are not
    // converted
    Object.keys(msgIdToHtml).forEach(msgId => {
        const valueFn = () => {
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
exports.xtbLoadToI18n = xtbLoadToI18n;
exports.xtbDigest = digest_1.digest;
exports.xtbMapper = xmb_1.xmbMapper;
function createLazyProperty(messages, id, valueFn) {
    Object.defineProperty(messages, id, {
        configurable: true,
        enumerable: true,
        get: () => {
            const value = valueFn();
            Object.defineProperty(messages, id, { enumerable: true, value });
            return value;
        },
        set: _ => {
            throw new Error("Could not overwrite an XTB translation");
        }
    });
}
// Extract messages as xml nodes from the xtb file
class XtbParser {
    parse(xtb) {
        this._bundleDepth = 0;
        this._msgIdToHtml = {};
        // We can not parse the ICU messages at this point as some messages might not originate
        // from Angular that could not be lex'd.
        const xml = new parser_1.Parser(xml_tags_1.getXmlTagDefinition).parse(xtb, "", false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors
        };
    }
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
                const idAttr = element.attrs.find(attr => attr.name === "id");
                if (!idAttr) {
                    this._addError(element, `<${_TRANSLATION_TAG}> misses the "id" attribute`);
                }
                else {
                    const id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, `Duplicated translations for msg ${id}`);
                    }
                    else {
                        const innerTextStart = element.startSourceSpan.end.offset;
                        const innerTextEnd = element.endSourceSpan.start.offset;
                        const content = element.startSourceSpan.start.file.content;
                        const innerText = content.slice(innerTextStart, innerTextEnd);
                        this._msgIdToHtml[id] = innerText;
                    }
                }
                break;
            default:
                this._addError(element, "Unexpected tag");
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
// Convert ml nodes (xtb syntax) to i18n nodes
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
    visitExpansion(icu, context) {
        const caseMap = {};
        ml.visitAll(this, icu.cases).forEach(c => {
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
    visitElement(el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            const nameAttr = el.attrs.find(attr => attr.name === "name");
            if (nameAttr) {
                return new i18n.Placeholder("", nameAttr.value, el.sourceSpan);
            }
            this._addError(el, `<${_PLACEHOLDER_TAG}> misses the "name" attribute`);
        }
        else {
            this._addError(el, `Unexpected tag`);
        }
        return null;
    }
    visitComment(comment, context) { }
    visitAttribute(attribute, context) { }
    _addError(node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    }
}
//# sourceMappingURL=xtb.js.map