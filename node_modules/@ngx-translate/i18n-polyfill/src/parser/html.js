"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const html = require("../ast/ast");
const i18n = require("../ast/i18n_ast");
const parse_util_1 = require("../ast/parse_util");
const interpolation_config_1 = require("../ast/interpolation_config");
const i18n_1 = require("./i18n");
const parser_1 = require("../ast/parser");
const html_tags_1 = require("../ast/html_tags");
const core_1 = require("@angular/core");
const _I18N_ATTR = "i18n";
class HtmlParser extends parser_1.Parser {
    constructor(interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG) {
        super(html_tags_1.getHtmlTagDefinition);
        this.interpolationConfig = interpolationConfig;
    }
    parse(source, url, parseExpansionForms = false) {
        return super.parse(source, url, parseExpansionForms, this.interpolationConfig);
    }
    /**
     * Extract translatable messages from an html AST
     */
    extractMessages(nodes) {
        const visitor = new Visitor(["wrapper"]);
        // Construct a single fake root element
        const wrapper = new html.Element("wrapper", [], nodes, undefined, undefined, undefined);
        return visitor.extract(wrapper, this.interpolationConfig);
    }
    mergeTranslations(nodes, translations, params, metadata, implicitTags = []) {
        const visitor = new Visitor(implicitTags);
        // Construct a single fake root element
        const wrapper = new html.Element("wrapper", [], nodes, undefined, undefined, undefined);
        return visitor.merge(wrapper, translations, this.interpolationConfig, params, metadata);
    }
}
exports.HtmlParser = HtmlParser;
class ExtractionResult {
    constructor(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
}
exports.ExtractionResult = ExtractionResult;
/**
 * A container for translated messages
 */
class TranslationBundle {
    constructor(i18nNodesByMsgId = {}, digest, interpolationConfig, missingTranslationStrategy, mapperFactory, console) {
        this.i18nNodesByMsgId = i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this.i18nToHtml = new I18nToHtmlVisitor(i18nNodesByMsgId, digest, mapperFactory, missingTranslationStrategy, interpolationConfig, console);
    }
    // Creates a `TranslationBundle` by parsing the given `content` with the `serializer`.
    static load(content, url, digest, createNameMapper, loadFct, missingTranslationStrategy, interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG) {
        const i18nNodesByMsgId = loadFct(content, url);
        const digestFn = (m) => digest(m);
        const mapperFactory = (m) => createNameMapper(m);
        return new TranslationBundle(i18nNodesByMsgId, digestFn, interpolationConfig, missingTranslationStrategy, mapperFactory, console);
    }
    // Returns the translation as HTML nodes from the given source message.
    get(srcMsg, params) {
        const htmlRes = this.i18nToHtml.convert(srcMsg, params);
        if (htmlRes.errors.length) {
            throw new Error(htmlRes.errors.join("\n"));
        }
        return htmlRes.nodes;
    }
    has(srcMsg) {
        return this.digest(srcMsg) in this.i18nNodesByMsgId;
    }
}
exports.TranslationBundle = TranslationBundle;
class I18nToHtmlVisitor {
    constructor(_i18nNodesByMsgId = {}, _digest, _mapperFactory, _missingTranslationStrategy, _interpolationConfig, _console) {
        this._i18nNodesByMsgId = _i18nNodesByMsgId;
        this._digest = _digest;
        this._mapperFactory = _mapperFactory;
        this._missingTranslationStrategy = _missingTranslationStrategy;
        this._interpolationConfig = _interpolationConfig;
        this._console = _console;
        this._contextStack = [];
        this._errors = [];
    }
    convert(srcMsg, params) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        this._params = params;
        this._paramKeys = Object.keys(params);
        // i18n to text
        const text = this.convertToText(srcMsg);
        // text to html
        const url = srcMsg.nodes[0].sourceSpan.start.file.url;
        const htmlParser = new HtmlParser().parse(text, url, true);
        return {
            nodes: htmlParser.rootNodes,
            errors: [...this._errors, ...htmlParser.errors]
        };
    }
    visitText(text, context) {
        return text.value;
    }
    visitContainer(container, context) {
        return container.children.map(n => n.visit(this)).join("");
    }
    visitIcu(icu, context) {
        const cases = Object.keys(icu.cases).map(k => `${k} {${icu.cases[k].visit(this)}}`);
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        const exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression)
            ? this._srcMsg.placeholders[icu.expression]
            : icu.expression;
        return `{${exp}, ${icu.type}, ${cases.join(" ")}}`;
    }
    visitPlaceholder(ph, context) {
        const phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this.convertToValue(this._srcMsg.placeholders[phName]);
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this.convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, `Unknown placeholder "${ph.name}"`);
        return "";
    }
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    visitTagPlaceholder(ph, context) {
        const tag = `${ph.tag}`;
        const attrs = Object.keys(ph.attrs)
            .map(name => `${name}="${ph.attrs[name]}"`)
            .join(" ");
        if (ph.isVoid) {
            return `<${tag} ${attrs}/>`;
        }
        const children = ph.children.map((c) => c.visit(this)).join("");
        return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    visitIcuPlaceholder(ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this.convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    }
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     */
    convertToText(srcMsg) {
        const id = this._digest(srcMsg);
        const mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        let nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = (name) => (mapper ? mapper.toInternalName(name) : name);
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === core_1.MissingTranslationStrategy.Error) {
                this._addError(srcMsg.nodes[0], `Missing translation for message "${id}"`);
            }
            else if (this._console && this._missingTranslationStrategy === core_1.MissingTranslationStrategy.Warning) {
                this._console.warn(`Missing translation for message "${id}"`);
            }
            nodes = srcMsg.nodes;
            this._mapper = (name) => name;
        }
        const text = nodes.map(node => node.visit(this)).join("");
        const context = this._contextStack.pop();
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    }
    convertToValue(placeholder) {
        const param = placeholder.replace(this._interpolationConfig.start, "").replace(this._interpolationConfig.end, "");
        return this._paramKeys.indexOf(param) !== -1 ? this._params[param] : placeholder;
    }
    _addError(el, msg) {
        this._errors.push(new parse_util_1.I18nError(el.sourceSpan, msg));
    }
}
var VisitorMode;
(function (VisitorMode) {
    VisitorMode[VisitorMode["Extract"] = 0] = "Extract";
    VisitorMode[VisitorMode["Merge"] = 1] = "Merge";
})(VisitorMode || (VisitorMode = {}));
/**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * @internal
 */
