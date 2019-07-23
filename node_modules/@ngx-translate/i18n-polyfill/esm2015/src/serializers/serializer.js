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
export class SimplePlaceholderMapper extends i18n.RecurseVisitor {
    /**
     * @param {?} message
     * @param {?} mapName
     */
    constructor(message, mapName) {
        super();
        this.mapName = mapName;
        this.internalToPublic = {};
        this.publicToNextId = {};
        this.publicToInternal = {};
        message.nodes.forEach(node => node.visit(this));
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    toPublicName(internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ? this.internalToPublic[internalName] : null;
    }
    /**
     * @param {?} publicName
     * @return {?}
     */
    toInternalName(publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] : null;
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) {
        return null;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.startName);
        super.visitTagPlaceholder(ph, context);
        this.visitPlaceholderName(ph.closeName);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    /**
     * @param {?} internalName
     * @return {?}
     */
    visitPlaceholderName(internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        let /** @type {?} */ publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            const /** @type {?} */ nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = `${publicName}_${nextId}`;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    }
}
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
const /** @type {?} */ i18nSelectPipe = new I18nSelectPipe();
class SerializerVisitor {
    /**
     * @param {?} locale
     * @param {?} params
     */
    constructor(locale, params) {
        this.params = params;
        this.i18nPluralPipe = new I18nPluralPipe(new NgLocaleLocalization(locale));
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        if (getHtmlTagDefinition(element.name).isVoid) {
            return `<${element.name}${this.serializeNodes(element.attrs, " ")}/>`;
        }
        return `<${element.name}${this.serializeNodes(element.attrs, " ")}>${this.serializeNodes(element.children)}</${element.name}>`;
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        return `${attribute.name}="${attribute.value}"`;
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        return text.value;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) {
        return `<!--${comment.value}-->`;
    }
    /**
     * @param {?} expansion
     * @param {?} context
     * @return {?}
     */
    visitExpansion(expansion, context) {
        const /** @type {?} */ cases = {};
        expansion.cases.forEach(c => (cases[c.value] = this.serializeNodes(c.expression)));
        switch (expansion.type) {
            case "select":
                return i18nSelectPipe.transform(this.params[expansion.switchValue] || "", cases);
            case "plural":
                return this.i18nPluralPipe.transform(this.params[expansion.switchValue], cases);
        }
        throw new Error(`Unknown expansion type "${expansion.type}"`);
    }
    /**
     * @param {?} expansionCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(expansionCase, context) {
        return ` ${expansionCase.value} {${this.serializeNodes(expansionCase.expression)}}`;
    }
    /**
     * @param {?} nodes
     * @param {?=} join
     * @return {?}
     */
    serializeNodes(nodes, join = "") {
        if (nodes.length === 0) {
            return "";
        }
        return join + nodes.map(a => a.visit(this, null)).join(join);
    }
}
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
    return nodes.map(node => node.visit(new SerializerVisitor(locale, params), null));
}
export class HtmlToXmlParser {
    /**
     * @param {?} MESSAGE_TAG
     */
    constructor(MESSAGE_TAG) {
        this.MESSAGE_TAG = MESSAGE_TAG;
    }
    /**
     * @param {?} content
     * @return {?}
     */
    parse(content) {
        this.xmlMessagesById = {};
        const /** @type {?} */ parser = new Parser(getXmlTagDefinition).parse(content, "", false);
        this.errors = parser.errors;
        html.visitAll(this, parser.rootNodes, null);
        return {
            xmlMessagesById: this.xmlMessagesById,
            errors: this.errors
        };
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    visitElement(element, context) {
        switch (element.name) {
            case this.MESSAGE_TAG:
                const /** @type {?} */ id = element.attrs.find(attr => attr.name === "id");
                if (id) {
                    this.xmlMessagesById[id.value] = /** @type {?} */ ((/** @type {?} */ (element)));
                }
                break;
            default:
                html.visitAll(this, element.children, null);
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
}
function HtmlToXmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlToXmlParser.prototype.errors;
    /** @type {?} */
    HtmlToXmlParser.prototype.xmlMessagesById;
    /** @type {?} */
    HtmlToXmlParser.prototype.MESSAGE_TAG;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvc2VyaWFsaXplcnMvc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxJQUFJLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDdEQsT0FBTyxFQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNyRixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q3BELE1BQU0sOEJBQStCLFNBQVEsSUFBSSxDQUFDLGNBQWM7Ozs7O0lBTTlELFlBQVksT0FBcUIsRUFBVSxPQUFpQztRQUMxRSxLQUFLLEVBQUUsQ0FBQztRQURpQyxZQUFPLEdBQVAsT0FBTyxDQUEwQjtnQ0FMMUIsRUFBRTs4QkFDSixFQUFFO2dDQUNBLEVBQUU7UUFLbEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDakQ7Ozs7O0lBRUQsWUFBWSxDQUFDLFlBQW9CO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FB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bGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgaHRtbCBmcm9tIFwiLi4vYXN0L2FzdFwiO1xuaW1wb3J0ICogYXMgaTE4biBmcm9tIFwiLi4vYXN0L2kxOG5fYXN0XCI7XG5pbXBvcnQge2dldEh0bWxUYWdEZWZpbml0aW9ufSBmcm9tIFwiLi4vYXN0L2h0bWxfdGFnc1wiO1xuaW1wb3J0IHtJMThuUGx1cmFsUGlwZSwgSTE4blNlbGVjdFBpcGUsIE5nTG9jYWxlTG9jYWxpemF0aW9ufSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQge1BhcnNlcn0gZnJvbSBcIi4uL2FzdC9wYXJzZXJcIjtcbmltcG9ydCB7Z2V0WG1sVGFnRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2FzdC94bWxfdGFnc1wiO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gXCIuLi9hc3QvcGFyc2VfdXRpbFwiO1xuaW1wb3J0ICogYXMgeG1sIGZyb20gXCIuL3htbF9oZWxwZXJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJMThuTWVzc2FnZXNCeUlkIHtcbiAgW21zZ0lkOiBzdHJpbmddOiBpMThuLk5vZGVbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBYbWxNZXNzYWdlc0J5SWQge1xuICBbaWQ6IHN0cmluZ106IHhtbC5Ob2RlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEljdUNvbnRlbnQge1xuICBjYXNlczoge1t2YWx1ZTogc3RyaW5nXTogaHRtbC5Ob2RlW119O1xuICBleHByZXNzaW9uOiBzdHJpbmc7XG4gIHR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJY3VDb250ZW50U3RyIHtcbiAgY2FzZXM6IHtbdmFsdWU6IHN0cmluZ106IHN0cmluZ307XG4gIGV4cHJlc3Npb246IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgYFBsYWNlaG9sZGVyTWFwcGVyYCBjb252ZXJ0cyBwbGFjZWhvbGRlciBuYW1lcyBmcm9tIGludGVybmFsIHRvIHNlcmlhbGl6ZWQgcmVwcmVzZW50YXRpb24gYW5kXG4gKiBiYWNrLlxuICpcbiAqIEl0IHNob3VsZCBiZSB1c2VkIGZvciBzZXJpYWxpemF0aW9uIGZvcm1hdCB0aGF0IHB1dCBjb25zdHJhaW50cyBvbiB0aGUgcGxhY2Vob2xkZXIgbmFtZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUGxhY2Vob2xkZXJNYXBwZXIge1xuICB0b1B1YmxpY05hbWUoaW50ZXJuYWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcgfCBudWxsO1xuXG4gIHRvSW50ZXJuYWxOYW1lKHB1YmxpY05hbWU6IHN0cmluZyk6IHN0cmluZyB8IG51bGw7XG59XG5cbi8qKlxuICogQSBzaW1wbGUgbWFwcGVyIHRoYXQgdGFrZSBhIGZ1bmN0aW9uIHRvIHRyYW5zZm9ybSBhbiBpbnRlcm5hbCBuYW1lIHRvIGEgcHVibGljIG5hbWVcbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZVBsYWNlaG9sZGVyTWFwcGVyIGV4dGVuZHMgaTE4bi5SZWN1cnNlVmlzaXRvciBpbXBsZW1lbnRzIFBsYWNlaG9sZGVyTWFwcGVyIHtcbiAgcHJpdmF0ZSBpbnRlcm5hbFRvUHVibGljOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgcHJpdmF0ZSBwdWJsaWNUb05leHRJZDoge1trOiBzdHJpbmddOiBudW1iZXJ9ID0ge307XG4gIHByaXZhdGUgcHVibGljVG9JbnRlcm5hbDoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgLy8gY3JlYXRlIGEgbWFwcGluZyBmcm9tIHRoZSBtZXNzYWdlXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSwgcHJpdmF0ZSBtYXBOYW1lOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuICAgIG1lc3NhZ2Uubm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdG9QdWJsaWNOYW1lKGludGVybmFsTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxUb1B1YmxpYy5oYXNPd25Qcm9wZXJ0eShpbnRlcm5hbE5hbWUpID8gdGhpcy5pbnRlcm5hbFRvUHVibGljW2ludGVybmFsTmFtZV0gOiBudWxsO1xuICB9XG5cbiAgdG9JbnRlcm5hbE5hbWUocHVibGljTmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucHVibGljVG9JbnRlcm5hbC5oYXNPd25Qcm9wZXJ0eShwdWJsaWNOYW1lKSA/IHRoaXMucHVibGljVG9JbnRlcm5hbFtwdWJsaWNOYW1lXSA6IG51bGw7XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogaTE4bi5UZXh0LCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0VGFnUGxhY2Vob2xkZXIocGg6IGkxOG4uVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHRoaXMudmlzaXRQbGFjZWhvbGRlck5hbWUocGguc3RhcnROYW1lKTtcbiAgICBzdXBlci52aXNpdFRhZ1BsYWNlaG9sZGVyKHBoLCBjb250ZXh0KTtcbiAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXJOYW1lKHBoLmNsb3NlTmFtZSk7XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBpMThuLlBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICB0aGlzLnZpc2l0UGxhY2Vob2xkZXJOYW1lKHBoLm5hbWUpO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgdGhpcy52aXNpdFBsYWNlaG9sZGVyTmFtZShwaC5uYW1lKTtcbiAgfVxuXG4gIC8vIFhNQiBwbGFjZWhvbGRlcnMgY291bGQgb25seSBjb250YWlucyBBLVosIDAtOSBhbmQgX1xuICBwcml2YXRlIHZpc2l0UGxhY2Vob2xkZXJOYW1lKGludGVybmFsTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFpbnRlcm5hbE5hbWUgfHwgdGhpcy5pbnRlcm5hbFRvUHVibGljLmhhc093blByb3BlcnR5KGludGVybmFsTmFtZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgcHVibGljTmFtZSA9IHRoaXMubWFwTmFtZShpbnRlcm5hbE5hbWUpO1xuXG4gICAgaWYgKHRoaXMucHVibGljVG9JbnRlcm5hbC5oYXNPd25Qcm9wZXJ0eShwdWJsaWNOYW1lKSkge1xuICAgICAgLy8gQ3JlYXRlIGEgbmV3IFhNQiB3aGVuIGl0IGhhcyBhbHJlYWR5IGJlZW4gdXNlZFxuICAgICAgY29uc3QgbmV4dElkID0gdGhpcy5wdWJsaWNUb05leHRJZFtwdWJsaWNOYW1lXTtcbiAgICAgIHRoaXMucHVibGljVG9OZXh0SWRbcHVibGljTmFtZV0gPSBuZXh0SWQgKyAxO1xuICAgICAgcHVibGljTmFtZSA9IGAke3B1YmxpY05hbWV9XyR7bmV4dElkfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVibGljVG9OZXh0SWRbcHVibGljTmFtZV0gPSAxO1xuICAgIH1cblxuICAgIHRoaXMuaW50ZXJuYWxUb1B1YmxpY1tpbnRlcm5hbE5hbWVdID0gcHVibGljTmFtZTtcbiAgICB0aGlzLnB1YmxpY1RvSW50ZXJuYWxbcHVibGljTmFtZV0gPSBpbnRlcm5hbE5hbWU7XG4gIH1cbn1cblxuY29uc3QgaTE4blNlbGVjdFBpcGUgPSBuZXcgSTE4blNlbGVjdFBpcGUoKTtcbmNsYXNzIFNlcmlhbGl6ZXJWaXNpdG9yIGltcGxlbWVudHMgaHRtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBpMThuUGx1cmFsUGlwZTogSTE4blBsdXJhbFBpcGU7XG4gIGNvbnN0cnVjdG9yKGxvY2FsZTogc3RyaW5nLCBwcml2YXRlIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pIHtcbiAgICB0aGlzLmkxOG5QbHVyYWxQaXBlID0gbmV3IEkxOG5QbHVyYWxQaXBlKG5ldyBOZ0xvY2FsZUxvY2FsaXphdGlvbihsb2NhbGUpKTtcbiAgfVxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogaHRtbC5FbGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGlmIChnZXRIdG1sVGFnRGVmaW5pdGlvbihlbGVtZW50Lm5hbWUpLmlzVm9pZCkge1xuICAgICAgcmV0dXJuIGA8JHtlbGVtZW50Lm5hbWV9JHt0aGlzLnNlcmlhbGl6ZU5vZGVzKGVsZW1lbnQuYXR0cnMsIFwiIFwiKX0vPmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGA8JHtlbGVtZW50Lm5hbWV9JHt0aGlzLnNlcmlhbGl6ZU5vZGVzKGVsZW1lbnQuYXR0cnMsIFwiIFwiKX0+JHt0aGlzLnNlcmlhbGl6ZU5vZGVzKGVsZW1lbnQuY2hpbGRyZW4pfTwvJHtcbiAgICAgIGVsZW1lbnQubmFtZVxuICAgIH0+YDtcbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogaHRtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGAke2F0dHJpYnV0ZS5uYW1lfT1cIiR7YXR0cmlidXRlLnZhbHVlfVwiYDtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiBodG1sLlRleHQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRleHQudmFsdWU7XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogaHRtbC5Db21tZW50LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBgPCEtLSR7Y29tbWVudC52YWx1ZX0tLT5gO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBjb25zdCBjYXNlcyA9IHt9O1xuICAgIGV4cGFuc2lvbi5jYXNlcy5mb3JFYWNoKGMgPT4gKGNhc2VzW2MudmFsdWVdID0gdGhpcy5zZXJpYWxpemVOb2RlcyhjLmV4cHJlc3Npb24pKSk7XG5cbiAgICBzd2l0Y2ggKGV4cGFuc2lvbi50eXBlKSB7XG4gICAgICBjYXNlIFwic2VsZWN0XCI6XG4gICAgICAgIHJldHVybiBpMThuU2VsZWN0UGlwZS50cmFuc2Zvcm0odGhpcy5wYXJhbXNbZXhwYW5zaW9uLnN3aXRjaFZhbHVlXSB8fCBcIlwiLCBjYXNlcyk7XG4gICAgICBjYXNlIFwicGx1cmFsXCI6XG4gICAgICAgIHJldHVybiB0aGlzLmkxOG5QbHVyYWxQaXBlLnRyYW5zZm9ybSh0aGlzLnBhcmFtc1tleHBhbnNpb24uc3dpdGNoVmFsdWVdLCBjYXNlcyk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBleHBhbnNpb24gdHlwZSBcIiR7ZXhwYW5zaW9uLnR5cGV9XCJgKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBodG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGAgJHtleHBhbnNpb25DYXNlLnZhbHVlfSB7JHt0aGlzLnNlcmlhbGl6ZU5vZGVzKGV4cGFuc2lvbkNhc2UuZXhwcmVzc2lvbil9fWA7XG4gIH1cblxuICBwcml2YXRlIHNlcmlhbGl6ZU5vZGVzKG5vZGVzOiBodG1sLk5vZGVbXSwgam9pbiA9IFwiXCIpOiBzdHJpbmcge1xuICAgIGlmIChub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gam9pbiArIG5vZGVzLm1hcChhID0+IGEudmlzaXQodGhpcywgbnVsbCkpLmpvaW4oam9pbik7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU5vZGVzKG5vZGVzOiBodG1sLk5vZGVbXSwgbG9jYWxlOiBzdHJpbmcsIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBub2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KG5ldyBTZXJpYWxpemVyVmlzaXRvcihsb2NhbGUsIHBhcmFtcyksIG51bGwpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxUb1htbFBhcnNlciBpbXBsZW1lbnRzIGh0bWwuVmlzaXRvciB7XG4gIHByaXZhdGUgZXJyb3JzOiBJMThuRXJyb3JbXTtcbiAgcHJpdmF0ZSB4bWxNZXNzYWdlc0J5SWQ6IHtbaWQ6IHN0cmluZ106IHhtbC5Ob2RlfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIE1FU1NBR0VfVEFHOiBzdHJpbmcpIHt9XG5cbiAgcGFyc2UoY29udGVudDogc3RyaW5nKSB7XG4gICAgdGhpcy54bWxNZXNzYWdlc0J5SWQgPSB7fTtcblxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoZ2V0WG1sVGFnRGVmaW5pdGlvbikucGFyc2UoY29udGVudCwgXCJcIiwgZmFsc2UpO1xuXG4gICAgdGhpcy5lcnJvcnMgPSBwYXJzZXIuZXJyb3JzO1xuICAgIGh0bWwudmlzaXRBbGwodGhpcywgcGFyc2VyLnJvb3ROb2RlcywgbnVsbCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeG1sTWVzc2FnZXNCeUlkOiB0aGlzLnhtbE1lc3NhZ2VzQnlJZCxcbiAgICAgIGVycm9yczogdGhpcy5lcnJvcnNcbiAgICB9O1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsZW1lbnQ6IGh0bWwuRWxlbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBzd2l0Y2ggKGVsZW1lbnQubmFtZSkge1xuICAgICAgY2FzZSB0aGlzLk1FU1NBR0VfVEFHOlxuICAgICAgICBjb25zdCBpZCA9IGVsZW1lbnQuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJpZFwiKTtcbiAgICAgICAgaWYgKGlkKSB7XG4gICAgICAgICAgdGhpcy54bWxNZXNzYWdlc0J5SWRbaWQudmFsdWVdID0gKGVsZW1lbnQgYXMgYW55KSBhcyB4bWwuTm9kZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGh0bWwudmlzaXRBbGwodGhpcywgZWxlbWVudC5jaGlsZHJlbiwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGh0bWwuVGV4dCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IGh0bWwuQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRFeHBhbnNpb24oZXhwYW5zaW9uOiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55IHt9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGV4cGFuc2lvbkNhc2U6IGh0bWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55IHt9XG59XG4iXX0=