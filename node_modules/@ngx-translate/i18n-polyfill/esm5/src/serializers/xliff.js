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
import * as tslib_1 from "tslib";
import * as ml from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import * as xml from "./xml_helper";
import { I18nError } from "../ast/parse_util";
import { Parser } from "../ast/parser";
import { getXmlTagDefinition } from "../ast/xml_tags";
import { HtmlToXmlParser } from "./serializer";
import { digest } from "./digest";
var /** @type {?} */ _VERSION = "1.2";
var /** @type {?} */ _XMLNS = "urn:oasis:names:tc:xliff:document:1.2";
var /** @type {?} */ _PLACEHOLDER_TAG = "x";
var /** @type {?} */ _FILE_TAG = "file";
var /** @type {?} */ _SOURCE_TAG = "source";
var /** @type {?} */ _TARGET_TAG = "target";
var /** @type {?} */ _UNIT_TAG = "trans-unit";
var /** @type {?} */ _CONTEXT_GROUP_TAG = "context-group";
var /** @type {?} */ _CONTEXT_TAG = "context";
var /** @type {?} */ _DEFAULT_SOURCE_LANG = "en";
/**
 * @param {?} content
 * @return {?}
 */
export function xliffLoadToI18n(content) {
    // xliff to xml nodes
    var /** @type {?} */ xliffParser = new XliffParser();
    var _a = xliffParser.parse(content), msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
    // xml nodes to i18n messages
    var /** @type {?} */ i18nMessagesById = {};
    var /** @type {?} */ converter = new XmlToI18n();
    Object.keys(msgIdToHtml).forEach(function (msgId) {
        var _a = converter.convert(msgIdToHtml[msgId]), i18nNodes = _a.i18nNodes, e = _a.errors;
        errors.push.apply(errors, tslib_1.__spread(e));
        i18nMessagesById[msgId] = i18nNodes;
    });
    if (errors.length) {
        throw new Error("xliff parse errors:\n" + errors.join("\n"));
    }
    return i18nMessagesById;
}
/**
 * @param {?} content
 * @return {?}
 */
