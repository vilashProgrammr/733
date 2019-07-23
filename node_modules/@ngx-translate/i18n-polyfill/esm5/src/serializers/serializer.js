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
import * as html from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import { getHtmlTagDefinition } from "../ast/html_tags";
import { I18nPluralPipe, I18nSelectPipe, NgLocaleLocalization } from "@angular/common";
import { Parser } from "../ast/parser";
import { getXmlTagDefinition } from "../ast/xml_tags";
/**
 * @record
 */
export function I18nMessagesById() { }
function I18nMessagesById_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [msgId: string]: i18n.Node[];
    */
}
/**
 * @record
 */
export function XmlMessagesById() { }
function XmlMessagesById_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    [id: string]: xml.Node;
    */
}
/**
 * @record
 */
export function IcuContent() { }
function IcuContent_tsickle_Closure_declarations() {
    /** @type {?} */
    IcuContent.prototype.cases;
    /** @type {?} */
    IcuContent.prototype.expression;
    /** @type {?} */
    IcuContent.prototype.type;
}
/**
 * @record
 */
export function IcuContentStr() { }
function IcuContentStr_tsickle_Closure_declarations() {
    /** @type {?} */
    IcuContentStr.prototype.cases;
    /** @type {?} */
    IcuContentStr.prototype.expression;
    /** @type {?} */
    IcuContentStr.prototype.type;
}
/**
 * A `PlaceholderMapper` converts placeholder names from internal to serialized representation and
 * back.
 *
 * It should be used for serialization format that put constraints on the placeholder names.
 * @record
 */
export function PlaceholderMapper() { }
function PlaceholderMapper_tsickle_Closure_declarations() {
    /** @type {?} */
    PlaceholderMapper.prototype.toPublicName;
    /** @type {?} */
    PlaceholderMapper.prototype.toInternalName;
}
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
var /**
 * A simple mapper that take a function to transform an internal name to a public name
 */
