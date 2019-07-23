"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const html = require("../ast/ast");
const i18n = require("../ast/i18n_ast");
const html_tags_1 = require("../ast/html_tags");
const common_1 = require("@angular/common");
const parser_1 = require("../ast/parser");
const xml_tags_1 = require("../ast/xml_tags");
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
class SimplePlaceholderMapper extends i18n.RecurseVisitor {
    // create a mapping from the message
    constructor(message, mapName) {
        super();
        this.mapName = mapName;
        this.internalToPublic = {};
        this.publicToNextId = {};
        this.publicToInternal = {};
        message.nodes.forEach(node => node.visit(this));
    }
    toPublicName(internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ? this.internalToPublic[internalName] : null;
    }
    toInternalName(publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] : null;
    }
    visitText(text, context) {
        return null;
    }
    visitTagPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.startName);
        super.visitTagPlaceholder(ph, context);
        this.visitPlaceholderName(ph.closeName);
    }
    visitPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    visitIcuPlaceholder(ph, context) {
        this.visitPlaceholderName(ph.name);
    }
    // XMB placeholders could only contains A-Z, 0-9 and _
    visitPlaceholderName(internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        let publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            const nextId = this.publicToNextId[publicName];
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
exports.SimplePlaceholderMapper = SimplePlaceholderMapper;
const i18nSelectPipe = new common_1.I18nSelectPipe();
class SerializerVisitor {
    constructor(locale, params) {
        this.params = params;
        this.i18nPluralPipe = new common_1.I18nPluralPipe(new common_1.NgLocaleLocalization(locale));
    }
    visitElement(element, context) {
        if (html_tags_1.getHtmlTagDefinition(element.name).isVoid) {
            return `<${element.name}${this.serializeNodes(element.attrs, " ")}/>`;
        }
        return `<${element.name}${this.serializeNodes(element.attrs, " ")}>${this.serializeNodes(element.children)}</${element.name}>`;
    }
    visitAttribute(attribute, context) {
        return `${attribute.name}="${attribute.value}"`;
    }
    visitText(text, context) {
        return text.value;
    }
    visitComment(comment, context) {
        return `<!--${comment.value}-->`;
    }
    visitExpansion(expansion, context) {
        const cases = {};
        expansion.cases.forEach(c => (cases[c.value] = this.serializeNodes(c.expression)));
        switch (expansion.type) {
            case "select":
                return i18nSelectPipe.transform(this.params[expansion.switchValue] || "", cases);
            case "plural":
                return this.i18nPluralPipe.transform(this.params[expansion.switchValue], cases);
        }
        throw new Error(`Unknown expansion type "${expansion.type}"`);
    }
    visitExpansionCase(expansionCase, context) {
        return ` ${expansionCase.value} {${this.serializeNodes(expansionCase.expression)}}`;
    }
    serializeNodes(nodes, join = "") {
        if (nodes.length === 0) {
            return "";
        }
        return join + nodes.map(a => a.visit(this, null)).join(join);
    }
}
function serializeNodes(nodes, locale, params) {
    return nodes.map(node => node.visit(new SerializerVisitor(locale, params), null));
}
exports.serializeNodes = serializeNodes;
class HtmlToXmlParser {
    constructor(MESSAGE_TAG) {
        this.MESSAGE_TAG = MESSAGE_TAG;
    }
    parse(content) {
        this.xmlMessagesById = {};
        const parser = new parser_1.Parser(xml_tags_1.getXmlTagDefinition).parse(content, "", false);
        this.errors = parser.errors;
        html.visitAll(this, parser.rootNodes, null);
        return {
            xmlMessagesById: this.xmlMessagesById,
            errors: this.errors
        };
    }
    visitElement(element, context) {
        switch (element.name) {
            case this.MESSAGE_TAG:
                const id = element.attrs.find(attr => attr.name === "id");
                if (id) {
                    this.xmlMessagesById[id.value] = element;
                }
                break;
            default:
                html.visitAll(this, element.children, null);
        }
    }
    visitAttribute(attribute, context) { }
    visitText(text, context) { }
    visitComment(comment, context) { }
    visitExpansion(expansion, context) { }
    visitExpansionCase(expansionCase, context) { }
}
exports.HtmlToXmlParser = HtmlToXmlParser;
//# sourceMappingURL=serializer.js.map