class Visitor {
    constructor(_implicitTags = []) {
        this._implicitTags = _implicitTags;
        this.blockChildren = [];
    }
    /**
     * Extracts the messages from the tree
     */
    extract(node, interpolationConfig) {
        this.init(VisitorMode.Extract, interpolationConfig);
        node.visit(this, null);
        if (this.inI18nBlock) {
            this._reportError(node, "Unclosed block");
        }
        return new ExtractionResult(this.messages, this.errors);
    }
    /**
     * Returns a tree where all translatable nodes are translated
     */
    merge(node, translations, interpolationConfig, params, metadata = {}) {
        this.init(VisitorMode.Merge, interpolationConfig, params);
        this.translations = translations;
        this.metadata = metadata;
        const translatedNode = node.visit(this, null);
        if (this.inI18nBlock) {
            this._reportError(node, "Unclosed block");
        }
        return new parser_1.ParseTreeResult(translatedNode.children, this.errors);
    }
    visitExpansionCase(icuCase, context) {
        // Parse cases for translatable html attributes
        const expression = html.visitAll(this, icuCase.expression, context);
        if (this.mode === VisitorMode.Merge) {
            return new html.ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    }
    visitExpansion(icu, context) {
        this.mayBeAddBlockChildren(icu);
        const wasInIcu = this.inIcu;
        if (!this.inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this.isInTranslatableSection) {
                this.addMessage([icu]);
            }
            this.inIcu = true;
        }
        const cases = html.visitAll(this, icu.cases, context);
        if (this.mode === VisitorMode.Merge) {
            icu = new html.Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this.inIcu = wasInIcu;
        return icu;
    }
    visitComment(comment, context) {
        return;
    }
    visitText(text, context) {
        if (this.isInTranslatableSection) {
            this.mayBeAddBlockChildren(text);
        }
        return text;
    }
    visitElement(el, context) {
        this.mayBeAddBlockChildren(el);
        this.depth++;
        const wasInI18nNode = this.inI18nNode;
        const wasInImplicitNode = this.inImplicitNode;
        let childNodes = [];
        let translatedChildNodes = undefined;
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        const i18nAttr = getI18nAttr(el);
        const isImplicit = this._implicitTags.some(tag => el.name === tag) && !this.inIcu && !this.isInTranslatableSection;
        const isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this.inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this.isInTranslatableSection && !this.inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this.inI18nNode = true;
                const message = this.addMessage(el.children, this.metadata);
                translatedChildNodes = this.translateMessage(el, message);
            }
            if (this.mode === VisitorMode.Extract) {
                const isTranslatable = i18nAttr || isTopLevelImplicit;
                if (isTranslatable) {
                    this.openTranslatableSection(el);
                }
                html.visitAll(this, el.children);
                if (isTranslatable) {
                    this._closeTranslatableSection(el, el.children);
                }
            }
        }
        else {
            if (i18nAttr || isTopLevelImplicit) {
                this._reportError(el, "Could not mark an element as translatable inside a translatable section");
            }
            if (this.mode === VisitorMode.Extract) {
                // Descend into child nodes for extraction
                html.visitAll(this, el.children);
            }
        }
        if (this.mode === VisitorMode.Merge) {
            const visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(child => {
                const visited = child.visit(this, context);
                if (visited && !this.isInTranslatableSection) {
                    // Do not add the children from translatable sections (= i18n blocks here)
                    // They will be added later in this loop when the block closes (i.e. on `<!-- /i18n -->`)
                    childNodes = childNodes.concat(visited);
                }
            });
        }
        this.depth--;
        this.inI18nNode = wasInI18nNode;
        this.inImplicitNode = wasInImplicitNode;
        if (this.mode === VisitorMode.Merge) {
            return new html.Element(el.name, [], childNodes, el.sourceSpan, el.startSourceSpan, el.endSourceSpan);
        }
        return null;
    }
    visitAttribute(attribute, context) {
        throw new Error("unreachable code");
    }
    init(mode, interpolationConfig, params = {}) {
        this.mode = mode;
        this.inI18nBlock = false;
        this.inI18nNode = false;
        this.depth = 0;
        this.inIcu = false;
        this.msgCountAtSectionStart = undefined;
        this.errors = [];
        this.messages = [];
        this.inImplicitNode = false;
        this.createI18nMessage = i18n_1.createI18nMessageFactory(interpolationConfig);
        this.params = params;
    }
    // add a translatable message
    addMessage(ast, { meaning = "", description = "", id = "" } = {}) {
        if (ast.length === 0 ||
            (ast.length === 1 && ast[0] instanceof html.Attribute && !ast[0].value)) {
            // Do not create empty messages
            return null;
        }
        const message = this.createI18nMessage(ast, meaning, description, id);
        this.messages.push(message);
        return message;
    }
    // Translates the given message given the `TranslationBundle`
    // This is used for translating elements / blocks - see `_translateAttributes` for attributes
    // no-op when called in extraction mode (returns [])
    translateMessage(el, message) {
        if (message && this.mode === VisitorMode.Merge) {
            const nodes = this.translations.get(message, this.params);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, `Translation unavailable for message id="${this.translations.digest(message)}"`);
        }
        return [];
    }
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     */
    mayBeAddBlockChildren(node) {
        if (this.inI18nBlock && !this.inIcu && this.depth === this.blockStartDepth) {
            this.blockChildren.push(node);
        }
    }
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     */
    openTranslatableSection(node) {
        if (this.isInTranslatableSection) {
            this._reportError(node, "Unexpected section start");
        }
        else {
            this.msgCountAtSectionStart = this.messages.length;
        }
    }
    /**
     * A translatable section could be:
     * - the content of translatable element,
     * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
     */
    get isInTranslatableSection() {
        return this.msgCountAtSectionStart !== void 0;
    }
    /**
     * Terminates a section.
     *
     * If a section has only one significant children (comments not significant) then we should not
     * keep the message from this children:
     *
     * `<p i18n="meaning|description">{ICU message}</p>` would produce two messages:
     * - one for the <p> content with meaning and description,
     * - another one for the ICU message.
     *
     * In this case the last message is discarded as it contains less information (the AST is
     * otherwise identical).
     *
     * Note that we should still keep messages extracted from attributes inside the section (ie in the
     * ICU message here)
     */
    _closeTranslatableSection(node, directChildren) {
        if (!this.isInTranslatableSection) {
            this._reportError(node, "Unexpected section end");
            return;
        }
        const startIndex = this.msgCountAtSectionStart;
        const significantChildren = directChildren.reduce((count, n) => count + (n instanceof html.Comment ? 0 : 1), 0);
        if (significantChildren === 1) {
            for (let i = this.messages.length - 1; i >= startIndex; i--) {
                const ast = this.messages[i].nodes;
                if (!(ast.length === 1 && ast[0] instanceof i18n.Text)) {
                    this.messages.splice(i, 1);
                    break;
                }
            }
        }
        this.msgCountAtSectionStart = undefined;
    }
    _reportError(node, msg) {
        this.errors.push(new parse_util_1.I18nError(node.sourceSpan, msg));
    }
}
function getI18nAttr(p) {
    return p.attrs.find(attr => attr.name === _I18N_ATTR) || null;
}
//# sourceMappingURL=html.js.map