export function xliffLoadToXml(content) {
    var /** @type {?} */ parser = new HtmlToXmlParser(_UNIT_TAG);
    var _a = parser.parse(content), xmlMessagesById = _a.xmlMessagesById, errors = _a.errors;
    if (errors.length) {
        throw new Error("xliff parse errors:\n" + errors.join("\n"));
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
    var /** @type {?} */ visitor = new WriteVisitor();
    var /** @type {?} */ transUnits = existingNodes && existingNodes.length ? tslib_1.__spread([new xml.CR(6)], existingNodes) : [];
    messages.forEach(function (message) {
        var /** @type {?} */ contextTags = [];
        message.sources.forEach(function (source) {
            var /** @type {?} */ contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: "location" });
            contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "sourcefile" }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { "context-type": "linenumber" }, [new xml.Text("" + source.startLine)]), new xml.CR(8));
            contextTags.push(new xml.CR(8), contextGroupTag);
        });
        var /** @type {?} */ transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: "html" });
        (_a = transUnit.children).push.apply(_a, tslib_1.__spread([new xml.CR(8),
            new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes))], contextTags));
        if (message.description) {
            transUnit.children.push(new xml.CR(8), new xml.Tag("note", { priority: "1", from: "description" }, [new xml.Text(message.description)]));
        }
        if (message.meaning) {
            transUnit.children.push(new xml.CR(8), new xml.Tag("note", { priority: "1", from: "meaning" }, [new xml.Text(message.meaning)]));
        }
        transUnit.children.push(new xml.CR(6));
        transUnits.push(new xml.CR(6), transUnit);
        var _a;
    });
    var /** @type {?} */ body = new xml.Tag("body", {}, tslib_1.__spread(transUnits, [new xml.CR(4)]));
    var /** @type {?} */ file = new xml.Tag("file", {
        "source-language": locale || _DEFAULT_SOURCE_LANG,
        datatype: "plaintext",
        original: "ng2.template"
    }, [new xml.CR(4), body, new xml.CR(2)]);
    var /** @type {?} */ xliff = new xml.Tag("xliff", { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
    return xml.serialize([new xml.Declaration({ version: "1.0", encoding: "UTF-8" }), new xml.CR(), xliff, new xml.CR()]);
}
export var /** @type {?} */ xliffDigest = digest;
var XliffParser = /** @class */ (function () {
    function XliffParser() {
    }
    /**
     * @param {?} content
     * @return {?}
     */
    XliffParser.prototype.parse = /**
     * @param {?} content
     * @return {?}
     */
    function (content) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var /** @type {?} */ parser = new Parser(getXmlTagDefinition).parse(content, "", false);
        this._errors = parser.errors;
        ml.visitAll(this, parser.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitElement = /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = /** @type {?} */ ((null));
                var /** @type {?} */ idAttr = element.attrs.find(function (attr) { return attr.name === "id"; });
                if (!idAttr) {
                    this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var /** @type {?} */ id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                        if (typeof this._unitMlString === "string") {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, "Message " + id + " misses a translation");
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                var /** @type {?} */ innerTextStart = /** @type {?} */ ((element.startSourceSpan)).end.offset;
                var /** @type {?} */ innerTextEnd = /** @type {?} */ ((element.endSourceSpan)).start.offset;
                var /** @type {?} */ content = /** @type {?} */ ((element.startSourceSpan)).start.file.content;
                var /** @type {?} */ innerText = content.slice(innerTextStart, innerTextEnd);
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
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) { };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitExpansion = /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    function (expansion, context) { };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    XliffParser.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    function (expansionCase, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XliffParser.prototype._addError = /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XliffParser;
}());
function XliffParser_tsickle_Closure_declarations() {
    /** @type {?} */
    XliffParser.prototype._unitMlString;
    /** @type {?} */
    XliffParser.prototype._errors;
    /** @type {?} */
    XliffParser.prototype._msgIdToHtml;
}
var XmlToI18n = /** @class */ (function () {
    function XmlToI18n() {
    }
    /**
     * @param {?} message
     * @return {?}
     */
    XmlToI18n.prototype.convert = /**
     * @param {?} message
     * @return {?}
     */
    function (message) {
        var /** @type {?} */ xmlIcu = new Parser(getXmlTagDefinition).parse(message, "", true);
        this._errors = xmlIcu.errors;
        var /** @type {?} */ i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length === 0 ? [] : ml.visitAll(this, xmlIcu.rootNodes);
        return {
            i18nNodes: i18nNodes,
            errors: this._errors
        };
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        return new i18n.Text(text.value, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitElement = /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    function (el, context) {
        if (el.name === _PLACEHOLDER_TAG) {
            var /** @type {?} */ nameAttr = el.attrs.find(function (attr) { return attr.name === "id"; });
            if (nameAttr) {
                return new i18n.Placeholder("", nameAttr.value, /** @type {?} */ ((el.sourceSpan)));
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
        }
        else {
            this._addError(el, "Unexpected tag");
        }
        return null;
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansion = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        var /** @type {?} */ caseMap = {};
        ml.visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitExpansionCase = /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: ml.visitAll(this, icuCase.expression)
        };
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) { };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    XmlToI18n.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) { };
    /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    XmlToI18n.prototype._addError = /**
     * @param {?} node
     * @param {?} message
     * @return {?}
     */
    function (node, message) {
        this._errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), message));
    };
    return XmlToI18n;
}());
function XmlToI18n_tsickle_Closure_declarations() {
    /** @type {?} */
    XmlToI18n.prototype._errors;
}
var WriteVisitor = /** @class */ (function () {
    function WriteVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) {
        return [new xml.Text(text.value)];
    };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, tslib_1.__spread(node.visit(_this))); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, tslib_1.__spread([new xml.Text(c + " {")], icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, "equiv-text": "<" + ph.tag + "/>" })];
        }
        var /** @type {?} */ startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, "equiv-text": "<" + ph.tag + ">" });
        var /** @type {?} */ closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype: ctype, "equiv-text": "</" + ph.tag + ">" });
        return tslib_1.__spread([startTagPh], this.serialize(ph.children), [closeTagPh]);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": "{{" + ph.value + "}}" })];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    WriteVisitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ equivText = "{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases)
            .map(function (value) { return value + " {...}"; })
            .join(" ") + "}";
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, "equiv-text": equivText })];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    WriteVisitor.prototype.serialize = /**
     * @param {?} nodes
     * @return {?}
     */
    function (nodes) {
        var _this = this;
        return [].concat.apply([], tslib_1.__spread(nodes.map(function (node) { return node.visit(_this); })));
    };
    return WriteVisitor;
}());
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
            return "x-" + tag;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL3NlcmlhbGl6ZXJzL3hsaWZmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxJQUFJLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxLQUFLLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBb0MsTUFBTSxjQUFjLENBQUM7QUFDaEYsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUVoQyxxQkFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLHFCQUFNLE1BQU0sR0FBRyx1Q0FBdUMsQ0FBQztBQUN2RCxxQkFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUM7QUFDN0IscUJBQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN6QixxQkFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLHFCQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDN0IscUJBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQztBQUMvQixxQkFBTSxrQkFBa0IsR0FBRyxlQUFlLENBQUM7QUFDM0MscUJBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUMvQixxQkFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUM7Ozs7O0FBRWxDLE1BQU0sMEJBQTBCLE9BQWU7O0lBRTdDLHFCQUFNLFdBQVcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ3RDLHFDQUFPLDRCQUFXLEVBQUUsa0JB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RUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLFVBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUN4RixHQUFHLENBQUMsVUFBQyxLQUFhLElBQUssT0FBQSxLQUFLLEdBQUcsUUFBUSxFQUFoQixDQUFnQixDQUFDO2FBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBRyxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLENBQUM7S0FDaEY7Ozs7O0lBRUQsZ0NBQVM7Ozs7SUFBVCxVQUFVLEtBQWtCO1FBQTVCLGlCQUVDO1FBREMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLE9BQVQsRUFBRSxtQkFBVyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxHQUFFO0tBQzFEO3VCQTVUSDtJQTZUQyxDQUFBOzs7OztBQUVELHdCQUF3QixHQUFXO0lBQ2pDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsS0FBSyxJQUFJO1lBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLEtBQUssS0FBSztZQUNSLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakI7WUFDRSxNQUFNLENBQUMsT0FBSyxHQUFLLENBQUM7S0FDckI7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgbWwgZnJvbSBcIi4uL2FzdC9hc3RcIjtcbmltcG9ydCAqIGFzIGkxOG4gZnJvbSBcIi4uL2FzdC9pMThuX2FzdFwiO1xuaW1wb3J0ICogYXMgeG1sIGZyb20gXCIuL3htbF9oZWxwZXJcIjtcbmltcG9ydCB7STE4bkVycm9yfSBmcm9tIFwiLi4vYXN0L3BhcnNlX3V0aWxcIjtcbmltcG9ydCB7UGFyc2VyfSBmcm9tIFwiLi4vYXN0L3BhcnNlclwiO1xuaW1wb3J0IHtnZXRYbWxUYWdEZWZpbml0aW9ufSBmcm9tIFwiLi4vYXN0L3htbF90YWdzXCI7XG5pbXBvcnQge0h0bWxUb1htbFBhcnNlciwgSTE4bk1lc3NhZ2VzQnlJZCwgWG1sTWVzc2FnZXNCeUlkfSBmcm9tIFwiLi9zZXJpYWxpemVyXCI7XG5pbXBvcnQge2RpZ2VzdH0gZnJvbSBcIi4vZGlnZXN0XCI7XG5cbmNvbnN0IF9WRVJTSU9OID0gXCIxLjJcIjtcbmNvbnN0IF9YTUxOUyA9IFwidXJuOm9hc2lzOm5hbWVzOnRjOnhsaWZmOmRvY3VtZW50OjEuMlwiO1xuY29uc3QgX1BMQUNFSE9MREVSX1RBRyA9IFwieFwiO1xuY29uc3QgX0ZJTEVfVEFHID0gXCJmaWxlXCI7XG5jb25zdCBfU09VUkNFX1RBRyA9IFwic291cmNlXCI7XG5jb25zdCBfVEFSR0VUX1RBRyA9IFwidGFyZ2V0XCI7XG5jb25zdCBfVU5JVF9UQUcgPSBcInRyYW5zLXVuaXRcIjtcbmNvbnN0IF9DT05URVhUX0dST1VQX1RBRyA9IFwiY29udGV4dC1ncm91cFwiO1xuY29uc3QgX0NPTlRFWFRfVEFHID0gXCJjb250ZXh0XCI7XG5jb25zdCBfREVGQVVMVF9TT1VSQ0VfTEFORyA9IFwiZW5cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHhsaWZmTG9hZFRvSTE4bihjb250ZW50OiBzdHJpbmcpOiBJMThuTWVzc2FnZXNCeUlkIHtcbiAgLy8geGxpZmYgdG8geG1sIG5vZGVzXG4gIGNvbnN0IHhsaWZmUGFyc2VyID0gbmV3IFhsaWZmUGFyc2VyKCk7XG4gIGNvbnN0IHttc2dJZFRvSHRtbCwgZXJyb3JzfSA9IHhsaWZmUGFyc2VyLnBhcnNlKGNvbnRlbnQpO1xuXG4gIC8vIHhtbCBub2RlcyB0byBpMThuIG1lc3NhZ2VzXG4gIGNvbnN0IGkxOG5NZXNzYWdlc0J5SWQ6IHtbbXNnSWQ6IHN0cmluZ106IGkxOG4uTm9kZVtdfSA9IHt9O1xuICBjb25zdCBjb252ZXJ0ZXIgPSBuZXcgWG1sVG9JMThuKCk7XG5cbiAgT2JqZWN0LmtleXMobXNnSWRUb0h0bWwpLmZvckVhY2gobXNnSWQgPT4ge1xuICAgIGNvbnN0IHtpMThuTm9kZXMsIGVycm9yczogZX0gPSBjb252ZXJ0ZXIuY29udmVydChtc2dJZFRvSHRtbFttc2dJZF0pO1xuICAgIGVycm9ycy5wdXNoKC4uLmUpO1xuICAgIGkxOG5NZXNzYWdlc0J5SWRbbXNnSWRdID0gaTE4bk5vZGVzO1xuICB9KTtcblxuICBpZiAoZXJyb3JzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgeGxpZmYgcGFyc2UgZXJyb3JzOlxcbiR7ZXJyb3JzLmpvaW4oXCJcXG5cIil9YCk7XG4gIH1cblxuICByZXR1cm4gaTE4bk1lc3NhZ2VzQnlJZDtcbn1cblxuLy8gdXNlZCB0byBtZXJnZSB0cmFuc2xhdGlvbnMgd2hlbiBleHRyYWN0aW5nXG5leHBvcnQgZnVuY3Rpb24geGxpZmZMb2FkVG9YbWwoY29udGVudDogc3RyaW5nKTogWG1sTWVzc2FnZXNCeUlkIHtcbiAgY29uc3QgcGFyc2VyID0gbmV3IEh0bWxUb1htbFBhcnNlcihfVU5JVF9UQUcpO1xuICBjb25zdCB7eG1sTWVzc2FnZXNCeUlkLCBlcnJvcnN9ID0gcGFyc2VyLnBhcnNlKGNvbnRlbnQpO1xuXG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGB4bGlmZiBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvcnMuam9pbihcIlxcblwiKX1gKTtcbiAgfVxuXG4gIHJldHVybiB4bWxNZXNzYWdlc0J5SWQ7XG59XG5cbi8vIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL3hsaWZmL3YxLjIvb3MveGxpZmYtY29yZS5odG1sXG4vLyBodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy94bGlmZi92MS4yL3hsaWZmLXByb2ZpbGUtaHRtbC94bGlmZi1wcm9maWxlLWh0bWwtMS4yLmh0bWxcbmV4cG9ydCBmdW5jdGlvbiB4bGlmZldyaXRlKG1lc3NhZ2VzOiBpMThuLk1lc3NhZ2VbXSwgbG9jYWxlOiBzdHJpbmcgfCBudWxsLCBleGlzdGluZ05vZGVzPzogeG1sLk5vZGVbXSk6IHN0cmluZyB7XG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgV3JpdGVWaXNpdG9yKCk7XG4gIGNvbnN0IHRyYW5zVW5pdHM6IHhtbC5Ob2RlW10gPSBleGlzdGluZ05vZGVzICYmIGV4aXN0aW5nTm9kZXMubGVuZ3RoID8gW25ldyB4bWwuQ1IoNiksIC4uLmV4aXN0aW5nTm9kZXNdIDogW107XG5cbiAgbWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICBjb25zdCBjb250ZXh0VGFnczogeG1sLk5vZGVbXSA9IFtdO1xuICAgIG1lc3NhZ2Uuc291cmNlcy5mb3JFYWNoKChzb3VyY2U6IGkxOG4uTWVzc2FnZVNwYW4pID0+IHtcbiAgICAgIGNvbnN0IGNvbnRleHRHcm91cFRhZyA9IG5ldyB4bWwuVGFnKF9DT05URVhUX0dST1VQX1RBRywge3B1cnBvc2U6IFwibG9jYXRpb25cIn0pO1xuICAgICAgY29udGV4dEdyb3VwVGFnLmNoaWxkcmVuLnB1c2goXG4gICAgICAgIG5ldyB4bWwuQ1IoMTApLFxuICAgICAgICBuZXcgeG1sLlRhZyhfQ09OVEVYVF9UQUcsIHtcImNvbnRleHQtdHlwZVwiOiBcInNvdXJjZWZpbGVcIn0sIFtuZXcgeG1sLlRleHQoc291cmNlLmZpbGVQYXRoKV0pLFxuICAgICAgICBuZXcgeG1sLkNSKDEwKSxcbiAgICAgICAgbmV3IHhtbC5UYWcoX0NPTlRFWFRfVEFHLCB7XCJjb250ZXh0LXR5cGVcIjogXCJsaW5lbnVtYmVyXCJ9LCBbbmV3IHhtbC5UZXh0KGAke3NvdXJjZS5zdGFydExpbmV9YCldKSxcbiAgICAgICAgbmV3IHhtbC5DUig4KVxuICAgICAgKTtcbiAgICAgIGNvbnRleHRUYWdzLnB1c2gobmV3IHhtbC5DUig4KSwgY29udGV4dEdyb3VwVGFnKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IHRyYW5zVW5pdCA9IG5ldyB4bWwuVGFnKF9VTklUX1RBRywge2lkOiBtZXNzYWdlLmlkLCBkYXRhdHlwZTogXCJodG1sXCJ9KTtcbiAgICB0cmFuc1VuaXQuY2hpbGRyZW4ucHVzaChcbiAgICAgIG5ldyB4bWwuQ1IoOCksXG4gICAgICBuZXcgeG1sLlRhZyhfU09VUkNFX1RBRywge30sIHZpc2l0b3Iuc2VyaWFsaXplKG1lc3NhZ2Uubm9kZXMpKSxcbiAgICAgIC4uLmNvbnRleHRUYWdzXG4gICAgKTtcblxuICAgIGlmIChtZXNzYWdlLmRlc2NyaXB0aW9uKSB7XG4gICAgICB0cmFuc1VuaXQuY2hpbGRyZW4ucHVzaChcbiAgICAgICAgbmV3IHhtbC5DUig4KSxcbiAgICAgICAgbmV3IHhtbC5UYWcoXCJub3RlXCIsIHtwcmlvcml0eTogXCIxXCIsIGZyb206IFwiZGVzY3JpcHRpb25cIn0sIFtuZXcgeG1sLlRleHQobWVzc2FnZS5kZXNjcmlwdGlvbildKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZS5tZWFuaW5nKSB7XG4gICAgICB0cmFuc1VuaXQuY2hpbGRyZW4ucHVzaChcbiAgICAgICAgbmV3IHhtbC5DUig4KSxcbiAgICAgICAgbmV3IHhtbC5UYWcoXCJub3RlXCIsIHtwcmlvcml0eTogXCIxXCIsIGZyb206IFwibWVhbmluZ1wifSwgW25ldyB4bWwuVGV4dChtZXNzYWdlLm1lYW5pbmcpXSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdHJhbnNVbml0LmNoaWxkcmVuLnB1c2gobmV3IHhtbC5DUig2KSk7XG5cbiAgICB0cmFuc1VuaXRzLnB1c2gobmV3IHhtbC5DUig2KSwgdHJhbnNVbml0KTtcbiAgfSk7XG5cbiAgY29uc3QgYm9keSA9IG5ldyB4bWwuVGFnKFwiYm9keVwiLCB7fSwgWy4uLnRyYW5zVW5pdHMsIG5ldyB4bWwuQ1IoNCldKTtcbiAgY29uc3QgZmlsZSA9IG5ldyB4bWwuVGFnKFxuICAgIFwiZmlsZVwiLFxuICAgIHtcbiAgICAgIFwic291cmNlLWxhbmd1YWdlXCI6IGxvY2FsZSB8fCBfREVGQVVMVF9TT1VSQ0VfTEFORyxcbiAgICAgIGRhdGF0eXBlOiBcInBsYWludGV4dFwiLFxuICAgICAgb3JpZ2luYWw6IFwibmcyLnRlbXBsYXRlXCJcbiAgICB9LFxuICAgIFtuZXcgeG1sLkNSKDQpLCBib2R5LCBuZXcgeG1sLkNSKDIpXVxuICApO1xuICBjb25zdCB4bGlmZiA9IG5ldyB4bWwuVGFnKFwieGxpZmZcIiwge3ZlcnNpb246IF9WRVJTSU9OLCB4bWxuczogX1hNTE5TfSwgW25ldyB4bWwuQ1IoMiksIGZpbGUsIG5ldyB4bWwuQ1IoKV0pO1xuXG4gIHJldHVybiB4bWwuc2VyaWFsaXplKFtuZXcgeG1sLkRlY2xhcmF0aW9uKHt2ZXJzaW9uOiBcIjEuMFwiLCBlbmNvZGluZzogXCJVVEYtOFwifSksIG5ldyB4bWwuQ1IoKSwgeGxpZmYsIG5ldyB4bWwuQ1IoKV0pO1xufVxuXG5leHBvcnQgY29uc3QgeGxpZmZEaWdlc3QgPSBkaWdlc3Q7XG5cbi8vIEV4dHJhY3QgbWVzc2FnZXMgYXMgeG1sIG5vZGVzIGZyb20gdGhlIHhsaWZmIGZpbGVcbmNsYXNzIFhsaWZmUGFyc2VyIGltcGxlbWVudHMgbWwuVmlzaXRvciB7XG4gIHByaXZhdGUgX3VuaXRNbFN0cmluZzogc3RyaW5nIHwgbnVsbDtcbiAgcHJpdmF0ZSBfZXJyb3JzOiBJMThuRXJyb3JbXTtcbiAgcHJpdmF0ZSBfbXNnSWRUb0h0bWw6IHtbbXNnSWQ6IHN0cmluZ106IHN0cmluZ307XG5cbiAgcGFyc2UoY29udGVudDogc3RyaW5nKSB7XG4gICAgdGhpcy5fdW5pdE1sU3RyaW5nID0gbnVsbDtcbiAgICB0aGlzLl9tc2dJZFRvSHRtbCA9IHt9O1xuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihnZXRYbWxUYWdEZWZpbml0aW9uKS5wYXJzZShjb250ZW50LCBcIlwiLCBmYWxzZSk7XG4gICAgdGhpcy5fZXJyb3JzID0gcGFyc2VyLmVycm9ycztcbiAgICBtbC52aXNpdEFsbCh0aGlzLCBwYXJzZXIucm9vdE5vZGVzLCBudWxsKTtcblxuICAgIHJldHVybiB7XG4gICAgICBtc2dJZFRvSHRtbDogdGhpcy5fbXNnSWRUb0h0bWwsXG4gICAgICBlcnJvcnM6IHRoaXMuX2Vycm9yc1xuICAgIH07XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogbWwuRWxlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzd2l0Y2ggKGVsZW1lbnQubmFtZSkge1xuICAgICAgY2FzZSBfVU5JVF9UQUc6XG4gICAgICAgIHRoaXMuX3VuaXRNbFN0cmluZyA9IG51bGwhO1xuICAgICAgICBjb25zdCBpZEF0dHIgPSBlbGVtZW50LmF0dHJzLmZpbmQoYXR0ciA9PiBhdHRyLm5hbWUgPT09IFwiaWRcIik7XG4gICAgICAgIGlmICghaWRBdHRyKSB7XG4gICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYDwke19VTklUX1RBR30+IG1pc3NlcyB0aGUgXCJpZFwiIGF0dHJpYnV0ZWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlkID0gaWRBdHRyLnZhbHVlO1xuICAgICAgICAgIGlmICh0aGlzLl9tc2dJZFRvSHRtbC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZEVycm9yKGVsZW1lbnQsIGBEdXBsaWNhdGVkIHRyYW5zbGF0aW9ucyBmb3IgbXNnICR7aWR9YCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl91bml0TWxTdHJpbmcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgdGhpcy5fbXNnSWRUb0h0bWxbaWRdID0gdGhpcy5fdW5pdE1sU3RyaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5fYWRkRXJyb3IoZWxlbWVudCwgYE1lc3NhZ2UgJHtpZH0gbWlzc2VzIGEgdHJhbnNsYXRpb25gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgX1NPVVJDRV9UQUc6XG4gICAgICAgIC8vIGlnbm9yZSBzb3VyY2UgbWVzc2FnZVxuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBfVEFSR0VUX1RBRzpcbiAgICAgICAgY29uc3QgaW5uZXJUZXh0U3RhcnQgPSBlbGVtZW50LnN0YXJ0U291cmNlU3BhbiEuZW5kLm9mZnNldDtcbiAgICAgICAgY29uc3QgaW5uZXJUZXh0RW5kID0gZWxlbWVudC5lbmRTb3VyY2VTcGFuIS5zdGFydC5vZmZzZXQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBlbGVtZW50LnN0YXJ0U291cmNlU3BhbiEuc3RhcnQuZmlsZS5jb250ZW50O1xuICAgICAgICBjb25zdCBpbm5lclRleHQgPSBjb250ZW50LnNsaWNlKGlubmVyVGV4dFN0YXJ0LCBpbm5lclRleHRFbmQpO1xuICAgICAgICB0aGlzLl91bml0TWxTdHJpbmcgPSBpbm5lclRleHQ7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIF9GSUxFX1RBRzpcbiAgICAgICAgbWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBUT0RPKHZpY2IpOiBhc3NlcnQgZmlsZSBzdHJ1Y3R1cmUsIHhsaWZmIHZlcnNpb25cbiAgICAgICAgLy8gRm9yIG5vdyBvbmx5IHJlY3Vyc2Ugb24gdW5oYW5kbGVkIG5vZGVzXG4gICAgICAgIG1sLnZpc2l0QWxsKHRoaXMsIGVsZW1lbnQuY2hpbGRyZW4sIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdFRleHQodGV4dDogbWwuVGV4dCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogbWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogbWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4hLCBtZXNzYWdlKSk7XG4gIH1cbn1cblxuLy8gQ29udmVydCBtbCBub2RlcyAoeGxpZmYgc3ludGF4KSB0byBpMThuIG5vZGVzXG5jbGFzcyBYbWxUb0kxOG4gaW1wbGVtZW50cyBtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBfZXJyb3JzOiBJMThuRXJyb3JbXTtcblxuICBjb252ZXJ0KG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHhtbEljdSA9IG5ldyBQYXJzZXIoZ2V0WG1sVGFnRGVmaW5pdGlvbikucGFyc2UobWVzc2FnZSwgXCJcIiwgdHJ1ZSk7XG4gICAgdGhpcy5fZXJyb3JzID0geG1sSWN1LmVycm9ycztcblxuICAgIGNvbnN0IGkxOG5Ob2RlcyA9XG4gICAgICB0aGlzLl9lcnJvcnMubGVuZ3RoID4gMCB8fCB4bWxJY3Uucm9vdE5vZGVzLmxlbmd0aCA9PT0gMCA/IFtdIDogbWwudmlzaXRBbGwodGhpcywgeG1sSWN1LnJvb3ROb2Rlcyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaTE4bk5vZGVzLFxuICAgICAgZXJyb3JzOiB0aGlzLl9lcnJvcnNcbiAgICB9O1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IG1sLlRleHQsIGNvbnRleHQ6IGFueSkge1xuICAgIHJldHVybiBuZXcgaTE4bi5UZXh0KHRleHQudmFsdWUsIHRleHQuc291cmNlU3BhbiEpO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsOiBtbC5FbGVtZW50LCBjb250ZXh0OiBhbnkpOiBpMThuLlBsYWNlaG9sZGVyIHwgbnVsbCB7XG4gICAgaWYgKGVsLm5hbWUgPT09IF9QTEFDRUhPTERFUl9UQUcpIHtcbiAgICAgIGNvbnN0IG5hbWVBdHRyID0gZWwuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJpZFwiKTtcbiAgICAgIGlmIChuYW1lQXR0cikge1xuICAgICAgICByZXR1cm4gbmV3IGkxOG4uUGxhY2Vob2xkZXIoXCJcIiwgbmFtZUF0dHIudmFsdWUsIGVsLnNvdXJjZVNwYW4hKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYWRkRXJyb3IoZWwsIGA8JHtfUExBQ0VIT0xERVJfVEFHfT4gbWlzc2VzIHRoZSBcImlkXCIgYXR0cmlidXRlYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2FkZEVycm9yKGVsLCBgVW5leHBlY3RlZCB0YWdgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbihpY3U6IG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KSB7XG4gICAgY29uc3QgY2FzZU1hcDoge1t2YWx1ZTogc3RyaW5nXTogaTE4bi5Ob2RlfSA9IHt9O1xuXG4gICAgbWwudmlzaXRBbGwodGhpcywgaWN1LmNhc2VzKS5mb3JFYWNoKChjOiBhbnkpID0+IHtcbiAgICAgIGNhc2VNYXBbYy52YWx1ZV0gPSBuZXcgaTE4bi5Db250YWluZXIoYy5ub2RlcywgaWN1LnNvdXJjZVNwYW4pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBpMThuLkljdShpY3Uuc3dpdGNoVmFsdWUsIGljdS50eXBlLCBjYXNlTWFwLCBpY3Uuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoaWN1Q2FzZTogbWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IGljdUNhc2UudmFsdWUsXG4gICAgICBub2RlczogbWwudmlzaXRBbGwodGhpcywgaWN1Q2FzZS5leHByZXNzaW9uKVxuICAgIH07XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogbWwuQ29tbWVudCwgY29udGV4dDogYW55KSB7fVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogbWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpIHt9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3Iobm9kZTogbWwuTm9kZSwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3JzLnB1c2gobmV3IEkxOG5FcnJvcihub2RlLnNvdXJjZVNwYW4hLCBtZXNzYWdlKSk7XG4gIH1cbn1cblxuY2xhc3MgV3JpdGVWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgdmlzaXRUZXh0KHRleHQ6IGkxOG4uVGV4dCwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIHJldHVybiBbbmV3IHhtbC5UZXh0KHRleHQudmFsdWUpXTtcbiAgfVxuXG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogaTE4bi5Db250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBub2RlczogeG1sLk5vZGVbXSA9IFtdO1xuICAgIGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKChub2RlOiBpMThuLk5vZGUpID0+IG5vZGVzLnB1c2goLi4ubm9kZS52aXNpdCh0aGlzKSkpO1xuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIHZpc2l0SWN1KGljdTogaTE4bi5JY3UsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBub2RlcyA9IFtuZXcgeG1sLlRleHQoYHske2ljdS5leHByZXNzaW9uUGxhY2Vob2xkZXJ9LCAke2ljdS50eXBlfSwgYCldO1xuXG4gICAgT2JqZWN0LmtleXMoaWN1LmNhc2VzKS5mb3JFYWNoKChjOiBzdHJpbmcpID0+IHtcbiAgICAgIG5vZGVzLnB1c2gobmV3IHhtbC5UZXh0KGAke2N9IHtgKSwgLi4uaWN1LmNhc2VzW2NdLnZpc2l0KHRoaXMpLCBuZXcgeG1sLlRleHQoYH0gYCkpO1xuICAgIH0pO1xuXG4gICAgbm9kZXMucHVzaChuZXcgeG1sLlRleHQoYH1gKSk7XG5cbiAgICByZXR1cm4gbm9kZXM7XG4gIH1cblxuICB2aXNpdFRhZ1BsYWNlaG9sZGVyKHBoOiBpMThuLlRhZ1BsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgY29uc3QgY3R5cGUgPSBnZXRDdHlwZUZvclRhZyhwaC50YWcpO1xuXG4gICAgaWYgKHBoLmlzVm9pZCkge1xuICAgICAgLy8gdm9pZCB0YWdzIGhhdmUgbm8gY2hpbGRyZW4gbm9yIGNsb3NpbmcgdGFnc1xuICAgICAgcmV0dXJuIFtuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7aWQ6IHBoLnN0YXJ0TmFtZSwgY3R5cGUsIFwiZXF1aXYtdGV4dFwiOiBgPCR7cGgudGFnfS8+YH0pXTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydFRhZ1BoID0gbmV3IHhtbC5UYWcoX1BMQUNFSE9MREVSX1RBRywge2lkOiBwaC5zdGFydE5hbWUsIGN0eXBlLCBcImVxdWl2LXRleHRcIjogYDwke3BoLnRhZ30+YH0pO1xuICAgIGNvbnN0IGNsb3NlVGFnUGggPSBuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7aWQ6IHBoLmNsb3NlTmFtZSwgY3R5cGUsIFwiZXF1aXYtdGV4dFwiOiBgPC8ke3BoLnRhZ30+YH0pO1xuXG4gICAgcmV0dXJuIFtzdGFydFRhZ1BoLCAuLi50aGlzLnNlcmlhbGl6ZShwaC5jaGlsZHJlbiksIGNsb3NlVGFnUGhdO1xuICB9XG5cbiAgdmlzaXRQbGFjZWhvbGRlcihwaDogaTE4bi5QbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIHJldHVybiBbbmV3IHhtbC5UYWcoX1BMQUNFSE9MREVSX1RBRywge2lkOiBwaC5uYW1lLCBcImVxdWl2LXRleHRcIjogYHt7JHtwaC52YWx1ZX19fWB9KV07XG4gIH1cblxuICB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBpMThuLkljdVBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogeG1sLk5vZGVbXSB7XG4gICAgY29uc3QgZXF1aXZUZXh0ID0gYHske3BoLnZhbHVlLmV4cHJlc3Npb259LCAke3BoLnZhbHVlLnR5cGV9LCAke09iamVjdC5rZXlzKHBoLnZhbHVlLmNhc2VzKVxuICAgICAgLm1hcCgodmFsdWU6IHN0cmluZykgPT4gdmFsdWUgKyBcIiB7Li4ufVwiKVxuICAgICAgLmpvaW4oXCIgXCIpfX1gO1xuICAgIHJldHVybiBbbmV3IHhtbC5UYWcoX1BMQUNFSE9MREVSX1RBRywge2lkOiBwaC5uYW1lLCBcImVxdWl2LXRleHRcIjogZXF1aXZUZXh0fSldO1xuICB9XG5cbiAgc2VyaWFsaXplKG5vZGVzOiBpMThuLk5vZGVbXSk6IHhtbC5Ob2RlW10ge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4ubm9kZXMubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEN0eXBlRm9yVGFnKHRhZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgc3dpdGNoICh0YWcudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgXCJiclwiOlxuICAgICAgcmV0dXJuIFwibGJcIjtcbiAgICBjYXNlIFwiaW1nXCI6XG4gICAgICByZXR1cm4gXCJpbWFnZVwiO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gYHgtJHt0YWd9YDtcbiAgfVxufVxuIl19