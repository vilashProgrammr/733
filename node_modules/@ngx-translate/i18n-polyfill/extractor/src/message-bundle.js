"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n = require("../../src/ast/i18n_ast");
const html_1 = require("../../src/parser/html");
class MessageBundle {
    constructor(locale = null) {
        this.locale = locale;
        this.messages = [];
        this.htmlParser = new html_1.HtmlParser();
    }
    updateFromTemplate(template, url) {
        const str = typeof template === "string" ? template : template.value;
        const htmlParserResult = this.htmlParser.parse(str, url, true);
        if (htmlParserResult.errors.length) {
            throw htmlParserResult.errors;
        }
        const i18nParserResult = this.htmlParser.extractMessages(htmlParserResult.rootNodes);
        if (i18nParserResult.errors.length) {
            throw i18nParserResult.errors;
        }
        if (typeof template !== "string") {
            i18nParserResult.messages[0].id = template.id || "";
            i18nParserResult.messages[0].meaning = template.meaning || "";
            i18nParserResult.messages[0].description = template.description || "";
        }
        this.messages = this.messages.concat(i18nParserResult.messages);
        return this.messages;
    }
    // Return the message in the internal format
    // The public (serialized) format might be different, see the `write` method.
    getMessages() {
        return this.messages;
    }
    write(write, digest, xmlMessagesById, createMapper, filterSources) {
        const messages = {};
        const existingMessages = xmlMessagesById ? Object.keys(xmlMessagesById) : [];
        // Deduplicate messages based on their ID
        this.messages.forEach(message => {
            const id = digest(message);
            // todo merge sources somehow
            if (existingMessages.indexOf(id) === -1) {
                if (!messages.hasOwnProperty(id)) {
                    messages[id] = message;
                }
                else {
                    messages[id].sources.push(...message.sources);
                }
            }
        });
        // Transform placeholder names using the serializer mapping
        const msgList = Object.keys(messages).map(id => {
            const src = messages[id];
            const nodes = createMapper ? new MapPlaceholderNames().convert(src.nodes, createMapper(messages[id])) : src.nodes;
            const transformedMessage = new i18n.Message(nodes, {}, {}, src.meaning, src.description, id);
            transformedMessage.sources = src.sources;
            if (filterSources) {
                transformedMessage.sources.forEach((source) => (source.filePath = filterSources(source.filePath)));
            }
            return transformedMessage;
        });
        return write(msgList, this.locale, existingMessages.map(id => xmlMessagesById[id]));
    }
}
exports.MessageBundle = MessageBundle;
// Transform an i18n AST by renaming the placeholder nodes with the given mapper
class MapPlaceholderNames extends i18n.CloneVisitor {
    convert(nodes, mapper) {
        return mapper ? nodes.map(n => n.visit(this, mapper)) : nodes;
    }
    visitTagPlaceholder(ph, mapper) {
        const startName = mapper.toPublicName(ph.startName);
        const closeName = ph.closeName ? mapper.toPublicName(ph.closeName) : ph.closeName;
        const children = ph.children.map(n => n.visit(this, mapper));
        return new i18n.TagPlaceholder(ph.tag, ph.attrs, startName, closeName, children, ph.isVoid, ph.sourceSpan);
    }
    visitPlaceholder(ph, mapper) {
        return new i18n.Placeholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
    }
    visitIcuPlaceholder(ph, mapper) {
        return new i18n.IcuPlaceholder(ph.value, mapper.toPublicName(ph.name), ph.sourceSpan);
    }
}
//# sourceMappingURL=message-bundle.js.map