SimplePlaceholderMapper = /** @class */ (function (_super) {
    tslib_1.__extends(SimplePlaceholderMapper, _super);
    // create a mapping from the message
    function SimplePlaceholderMapper(message, mapName) {
        var _this = _super.call(this) || this;
        _this.mapName = mapName;
        _this.internalToPublic = {};
        _this.publicToNextId = {};
        _this.publicToInternal = {};
        message.nodes.forEach(function (node) { return node.visit(_this); });
        return _this;
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.toPublicName = /**
     * @param {?} internalName
     * @return {?}
     */
    function (internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ? this.internalToPublic[internalName] : null;
    };
    /**
     * @param {?} publicName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.toInternalName = /**
     * @param {?} publicName
     * @return {?}
     */
    function (publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] : null;
    };
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) {
        return null;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        this.visitPlaceholderName(ph.startName);
        _super.prototype.visitTagPlaceholder.call(this, ph, context);
        this.visitPlaceholderName(ph.closeName);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        this.visitPlaceholderName(ph.name);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        this.visitPlaceholderName(ph.name);
    };
    /**
     * @param {?} internalName
     * @return {?}
     */
    SimplePlaceholderMapper.prototype.visitPlaceholderName = /**
     * @param {?} internalName
     * @return {?}
     */
    function (internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        var /** @type {?} */ publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            var /** @type {?} */ nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = publicName + "_" + nextId;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    };
    return SimplePlaceholderMapper;
}(i18n.RecurseVisitor));
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
export { SimplePlaceholderMapper };
function SimplePlaceholderMapper_tsickle_Closure_declarations() {
    /** @type {?} */
    SimplePlaceholderMapper.prototype.internalToPublic;
    /** @type {?} */
    SimplePlaceholderMapper.prototype.publicToNextId;
    /** @type {?} */
    SimplePlaceholderMapper.prototype.publicToInternal;
    /** @type {?} */
    SimplePlaceholderMapper.prototype.mapName;
}
var /** @type {?} */ i18nSelectPipe = new I18nSelectPipe();
var SerializerVisitor = /** @class */ (function () {
    function SerializerVisitor(locale, params) {
        this.params = params;
        this.i18nPluralPipe = new I18nPluralPipe(new NgLocaleLocalization(locale));
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitElement = /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) {
        if (getHtmlTagDefinition(element.name).isVoid) {
            return "<" + element.name + this.serializeNodes(element.attrs, " ") + "/>";
        }
        return "<" + element.name + this.serializeNodes(element.attrs, " ") + ">" + this.serializeNodes(element.children) + "</" + element.name + ">";
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) {
        return attribute.name + "=\"" + attribute.value + "\"";
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        return text.value;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) {
        return "<!--" + comment.value + "-->";
    };
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitExpansion = /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    function (expansion, context) {
        var _this = this;
        var /** @type {?} */ cases = {};
        expansion.cases.forEach(function (c) { return (cases[c.value] = _this.serializeNodes(c.expression)); });
        switch (expansion.type) {
            case "select":
                return i18nSelectPipe.transform(this.params[expansion.switchValue] || "", cases);
            case "plural":
                return this.i18nPluralPipe.transform(this.params[expansion.switchValue], cases);
        }
        throw new Error("Unknown expansion type \"" + expansion.type + "\"");
    };
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    function (expansionCase, context) {
        return " " + expansionCase.value + " {" + this.serializeNodes(expansionCase.expression) + "}";
    };
    /**
     * @param {?} nodes
     * @param {?=} join
     * @return {?}
     */
    SerializerVisitor.prototype.serializeNodes = /**
     * @param {?} nodes
     * @param {?=} join
     * @return {?}
     */
    function (nodes, join) {
        var _this = this;
        if (join === void 0) { join = ""; }
        if (nodes.length === 0) {
            return "";
        }
        return join + nodes.map(function (a) { return a.visit(_this, null); }).join(join);
    };
    return SerializerVisitor;
}());
function SerializerVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    SerializerVisitor.prototype.i18nPluralPipe;
    /** @type {?} */
    SerializerVisitor.prototype.params;
}
/**
 * @param {?} nodes
 * @param {?} locale
 * @param {?} params
 * @return {?}
 */
export function serializeNodes(nodes, locale, params) {
    return nodes.map(function (node) { return node.visit(new SerializerVisitor(locale, params), null); });
}
var HtmlToXmlParser = /** @class */ (function () {
    function HtmlToXmlParser(MESSAGE_TAG) {
        this.MESSAGE_TAG = MESSAGE_TAG;
    }
    /**
     * @param {?} content
     * @return {?}
     */
    HtmlToXmlParser.prototype.parse = /**
     * @param {?} content
     * @return {?}
     */
    function (content) {
        this.xmlMessagesById = {};
        var /** @type {?} */ parser = new Parser(getXmlTagDefinition).parse(content, "", false);
        this.errors = parser.errors;
        html.visitAll(this, parser.rootNodes, null);
        return {
            xmlMessagesById: this.xmlMessagesById,
            errors: this.errors
        };
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    HtmlToXmlParser.prototype.visitElement = /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) {
        switch (element.name) {
            case this.MESSAGE_TAG:
                var /** @type {?} */ id = element.attrs.find(function (attr) { return attr.name === "id"; });
                if (id) {
                    this.xmlMessagesById[id.value] = /** @type {?} */ ((/** @type {?} */ (element)));
                }
                break;
            default:
                html.visitAll(this, element.children, null);
        }
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    HtmlToXmlParser.prototype.visitAttribute = /**
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
    HtmlToXmlParser.prototype.visitText = /**
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
    HtmlToXmlParser.prototype.visitComment = /**
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
    HtmlToXmlParser.prototype.visitExpansion = /**
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
    HtmlToXmlParser.prototype.visitExpansionCase = /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    function (expansionCase, context) { };
    return HtmlToXmlParser;
}());
export { HtmlToXmlParser };
function HtmlToXmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlToXmlParser.prototype.errors;
    /** @type {?} */
    HtmlToXmlParser.prototype.xmlMessagesById;
    /** @type {?} */
    HtmlToXmlParser.prototype.MESSAGE_TAG;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvc2VyaWFsaXplcnMvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEtBQUssSUFBSSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLG9CQUFvQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDckYsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNyQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNwRDs7O0FBQUE7SUFBNkMsbURBQW1CO0lBSzlELG9DQUFvQztJQUNwQyxpQ0FBWSxPQUFxQixFQUFVLE9BQWlDO1FBQTVFLFlBQ0UsaUJBQU8sU0FFUjtRQUgwQyxhQUFPLEdBQVAsT0FBTyxDQUEwQjtpQ0FMMUIsRUFBRTsrQkFDSixFQUFFO2lDQUNBLEVBQUU7UUFLbEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7O0tBQ2pEOzs7OztJQUVELDhDQUFZOzs7O0lBQVosVUFBYSxZQUFvQjtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxD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Ozs7O0lBRUQsd0NBQWM7Ozs7O0lBQWQsVUFBZSxTQUF5QixFQUFFLE9BQVksS0FBUzs7Ozs7O0lBRS9ELG1DQUFTOzs7OztJQUFULFVBQVUsSUFBZSxFQUFFLE9BQVksS0FBUzs7Ozs7O0lBRWhELHNDQUFZOzs7OztJQUFaLFVBQWEsT0FBcUIsRUFBRSxPQUFZLEtBQVM7Ozs7OztJQUV6RCx3Q0FBYzs7Ozs7SUFBZCxVQUFlLFNBQXlCLEVBQUUsT0FBWSxLQUFTOzs7Ozs7SUFFL0QsNENBQWtCOzs7OztJQUFsQixVQUFtQixhQUFpQyxFQUFFLE9BQVksS0FBUzswQkFqTjdFO0lBa05DLENBQUE7QUExQ0QsMkJBMENDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBodG1sIGZyb20gXCIuLi9hc3QvYXN0XCI7XG5pbXBvcnQgKiBhcyBpMThuIGZyb20gXCIuLi9hc3QvaTE4bl9hc3RcIjtcbmltcG9ydCB7Z2V0SHRtbFRhZ0RlZmluaXRpb259IGZyb20gXCIuLi9hc3QvaHRtbF90YWdzXCI7XG5pbXBvcnQge0kxOG5QbHVyYWxQaXBlLCBJMThuU2VsZWN0UGlwZSwgTmdMb2NhbGVMb2NhbGl6YXRpb259IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcbmltcG9ydCB7UGFyc2VyfSBmcm9tIFwiLi4vYXN0L3BhcnNlclwiO1xuaW1wb3J0IHtnZXRYbWxUYWdEZWZpbml0aW9ufSBmcm9tIFwiLi4vYXN0L3htbF90YWdzXCI7XG5pbXBvcnQge0kxOG5FcnJvcn0gZnJvbSBcIi4uL2FzdC9wYXJzZV91dGlsXCI7XG5pbXBvcnQgKiBhcyB4bWwgZnJvbSBcIi4veG1sX2hlbHBlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEkxOG5NZXNzYWdlc0J5SWQge1xuICBbbXNnSWQ6IHN0cmluZ106IGkxOG4uTm9kZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFhtbE1lc3NhZ2VzQnlJZCB7XG4gIFtpZDogc3RyaW5nXTogeG1sLk5vZGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWN1Q29udGVudCB7XG4gIGNhc2VzOiB7W3ZhbHVlOiBzdHJpbmddOiBodG1sLk5vZGVbXX07XG4gIGV4cHJlc3Npb246IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEljdUNvbnRlbnRTdHIge1xuICBjYXNlczoge1t2YWx1ZTogc3RyaW5nXTogc3RyaW5nfTtcbiAgZXhwcmVzc2lvbjogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBgUGxhY2Vob2xkZXJNYXBwZXJgIGNvbnZlcnRzIHBsYWNlaG9sZGVyIG5hbWVzIGZyb20gaW50ZXJuYWwgdG8gc2VyaWFsaXplZCByZXByZXNlbnRhdGlvbiBhbmRcbiAqIGJhY2suXG4gKlxuICogSXQgc2hvdWxkIGJlIHVzZWQgZm9yIHNlcmlhbGl6YXRpb24gZm9ybWF0IHRoYXQgcHV0IGNvbnN0cmFpbnRzIG9uIHRoZSBwbGFjZWhvbGRlciBuYW1lcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQbGFjZWhvbGRlck1hcHBlciB7XG4gIHRvUHVibGljTmFtZShpbnRlcm5hbE5hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG5cbiAgdG9JbnRlcm5hbE5hbWUocHVibGljTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBBIHNpbXBsZSBtYXBwZXIgdGhhdCB0YWtlIGEgZnVuY3Rpb24gdG8gdHJhbnNmb3JtIGFuIGludGVybmFsIG5hbWUgdG8gYSBwdWJsaWMgbmFtZVxuICovXG5leHBvcnQgY2xhc3MgU2ltcGxlUGxhY2Vob2xkZXJNYXBwZXIgZXh0ZW5kcyBpMThuLlJlY3Vyc2VWaXNpdG9yIGltcGxlbWVudHMgUGxhY2Vob2xkZXJNYXBwZXIge1xuICBwcml2YXRlIGludGVybmFsVG9QdWJsaWM6IHtbazogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuICBwcml2YXRlIHB1YmxpY1RvTmV4dElkOiB7W2s6IHN0cmluZ106IG51bWJlcn0gPSB7fTtcbiAgcHJpdmF0ZSBwdWJsaWNUb0ludGVybmFsOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAvLyBjcmVhdGUgYSBtYXBwaW5nIGZyb20gdGhlIG1lc3NhZ2VcbiAgY29uc3RydWN0b3IobWVzc2FnZTogaTE4bi5NZXNzYWdlLCBwcml2YXRlIG1hcE5hbWU6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gICAgbWVzc2FnZS5ub2Rlcy5mb3JFYWNoKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB0b1B1YmxpY05hbWUoaW50ZXJuYWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFRvUHVibGljLmhhc093blByb3BlcnR5KGludGVybmFsTmFtZSkgPyB0aGlzLmludGVybmFsVG9QdWJsaWNbaW50ZXJuYWxOYW1lXSA6IG51bGw7XG4gIH1cblxuICB0b0ludGVybmFsTmFtZShwdWJsaWNOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5wdWJsaWNUb0ludGVybmFsLmhhc093blByb3BlcnR5KHB1YmxpY05hbWUpID8gdGhpcy5wdWJsaWNUb0ludGVybmFsW3B1YmxpY05hbWVdIDogbnVsbDtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBpMThuLlRleHQsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdFBsYWNlaG9sZGVyTmFtZShwaC5zdGFydE5hbWUpO1xuICAgIHN1cGVyLnZpc2l0VGFnUGxhY2Vob2xkZXIocGgsIGNvbnRleHQpO1xuICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlck5hbWUocGguY2xvc2VOYW1lKTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlck5hbWUocGgubmFtZSk7XG4gIH1cblxuICB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBpMThuLkljdVBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXJOYW1lKHBoLm5hbWUpO1xuICB9XG5cbiAgLy8gWE1CIHBsYWNlaG9sZGVycyBjb3VsZCBvbmx5IGNvbnRhaW5zIEEtWiwgMC05IGFuZCBfXG4gIHByaXZhdGUgdmlzaXRQbGFjZWhvbGRlck5hbWUoaW50ZXJuYWxOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWludGVybmFsTmFtZSB8fCB0aGlzLmludGVybmFsVG9QdWJsaWMuaGFzT3duUHJvcGVydHkoaW50ZXJuYWxOYW1lKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwdWJsaWNOYW1lID0gdGhpcy5tYXBOYW1lKGludGVybmFsTmFtZSk7XG5cbiAgICBpZiAodGhpcy5wdWJsaWNUb0ludGVybmFsLmhhc093blByb3BlcnR5KHB1YmxpY05hbWUpKSB7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgWE1CIHdoZW4gaXQgaGFzIGFscmVhZHkgYmVlbiB1c2VkXG4gICAgICBjb25zdCBuZXh0SWQgPSB0aGlzLnB1YmxpY1RvTmV4dElkW3B1YmxpY05hbWVdO1xuICAgICAgdGhpcy5wdWJsaWNUb05leHRJZFtwdWJsaWNOYW1lXSA9IG5leHRJZCArIDE7XG4gICAgICBwdWJsaWNOYW1lID0gYCR7cHVibGljTmFtZX1fJHtuZXh0SWR9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdWJsaWNUb05leHRJZFtwdWJsaWNOYW1lXSA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5pbnRlcm5hbFRvUHVibGljW2ludGVybmFsTmFtZV0gPSBwdWJsaWNOYW1lO1xuICAgIHRoaXMucHVibGljVG9JbnRlcm5hbFtwdWJsaWNOYW1lXSA9IGludGVybmFsTmFtZTtcbiAgfVxufVxuXG5jb25zdCBpMThuU2VsZWN0UGlwZSA9IG5ldyBJMThuU2VsZWN0UGlwZSgpO1xuY2xhc3MgU2VyaWFsaXplclZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIGkxOG5QbHVyYWxQaXBlOiBJMThuUGx1cmFsUGlwZTtcbiAgY29uc3RydWN0b3IobG9jYWxlOiBzdHJpbmcsIHByaXZhdGUgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSkge1xuICAgIHRoaXMuaTE4blBsdXJhbFBpcGUgPSBuZXcgSTE4blBsdXJhbFBpcGUobmV3IE5nTG9jYWxlTG9jYWxpemF0aW9uKGxvY2FsZSkpO1xuICB9XG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBodG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgaWYgKGdldEh0bWxUYWdEZWZpbml0aW9uKGVsZW1lbnQubmFtZSkuaXNWb2lkKSB7XG4gICAgICByZXR1cm4gYDwke2VsZW1lbnQubmFtZX0ke3RoaXMuc2VyaWFsaXplTm9kZXMoZWxlbWVudC5hdHRycywgXCIgXCIpfS8+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gYDwke2VsZW1lbnQubmFtZX0ke3RoaXMuc2VyaWFsaXplTm9kZXMoZWxlbWVudC5hdHRycywgXCIgXCIpfT4ke3RoaXMuc2VyaWFsaXplTm9kZXMoZWxlbWVudC5jaGlsZHJlbil9PC8ke1xuICAgICAgZWxlbWVudC5uYW1lXG4gICAgfT5gO1xuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gYCR7YXR0cmlidXRlLm5hbWV9PVwiJHthdHRyaWJ1dGUudmFsdWV9XCJgO1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGh0bWwuVGV4dCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGV4dC52YWx1ZTtcbiAgfVxuXG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBodG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGA8IS0tJHtjb21tZW50LnZhbHVlfS0tPmA7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IGh0bWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGNhc2VzID0ge307XG4gICAgZXhwYW5zaW9uLmNhc2VzLmZvckVhY2goYyA9PiAoY2FzZXNbYy52YWx1ZV0gPSB0aGlzLnNlcmlhbGl6ZU5vZGVzKGMuZXhwcmVzc2lvbikpKTtcblxuICAgIHN3aXRjaCAoZXhwYW5zaW9uLnR5cGUpIHtcbiAgICAgIGNhc2UgXCJzZWxlY3RcIjpcbiAgICAgICAgcmV0dXJuIGkxOG5TZWxlY3RQaXBlLnRyYW5zZm9ybSh0aGlzLnBhcmFtc1tleHBhbnNpb24uc3dpdGNoVmFsdWVdIHx8IFwiXCIsIGNhc2VzKTtcbiAgICAgIGNhc2UgXCJwbHVyYWxcIjpcbiAgICAgICAgcmV0dXJuIHRoaXMuaTE4blBsdXJhbFBpcGUudHJhbnNmb3JtKHRoaXMucGFyYW1zW2V4cGFuc2lvbi5zd2l0Y2hWYWx1ZV0sIGNhc2VzKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGV4cGFuc2lvbiB0eXBlIFwiJHtleHBhbnNpb24udHlwZX1cImApO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGV4cGFuc2lvbkNhc2U6IGh0bWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gYCAke2V4cGFuc2lvbkNhc2UudmFsdWV9IHske3RoaXMuc2VyaWFsaXplTm9kZXMoZXhwYW5zaW9uQ2FzZS5leHByZXNzaW9uKX19YDtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplTm9kZXMobm9kZXM6IGh0bWwuTm9kZVtdLCBqb2luID0gXCJcIik6IHN0cmluZyB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHJldHVybiBqb2luICsgbm9kZXMubWFwKGEgPT4gYS52aXNpdCh0aGlzLCBudWxsKSkuam9pbihqb2luKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplTm9kZXMobm9kZXM6IGh0bWwuTm9kZVtdLCBsb2NhbGU6IHN0cmluZywgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIG5vZGVzLm1hcChub2RlID0+IG5vZGUudmlzaXQobmV3IFNlcmlhbGl6ZXJWaXNpdG9yKGxvY2FsZSwgcGFyYW1zKSwgbnVsbCkpO1xufVxuXG5leHBvcnQgY2xhc3MgSHRtbFRvWG1sUGFyc2VyIGltcGxlbWVudHMgaHRtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBlcnJvcnM6IEkxOG5FcnJvcltdO1xuICBwcml2YXRlIHhtbE1lc3NhZ2VzQnlJZDoge1tpZDogc3RyaW5nXTogeG1sLk5vZGV9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgTUVTU0FHRV9UQUc6IHN0cmluZykge31cblxuICBwYXJzZShjb250ZW50OiBzdHJpbmcpIHtcbiAgICB0aGlzLnhtbE1lc3NhZ2VzQnlJZCA9IHt9O1xuXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcihnZXRYbWxUYWdEZWZpbml0aW9uKS5wYXJzZShjb250ZW50LCBcIlwiLCBmYWxzZSk7XG5cbiAgICB0aGlzLmVycm9ycyA9IHBhcnNlci5lcnJvcnM7XG4gICAgaHRtbC52aXNpdEFsbCh0aGlzLCBwYXJzZXIucm9vdE5vZGVzLCBudWxsKTtcblxuICAgIHJldHVybiB7XG4gICAgICB4bWxNZXNzYWdlc0J5SWQ6IHRoaXMueG1sTWVzc2FnZXNCeUlkLFxuICAgICAgZXJyb3JzOiB0aGlzLmVycm9yc1xuICAgIH07XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogaHRtbC5FbGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHN3aXRjaCAoZWxlbWVudC5uYW1lKSB7XG4gICAgICBjYXNlIHRoaXMuTUVTU0FHRV9UQUc6XG4gICAgICAgIGNvbnN0IGlkID0gZWxlbWVudC5hdHRycy5maW5kKGF0dHIgPT4gYXR0ci5uYW1lID09PSBcImlkXCIpO1xuICAgICAgICBpZiAoaWQpIHtcbiAgICAgICAgICB0aGlzLnhtbE1lc3NhZ2VzQnlJZFtpZC52YWx1ZV0gPSAoZWxlbWVudCBhcyBhbnkpIGFzIHhtbC5Ob2RlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaHRtbC52aXNpdEFsbCh0aGlzLCBlbGVtZW50LmNoaWxkcmVuLCBudWxsKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdEF0dHJpYnV0ZShhdHRyaWJ1dGU6IGh0bWwuQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdFRleHQodGV4dDogaHRtbC5UZXh0LCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogaHRtbC5Db21tZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IGh0bWwuRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge31cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogaHRtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkge31cbn1cbiJdfQ==