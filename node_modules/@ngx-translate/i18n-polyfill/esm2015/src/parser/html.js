/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as html from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import { I18nError } from "../ast/parse_util";
import { DEFAULT_INTERPOLATION_CONFIG } from "../ast/interpolation_config";
import { createI18nMessageFactory } from "./i18n";
import { Parser, ParseTreeResult } from "../ast/parser";
import { getHtmlTagDefinition } from "../ast/html_tags";
import { MissingTranslationStrategy } from "@angular/core";
const /** @type {?} */ _I18N_ATTR = "i18n";
/**
 * @record
 */
export function MessageMetadata() { }
function MessageMetadata_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    MessageMetadata.prototype.meaning;
    /** @type {?|undefined} */
    MessageMetadata.prototype.description;
    /** @type {?|undefined} */
    MessageMetadata.prototype.id;
}
export class HtmlParser extends Parser {
    /**
     * @param {?=} interpolationConfig
     */
    constructor(interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        super(getHtmlTagDefinition);
        this.interpolationConfig = interpolationConfig;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    parse(source, url, parseExpansionForms = false) {
        return super.parse(source, url, parseExpansionForms, this.interpolationConfig);
    }
    /**
     * Extract translatable messages from an html AST
     * @param {?} nodes
     * @return {?}
     */
    extractMessages(nodes) {
        const /** @type {?} */ visitor = new Visitor(["wrapper"]);
        // Construct a single fake root element
        const /** @type {?} */ wrapper = new html.Element("wrapper", [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        return visitor.extract(wrapper, this.interpolationConfig);
    }
    /**
     * @param {?} nodes
     * @param {?} translations
     * @param {?} params
     * @param {?=} metadata
     * @param {?=} implicitTags
     * @return {?}
     */
    mergeTranslations(nodes, translations, params, metadata, implicitTags = []) {
        const /** @type {?} */ visitor = new Visitor(implicitTags);
        // Construct a single fake root element
        const /** @type {?} */ wrapper = new html.Element("wrapper", [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        return visitor.merge(wrapper, translations, this.interpolationConfig, params, metadata);
    }
}
function HtmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlParser.prototype.interpolationConfig;
}
export class ExtractionResult {
    /**
     * @param {?} messages
     * @param {?} errors
     */
    constructor(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
}
function ExtractionResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ExtractionResult.prototype.messages;
    /** @type {?} */
    ExtractionResult.prototype.errors;
}
/**
 * A container for translated messages
 */
export class TranslationBundle {
    /**
     * @param {?=} i18nNodesByMsgId
     * @param {?=} digest
     * @param {?=} interpolationConfig
     * @param {?=} missingTranslationStrategy
     * @param {?=} mapperFactory
     * @param {?=} console
     */
    constructor(i18nNodesByMsgId = {}, digest, interpolationConfig, missingTranslationStrategy, mapperFactory, console) {
        this.i18nNodesByMsgId = i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this.i18nToHtml = new I18nToHtmlVisitor(i18nNodesByMsgId, digest, /** @type {?} */ ((mapperFactory)), missingTranslationStrategy, interpolationConfig, console);
    }
    /**
     * @param {?} content
     * @param {?} url
     * @param {?} digest
     * @param {?} createNameMapper
     * @param {?} loadFct
     * @param {?} missingTranslationStrategy
     * @param {?=} interpolationConfig
     * @return {?}
     */
    static load(content, url, digest, createNameMapper, loadFct, missingTranslationStrategy, interpolationConfig = DEFAULT_INTERPOLATION_CONFIG) {
        const /** @type {?} */ i18nNodesByMsgId = loadFct(content, url);
        const /** @type {?} */ digestFn = (m) => digest(m);
        const /** @type {?} */ mapperFactory = (m) => /** @type {?} */ ((createNameMapper(m)));
        return new TranslationBundle(i18nNodesByMsgId, digestFn, interpolationConfig, missingTranslationStrategy, mapperFactory, console);
    }
    /**
     * @param {?} srcMsg
     * @param {?} params
     * @return {?}
     */
    get(srcMsg, params) {
        const /** @type {?} */ htmlRes = this.i18nToHtml.convert(srcMsg, params);
        if (htmlRes.errors.length) {
            throw new Error(htmlRes.errors.join("\n"));
        }
        return htmlRes.nodes;
    }
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    has(srcMsg) {
        return this.digest(srcMsg) in this.i18nNodesByMsgId;
    }
}
function TranslationBundle_tsickle_Closure_declarations() {
    /** @type {?} */
    TranslationBundle.prototype.i18nToHtml;
    /** @type {?} */
    TranslationBundle.prototype.i18nNodesByMsgId;
    /** @type {?} */
    TranslationBundle.prototype.digest;
    /** @type {?} */
    TranslationBundle.prototype.mapperFactory;
}
class I18nToHtmlVisitor {
    /**
     * @param {?=} _i18nNodesByMsgId
     * @param {?=} _digest
     * @param {?=} _mapperFactory
     * @param {?=} _missingTranslationStrategy
     * @param {?=} _interpolationConfig
     * @param {?=} _console
     */
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
    /**
     * @param {?} srcMsg
     * @param {?} params
     * @return {?}
     */
    convert(srcMsg, params) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        this._params = params;
        this._paramKeys = Object.keys(params);
        // i18n to text
        const /** @type {?} */ text = this.convertToText(srcMsg);
        // text to html
        const /** @type {?} */ url = srcMsg.nodes[0].sourceSpan.start.file.url;
        const /** @type {?} */ htmlParser = new HtmlParser().parse(text, url, true);
        return {
            nodes: htmlParser.rootNodes,
            errors: [...this._errors, ...htmlParser.errors]
        };
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) {
        return text.value;
    }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        return container.children.map(n => n.visit(this)).join("");
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ cases = Object.keys(icu.cases).map(k => `${k} {${icu.cases[k].visit(this)}}`);
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        const /** @type {?} */ exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression)
            ? this._srcMsg.placeholders[icu.expression]
            : icu.expression;
        return `{${exp}, ${icu.type}, ${cases.join(" ")}}`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        const /** @type {?} */ phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this.convertToValue(this._srcMsg.placeholders[phName]);
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this.convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, `Unknown placeholder "${ph.name}"`);
        return "";
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ tag = `${ph.tag}`;
        const /** @type {?} */ attrs = Object.keys(ph.attrs)
            .map(name => `${name}="${ph.attrs[name]}"`)
            .join(" ");
        if (ph.isVoid) {
            return `<${tag} ${attrs}/>`;
        }
        const /** @type {?} */ children = ph.children.map((c) => c.visit(this)).join("");
        return `<${tag} ${attrs}>${children}</${tag}>`;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this.convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    }
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    convertToText(srcMsg) {
        const /** @type {?} */ id = this._digest(srcMsg);
        const /** @type {?} */ mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        let /** @type {?} */ nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = (name) => (mapper ? /** @type {?} */ ((mapper.toInternalName(name))) : name);
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                this._addError(srcMsg.nodes[0], `Missing translation for message "${id}"`);
            }
            else if (this._console && this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                this._console.warn(`Missing translation for message "${id}"`);
            }
            nodes = srcMsg.nodes;
            this._mapper = (name) => name;
        }
        const /** @type {?} */ text = nodes.map(node => node.visit(this)).join("");
        const /** @type {?} */ context = /** @type {?} */ ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    }
    /**
     * @param {?} placeholder
     * @return {?}
     */
    convertToValue(placeholder) {
        const /** @type {?} */ param = placeholder.replace(this._interpolationConfig.start, "").replace(this._interpolationConfig.end, "");
        return this._paramKeys.indexOf(param) !== -1 ? this._params[param] : placeholder;
    }
    /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    _addError(el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    }
}
function I18nToHtmlVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    I18nToHtmlVisitor.prototype._srcMsg;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._contextStack;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._errors;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._mapper;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._params;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._paramKeys;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._i18nNodesByMsgId;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._digest;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._mapperFactory;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._missingTranslationStrategy;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._interpolationConfig;
    /** @type {?} */
    I18nToHtmlVisitor.prototype._console;
}
/** @enum {number} */
const VisitorMode = {
    Extract: 0,
    Merge: 1,
};
VisitorMode[VisitorMode.Extract] = "Extract";
VisitorMode[VisitorMode.Merge] = "Merge";
/**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * \@internal
 */
class Visitor {
    /**
     * @param {?=} _implicitTags
     */
    constructor(_implicitTags = []) {
        this._implicitTags = _implicitTags;
        this.blockChildren = [];
    }
    /**
     * Extracts the messages from the tree
     * @param {?} node
     * @param {?} interpolationConfig
     * @return {?}
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
     * @param {?} node
     * @param {?} translations
     * @param {?} interpolationConfig
     * @param {?} params
     * @param {?=} metadata
     * @return {?}
     */
    merge(node, translations, interpolationConfig, params, metadata = {}) {
        this.init(VisitorMode.Merge, interpolationConfig, params);
        this.translations = translations;
        this.metadata = metadata;
        const /** @type {?} */ translatedNode = node.visit(this, null);
        if (this.inI18nBlock) {
            this._reportError(node, "Unclosed block");
        }
        return new ParseTreeResult(translatedNode.children, this.errors);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        // Parse cases for translatable html attributes
        const /** @type {?} */ expression = html.visitAll(this, icuCase.expression, context);
        if (this.mode === VisitorMode.Merge) {
            return new html.ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        this.mayBeAddBlockChildren(icu);
        const /** @type {?} */ wasInIcu = this.inIcu;
        if (!this.inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this.isInTranslatableSection) {
                this.addMessage([icu]);
            }
            this.inIcu = true;
        }
        const /** @type {?} */ cases = html.visitAll(this, icu.cases, context);
        if (this.mode === VisitorMode.Merge) {
            icu = new html.Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this.inIcu = wasInIcu;
        return icu;
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) {
        return;
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        if (this.isInTranslatableSection) {
            this.mayBeAddBlockChildren(text);
        }
        return text;
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        this.mayBeAddBlockChildren(el);
        this.depth++;
        const /** @type {?} */ wasInI18nNode = this.inI18nNode;
        const /** @type {?} */ wasInImplicitNode = this.inImplicitNode;
        let /** @type {?} */ childNodes = [];
        let /** @type {?} */ translatedChildNodes = /** @type {?} */ ((undefined));
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        const /** @type {?} */ i18nAttr = getI18nAttr(el);
        const /** @type {?} */ isImplicit = this._implicitTags.some(tag => el.name === tag) && !this.inIcu && !this.isInTranslatableSection;
        const /** @type {?} */ isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this.inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this.isInTranslatableSection && !this.inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this.inI18nNode = true;
                const /** @type {?} */ message = /** @type {?} */ ((this.addMessage(el.children, this.metadata)));
                translatedChildNodes = this.translateMessage(el, message);
            }
            if (this.mode === VisitorMode.Extract) {
                const /** @type {?} */ isTranslatable = i18nAttr || isTopLevelImplicit;
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
            const /** @type {?} */ visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(child => {
                const /** @type {?} */ visited = child.visit(this, context);
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
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        throw new Error("unreachable code");
    }
    /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @param {?=} params
     * @return {?}
     */
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
        this.createI18nMessage = createI18nMessageFactory(interpolationConfig);
        this.params = params;
    }
    /**
     * @param {?} ast
     * @param {?=} __1
     * @return {?}
     */
    addMessage(ast, { meaning = "", description = "", id = "" } = {}) {
        if (ast.length === 0 ||
            (ast.length === 1 && ast[0] instanceof html.Attribute && !(/** @type {?} */ (ast[0])).value)) {
            // Do not create empty messages
            return null;
        }
        const /** @type {?} */ message = this.createI18nMessage(ast, meaning, description, id);
        this.messages.push(message);
        return message;
    }
    /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    translateMessage(el, message) {
        if (message && this.mode === VisitorMode.Merge) {
            const /** @type {?} */ nodes = this.translations.get(message, this.params);
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
     * @param {?} node
     * @return {?}
     */
    mayBeAddBlockChildren(node) {
        if (this.inI18nBlock && !this.inIcu && this.depth === this.blockStartDepth) {
            this.blockChildren.push(node);
        }
    }
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     * @param {?} node
     * @return {?}
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
     * @return {?}
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
     * @param {?} node
     * @param {?} directChildren
     * @return {?}
     */
    _closeTranslatableSection(node, directChildren) {
        if (!this.isInTranslatableSection) {
            this._reportError(node, "Unexpected section end");
            return;
        }
        const /** @type {?} */ startIndex = this.msgCountAtSectionStart;
        const /** @type {?} */ significantChildren = directChildren.reduce((count, n) => count + (n instanceof html.Comment ? 0 : 1), 0);
        if (significantChildren === 1) {
            for (let /** @type {?} */ i = this.messages.length - 1; i >= /** @type {?} */ ((startIndex)); i--) {
                const /** @type {?} */ ast = this.messages[i].nodes;
                if (!(ast.length === 1 && ast[0] instanceof i18n.Text)) {
                    this.messages.splice(i, 1);
                    break;
                }
            }
        }
        this.msgCountAtSectionStart = undefined;
    }
    /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    _reportError(node, msg) {
        this.errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), msg));
    }
}
function Visitor_tsickle_Closure_declarations() {
    /** @type {?} */
    Visitor.prototype.depth;
    /** @type {?} */
    Visitor.prototype.inI18nNode;
    /** @type {?} */
    Visitor.prototype.inImplicitNode;
    /** @type {?} */
    Visitor.prototype.inI18nBlock;
    /** @type {?} */
    Visitor.prototype.blockChildren;
    /** @type {?} */
    Visitor.prototype.blockStartDepth;
    /** @type {?} */
    Visitor.prototype.inIcu;
    /** @type {?} */
    Visitor.prototype.msgCountAtSectionStart;
    /** @type {?} */
    Visitor.prototype.errors;
    /** @type {?} */
    Visitor.prototype.mode;
    /** @type {?} */
    Visitor.prototype.messages;
    /** @type {?} */
    Visitor.prototype.translations;
    /** @type {?} */
    Visitor.prototype.createI18nMessage;
    /** @type {?} */
    Visitor.prototype.metadata;
    /** @type {?} */
    Visitor.prototype.params;
    /** @type {?} */
    Visitor.prototype._implicitTags;
}
/**
 * @param {?} p
 * @return {?}
 */
function getI18nAttr(p) {
    return p.attrs.find(attr => attr.name === _I18N_ATTR) || null;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvcGFyc2VyL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxJQUFJLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzVDLE9BQU8sRUFBQyw0QkFBNEIsRUFBc0IsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RixPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDaEQsT0FBTyxFQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFdEQsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpELHVCQUFNLFVBQVUsR0FBRyxNQUFNLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFRMUIsTUFBTSxpQkFBa0IsU0FBUSxNQUFNOzs7O0lBQ3BDLFlBQW9CLHNCQUEyQyw0QkFBNEI7UUFDekYsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFEVix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQW9EO0tBRTFGOzs7Ozs7O0lBRUQsS0FBSyxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQUUsbUJBQW1CLEdBQUcsS0FBSztRQUM1RCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ2hGOzs7Ozs7SUFLRCxlQUFlLENBQUMsS0FBa0I7UUFDaEMsdUJBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FB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QUMsbUJBQW1CLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixHQUFHLENBQUMsQ0FBQyxxQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsdUJBQUksVUFBVSxFQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDN0QsdUJBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxDQUFDO2lCQUNQO2FBQ0Y7U0FDRjtRQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUM7Ozs7Ozs7SUFHbEMsWUFBWSxDQUFDLElBQWUsRUFBRSxHQUFXO1FBQy9DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxvQkFBQyxJQUFJLENBQUMsVUFBVSxJQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0NBRTFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxxQkFBcUIsQ0FBZTtJQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQztDQUMvRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGh0bWwgZnJvbSBcIi4uL2FzdC9hc3RcIjtcbmltcG9ydCAqIGFzIGkxOG4gZnJvbSBcIi4uL2FzdC9pMThuX2FzdFwiO1xuaW1wb3J0IHtJMThuRXJyb3J9IGZyb20gXCIuLi9hc3QvcGFyc2VfdXRpbFwiO1xuaW1wb3J0IHtERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHLCBJbnRlcnBvbGF0aW9uQ29uZmlnfSBmcm9tIFwiLi4vYXN0L2ludGVycG9sYXRpb25fY29uZmlnXCI7XG5pbXBvcnQge2NyZWF0ZUkxOG5NZXNzYWdlRmFjdG9yeX0gZnJvbSBcIi4vaTE4blwiO1xuaW1wb3J0IHtQYXJzZXIsIFBhcnNlVHJlZVJlc3VsdH0gZnJvbSBcIi4uL2FzdC9wYXJzZXJcIjtcbmltcG9ydCB7Z2V0SHRtbFRhZ0RlZmluaXRpb259IGZyb20gXCIuLi9hc3QvaHRtbF90YWdzXCI7XG5pbXBvcnQge0kxOG5NZXNzYWdlc0J5SWQsIFBsYWNlaG9sZGVyTWFwcGVyfSBmcm9tIFwiLi4vc2VyaWFsaXplcnMvc2VyaWFsaXplclwiO1xuaW1wb3J0IHtNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuY29uc3QgX0kxOE5fQVRUUiA9IFwiaTE4blwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIE1lc3NhZ2VNZXRhZGF0YSB7XG4gIG1lYW5pbmc/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEh0bWxQYXJzZXIgZXh0ZW5kcyBQYXJzZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcgPSBERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHKSB7XG4gICAgc3VwZXIoZ2V0SHRtbFRhZ0RlZmluaXRpb24pO1xuICB9XG5cbiAgcGFyc2Uoc291cmNlOiBzdHJpbmcsIHVybDogc3RyaW5nLCBwYXJzZUV4cGFuc2lvbkZvcm1zID0gZmFsc2UpOiBQYXJzZVRyZWVSZXN1bHQge1xuICAgIHJldHVybiBzdXBlci5wYXJzZShzb3VyY2UsIHVybCwgcGFyc2VFeHBhbnNpb25Gb3JtcywgdGhpcy5pbnRlcnBvbGF0aW9uQ29uZmlnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRyYW5zbGF0YWJsZSBtZXNzYWdlcyBmcm9tIGFuIGh0bWwgQVNUXG4gICAqL1xuICBleHRyYWN0TWVzc2FnZXMobm9kZXM6IGh0bWwuTm9kZVtdKTogRXh0cmFjdGlvblJlc3VsdCB7XG4gICAgY29uc3QgdmlzaXRvciA9IG5ldyBWaXNpdG9yKFtcIndyYXBwZXJcIl0pO1xuICAgIC8vIENvbnN0cnVjdCBhIHNpbmdsZSBmYWtlIHJvb3QgZWxlbWVudFxuICAgIGNvbnN0IHdyYXBwZXIgPSBuZXcgaHRtbC5FbGVtZW50KFwid3JhcHBlclwiLCBbXSwgbm9kZXMsIHVuZGVmaW5lZCEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gdmlzaXRvci5leHRyYWN0KHdyYXBwZXIsIHRoaXMuaW50ZXJwb2xhdGlvbkNvbmZpZyk7XG4gIH1cblxuICBtZXJnZVRyYW5zbGF0aW9ucyhcbiAgICBub2RlczogaHRtbC5Ob2RlW10sXG4gICAgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZSxcbiAgICBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgIG1ldGFkYXRhPzogTWVzc2FnZU1ldGFkYXRhLFxuICAgIGltcGxpY2l0VGFnczogc3RyaW5nW10gPSBbXVxuICApOiBQYXJzZVRyZWVSZXN1bHQge1xuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgVmlzaXRvcihpbXBsaWNpdFRhZ3MpO1xuICAgIC8vIENvbnN0cnVjdCBhIHNpbmdsZSBmYWtlIHJvb3QgZWxlbWVudFxuICAgIGNvbnN0IHdyYXBwZXIgPSBuZXcgaHRtbC5FbGVtZW50KFwid3JhcHBlclwiLCBbXSwgbm9kZXMsIHVuZGVmaW5lZCEsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICByZXR1cm4gdmlzaXRvci5tZXJnZSh3cmFwcGVyLCB0cmFuc2xhdGlvbnMsIHRoaXMuaW50ZXJwb2xhdGlvbkNvbmZpZywgcGFyYW1zLCBtZXRhZGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4dHJhY3Rpb25SZXN1bHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbWVzc2FnZXM6IGkxOG4uTWVzc2FnZVtdLCBwdWJsaWMgZXJyb3JzOiBJMThuRXJyb3JbXSkge31cbn1cblxuLyoqXG4gKiBBIGNvbnRhaW5lciBmb3IgdHJhbnNsYXRlZCBtZXNzYWdlc1xuICovXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRpb25CdW5kbGUge1xuICBwcml2YXRlIGkxOG5Ub0h0bWw6IEkxOG5Ub0h0bWxWaXNpdG9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaTE4bk5vZGVzQnlNc2dJZDoge1ttc2dJZDogc3RyaW5nXTogaTE4bi5Ob2RlW119ID0ge30sXG4gICAgcHVibGljIGRpZ2VzdDogKG06IGkxOG4uTWVzc2FnZSkgPT4gc3RyaW5nLFxuICAgIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcsXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k6IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICAgIHB1YmxpYyBtYXBwZXJGYWN0b3J5PzogKG06IGkxOG4uTWVzc2FnZSkgPT4gUGxhY2Vob2xkZXJNYXBwZXIsXG4gICAgY29uc29sZT86IENvbnNvbGVcbiAgKSB7XG4gICAgdGhpcy5pMThuVG9IdG1sID0gbmV3IEkxOG5Ub0h0bWxWaXNpdG9yKFxuICAgICAgaTE4bk5vZGVzQnlNc2dJZCxcbiAgICAgIGRpZ2VzdCxcbiAgICAgIG1hcHBlckZhY3RvcnkhLFxuICAgICAgbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3ksXG4gICAgICBpbnRlcnBvbGF0aW9uQ29uZmlnLFxuICAgICAgY29uc29sZVxuICAgICk7XG4gIH1cblxuICAvLyBDcmVhdGVzIGEgYFRyYW5zbGF0aW9uQnVuZGxlYCBieSBwYXJzaW5nIHRoZSBnaXZlbiBgY29udGVudGAgd2l0aCB0aGUgYHNlcmlhbGl6ZXJgLlxuICBzdGF0aWMgbG9hZChcbiAgICBjb250ZW50OiBzdHJpbmcsXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGlnZXN0OiAobWVzc2FnZTogaTE4bi5NZXNzYWdlKSA9PiBzdHJpbmcsXG4gICAgY3JlYXRlTmFtZU1hcHBlcjogKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSkgPT4gUGxhY2Vob2xkZXJNYXBwZXIgfCBudWxsLFxuICAgIGxvYWRGY3Q6IChjb250ZW50OiBzdHJpbmcsIHVybDogc3RyaW5nKSA9PiBJMThuTWVzc2FnZXNCeUlkLFxuICAgIG1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5OiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSxcbiAgICBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnID0gREVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJR1xuICApOiBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gICAgY29uc3QgaTE4bk5vZGVzQnlNc2dJZCA9IGxvYWRGY3QoY29udGVudCwgdXJsKTtcbiAgICBjb25zdCBkaWdlc3RGbiA9IChtOiBpMThuLk1lc3NhZ2UpID0+IGRpZ2VzdChtKTtcbiAgICBjb25zdCBtYXBwZXJGYWN0b3J5ID0gKG06IGkxOG4uTWVzc2FnZSkgPT4gY3JlYXRlTmFtZU1hcHBlcihtKSE7XG4gICAgcmV0dXJuIG5ldyBUcmFuc2xhdGlvbkJ1bmRsZShcbiAgICAgIGkxOG5Ob2Rlc0J5TXNnSWQsXG4gICAgICBkaWdlc3RGbixcbiAgICAgIGludGVycG9sYXRpb25Db25maWcsXG4gICAgICBtaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSxcbiAgICAgIG1hcHBlckZhY3RvcnksXG4gICAgICBjb25zb2xlXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdGhlIHRyYW5zbGF0aW9uIGFzIEhUTUwgbm9kZXMgZnJvbSB0aGUgZ2l2ZW4gc291cmNlIG1lc3NhZ2UuXG4gIGdldChzcmNNc2c6IGkxOG4uTWVzc2FnZSwgcGFyYW1zKTogaHRtbC5Ob2RlW10ge1xuICAgIGNvbnN0IGh0bWxSZXMgPSB0aGlzLmkxOG5Ub0h0bWwuY29udmVydChzcmNNc2csIHBhcmFtcyk7XG4gICAgaWYgKGh0bWxSZXMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGh0bWxSZXMuZXJyb3JzLmpvaW4oXCJcXG5cIikpO1xuICAgIH1cblxuICAgIHJldHVybiBodG1sUmVzLm5vZGVzO1xuICB9XG5cbiAgaGFzKHNyY01zZzogaTE4bi5NZXNzYWdlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlnZXN0KHNyY01zZykgaW4gdGhpcy5pMThuTm9kZXNCeU1zZ0lkO1xuICB9XG59XG5cbmNsYXNzIEkxOG5Ub0h0bWxWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBfc3JjTXNnOiBpMThuLk1lc3NhZ2U7XG4gIHByaXZhdGUgX2NvbnRleHRTdGFjazoge21zZzogaTE4bi5NZXNzYWdlOyBtYXBwZXI6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZ31bXSA9IFtdO1xuICBwcml2YXRlIF9lcnJvcnM6IEkxOG5FcnJvcltdID0gW107XG4gIHByaXZhdGUgX21hcHBlcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nO1xuICBwcml2YXRlIF9wYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9O1xuICBwcml2YXRlIF9wYXJhbUtleXM6IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2kxOG5Ob2Rlc0J5TXNnSWQ6IHtbbXNnSWQ6IHN0cmluZ106IGkxOG4uTm9kZVtdfSA9IHt9LFxuICAgIHByaXZhdGUgX2RpZ2VzdDogKG06IGkxOG4uTWVzc2FnZSkgPT4gc3RyaW5nLFxuICAgIHByaXZhdGUgX21hcHBlckZhY3Rvcnk6IChtOiBpMThuLk1lc3NhZ2UpID0+IFBsYWNlaG9sZGVyTWFwcGVyLFxuICAgIHByaXZhdGUgX21pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5OiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSxcbiAgICBwcml2YXRlIF9pbnRlcnBvbGF0aW9uQ29uZmlnPzogSW50ZXJwb2xhdGlvbkNvbmZpZyxcbiAgICBwcml2YXRlIF9jb25zb2xlPzogQ29uc29sZVxuICApIHt9XG5cbiAgY29udmVydChzcmNNc2c6IGkxOG4uTWVzc2FnZSwgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHtub2RlczogaHRtbC5Ob2RlW107IGVycm9yczogSTE4bkVycm9yW119IHtcbiAgICB0aGlzLl9jb250ZXh0U3RhY2subGVuZ3RoID0gMDtcbiAgICB0aGlzLl9lcnJvcnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG4gICAgdGhpcy5fcGFyYW1LZXlzID0gT2JqZWN0LmtleXMocGFyYW1zKTtcblxuICAgIC8vIGkxOG4gdG8gdGV4dFxuICAgIGNvbnN0IHRleHQgPSB0aGlzLmNvbnZlcnRUb1RleHQoc3JjTXNnKTtcblxuICAgIC8vIHRleHQgdG8gaHRtbFxuICAgIGNvbnN0IHVybCA9IHNyY01zZy5ub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmZpbGUudXJsO1xuICAgIGNvbnN0IGh0bWxQYXJzZXIgPSBuZXcgSHRtbFBhcnNlcigpLnBhcnNlKHRleHQsIHVybCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbm9kZXM6IGh0bWxQYXJzZXIucm9vdE5vZGVzLFxuICAgICAgZXJyb3JzOiBbLi4udGhpcy5fZXJyb3JzLCAuLi5odG1sUGFyc2VyLmVycm9yc11cbiAgICB9O1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGkxOG4uVGV4dCwgY29udGV4dD86IGFueSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRleHQudmFsdWU7XG4gIH1cblxuICB2aXNpdENvbnRhaW5lcihjb250YWluZXI6IGkxOG4uQ29udGFpbmVyLCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNoaWxkcmVuLm1hcChuID0+IG4udmlzaXQodGhpcykpLmpvaW4oXCJcIik7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IGkxOG4uSWN1LCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICBjb25zdCBjYXNlcyA9IE9iamVjdC5rZXlzKGljdS5jYXNlcykubWFwKGsgPT4gYCR7a30geyR7aWN1LmNhc2VzW2tdLnZpc2l0KHRoaXMpfX1gKTtcblxuICAgIC8vIFRPRE8odmljYik6IE9uY2UgYWxsIGZvcm1hdCBzd2l0Y2ggdG8gdXNpbmcgZXhwcmVzc2lvbiBwbGFjZWhvbGRlcnNcbiAgICAvLyB3ZSBzaG91bGQgdGhyb3cgd2hlbiB0aGUgcGxhY2Vob2xkZXIgaXMgbm90IGluIHRoZSBzb3VyY2UgbWVzc2FnZVxuICAgIGNvbnN0IGV4cCA9IHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlcnMuaGFzT3duUHJvcGVydHkoaWN1LmV4cHJlc3Npb24pXG4gICAgICA/IHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlcnNbaWN1LmV4cHJlc3Npb25dXG4gICAgICA6IGljdS5leHByZXNzaW9uO1xuXG4gICAgcmV0dXJuIGB7JHtleHB9LCAke2ljdS50eXBlfSwgJHtjYXNlcy5qb2luKFwiIFwiKX19YDtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBzdHJpbmcge1xuICAgIGNvbnN0IHBoTmFtZSA9IHRoaXMuX21hcHBlcihwaC5uYW1lKTtcbiAgICBpZiAodGhpcy5fc3JjTXNnLnBsYWNlaG9sZGVycy5oYXNPd25Qcm9wZXJ0eShwaE5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9WYWx1ZSh0aGlzLl9zcmNNc2cucGxhY2Vob2xkZXJzW3BoTmFtZV0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9zcmNNc2cucGxhY2Vob2xkZXJUb01lc3NhZ2UuaGFzT3duUHJvcGVydHkocGhOYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRvVGV4dCh0aGlzLl9zcmNNc2cucGxhY2Vob2xkZXJUb01lc3NhZ2VbcGhOYW1lXSk7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkRXJyb3IocGgsIGBVbmtub3duIHBsYWNlaG9sZGVyIFwiJHtwaC5uYW1lfVwiYCk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cblxuICAvLyBMb2FkZWQgbWVzc2FnZSBjb250YWlucyBvbmx5IHBsYWNlaG9sZGVycyAodnMgdGFnIGFuZCBpY3UgcGxhY2Vob2xkZXJzKS5cbiAgLy8gSG93ZXZlciB3aGVuIGEgdHJhbnNsYXRpb24gY2FuIG5vdCBiZSBmb3VuZCwgd2UgbmVlZCB0byBzZXJpYWxpemUgdGhlIHNvdXJjZSBtZXNzYWdlXG4gIC8vIHdoaWNoIGNhbiBjb250YWluIHRhZyBwbGFjZWhvbGRlcnNcbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHN0cmluZyB7XG4gICAgY29uc3QgdGFnID0gYCR7cGgudGFnfWA7XG4gICAgY29uc3QgYXR0cnMgPSBPYmplY3Qua2V5cyhwaC5hdHRycylcbiAgICAgIC5tYXAobmFtZSA9PiBgJHtuYW1lfT1cIiR7cGguYXR0cnNbbmFtZV19XCJgKVxuICAgICAgLmpvaW4oXCIgXCIpO1xuICAgIGlmIChwaC5pc1ZvaWQpIHtcbiAgICAgIHJldHVybiBgPCR7dGFnfSAke2F0dHJzfS8+YDtcbiAgICB9XG4gICAgY29uc3QgY2hpbGRyZW4gPSBwaC5jaGlsZHJlbi5tYXAoKGM6IGkxOG4uTm9kZSkgPT4gYy52aXNpdCh0aGlzKSkuam9pbihcIlwiKTtcbiAgICByZXR1cm4gYDwke3RhZ30gJHthdHRyc30+JHtjaGlsZHJlbn08LyR7dGFnfT5gO1xuICB9XG5cbiAgLy8gTG9hZGVkIG1lc3NhZ2UgY29udGFpbnMgb25seSBwbGFjZWhvbGRlcnMgKHZzIHRhZyBhbmQgaWN1IHBsYWNlaG9sZGVycykuXG4gIC8vIEhvd2V2ZXIgd2hlbiBhIHRyYW5zbGF0aW9uIGNhbiBub3QgYmUgZm91bmQsIHdlIG5lZWQgdG8gc2VyaWFsaXplIHRoZSBzb3VyY2UgbWVzc2FnZVxuICAvLyB3aGljaCBjYW4gY29udGFpbiB0YWcgcGxhY2Vob2xkZXJzXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IGkxOG4uSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBzdHJpbmcge1xuICAgIC8vIEFuIElDVSBwbGFjZWhvbGRlciByZWZlcmVuY2VzIHRoZSBzb3VyY2UgbWVzc2FnZSB0byBiZSBzZXJpYWxpemVkXG4gICAgcmV0dXJuIHRoaXMuY29udmVydFRvVGV4dCh0aGlzLl9zcmNNc2cucGxhY2Vob2xkZXJUb01lc3NhZ2VbcGgubmFtZV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSBzb3VyY2UgbWVzc2FnZSB0byBhIHRyYW5zbGF0ZWQgdGV4dCBzdHJpbmc6XG4gICAqIC0gdGV4dCBub2RlcyBhcmUgcmVwbGFjZWQgd2l0aCB0aGVpciB0cmFuc2xhdGlvbixcbiAgICogLSBwbGFjZWhvbGRlcnMgYXJlIHJlcGxhY2VkIHdpdGggdGhlaXIgY29udGVudCxcbiAgICogLSBJQ1Ugbm9kZXMgYXJlIGNvbnZlcnRlZCB0byBJQ1UgZXhwcmVzc2lvbnMuXG4gICAqL1xuICBwcml2YXRlIGNvbnZlcnRUb1RleHQoc3JjTXNnOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkID0gdGhpcy5fZGlnZXN0KHNyY01zZyk7XG5cbiAgICBjb25zdCBtYXBwZXIgPSB0aGlzLl9tYXBwZXJGYWN0b3J5ID8gdGhpcy5fbWFwcGVyRmFjdG9yeShzcmNNc2cpIDogbnVsbDtcbiAgICBsZXQgbm9kZXM6IGkxOG4uTm9kZVtdO1xuXG4gICAgdGhpcy5fY29udGV4dFN0YWNrLnB1c2goe21zZzogdGhpcy5fc3JjTXNnLCBtYXBwZXI6IHRoaXMuX21hcHBlcn0pO1xuICAgIHRoaXMuX3NyY01zZyA9IHNyY01zZztcblxuICAgIGlmICh0aGlzLl9pMThuTm9kZXNCeU1zZ0lkLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgICAgLy8gV2hlbiB0aGVyZSBpcyBhIHRyYW5zbGF0aW9uIHVzZSBpdHMgbm9kZXMgYXMgdGhlIHNvdXJjZVxuICAgICAgLy8gQW5kIGNyZWF0ZSBhIG1hcHBlciB0byBjb252ZXJ0IHNlcmlhbGl6ZWQgcGxhY2Vob2xkZXIgbmFtZXMgdG8gaW50ZXJuYWwgbmFtZXNcbiAgICAgIG5vZGVzID0gdGhpcy5faTE4bk5vZGVzQnlNc2dJZFtpZF07XG4gICAgICB0aGlzLl9tYXBwZXIgPSAobmFtZTogc3RyaW5nKSA9PiAobWFwcGVyID8gbWFwcGVyLnRvSW50ZXJuYWxOYW1lKG5hbWUpISA6IG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXaGVuIG5vIHRyYW5zbGF0aW9uIGhhcyBiZWVuIGZvdW5kXG4gICAgICAvLyAtIHJlcG9ydCBhbiBlcnJvciAvIGEgd2FybmluZyAvIG5vdGhpbmcsXG4gICAgICAvLyAtIHVzZSB0aGUgbm9kZXMgZnJvbSB0aGUgb3JpZ2luYWwgbWVzc2FnZVxuICAgICAgLy8gLSBwbGFjZWhvbGRlcnMgYXJlIGFscmVhZHkgaW50ZXJuYWwgYW5kIG5lZWQgbm8gbWFwcGVyXG4gICAgICBpZiAodGhpcy5fbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kgPT09IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LkVycm9yKSB7XG4gICAgICAgIHRoaXMuX2FkZEVycm9yKHNyY01zZy5ub2Rlc1swXSwgYE1pc3NpbmcgdHJhbnNsYXRpb24gZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2NvbnNvbGUgJiYgdGhpcy5fbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kgPT09IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5Lldhcm5pbmcpIHtcbiAgICAgICAgdGhpcy5fY29uc29sZS53YXJuKGBNaXNzaW5nIHRyYW5zbGF0aW9uIGZvciBtZXNzYWdlIFwiJHtpZH1cImApO1xuICAgICAgfVxuICAgICAgbm9kZXMgPSBzcmNNc2cubm9kZXM7XG4gICAgICB0aGlzLl9tYXBwZXIgPSAobmFtZTogc3RyaW5nKSA9PiBuYW1lO1xuICAgIH1cbiAgICBjb25zdCB0ZXh0ID0gbm9kZXMubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSkuam9pbihcIlwiKTtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY29udGV4dFN0YWNrLnBvcCgpITtcbiAgICB0aGlzLl9zcmNNc2cgPSBjb250ZXh0Lm1zZztcbiAgICB0aGlzLl9tYXBwZXIgPSBjb250ZXh0Lm1hcHBlcjtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydFRvVmFsdWUocGxhY2Vob2xkZXI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcGFyYW0gPSBwbGFjZWhvbGRlci5yZXBsYWNlKHRoaXMuX2ludGVycG9sYXRpb25Db25maWcuc3RhcnQsIFwiXCIpLnJlcGxhY2UodGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZy5lbmQsIFwiXCIpO1xuICAgIHJldHVybiB0aGlzLl9wYXJhbUtleXMuaW5kZXhPZihwYXJhbSkgIT09IC0xID8gdGhpcy5fcGFyYW1zW3BhcmFtXSA6IHBsYWNlaG9sZGVyO1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkRXJyb3IoZWw6IGkxOG4uTm9kZSwgbXNnOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9lcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKGVsLnNvdXJjZVNwYW4sIG1zZykpO1xuICB9XG59XG5cbmVudW0gVmlzaXRvck1vZGUge1xuICBFeHRyYWN0LFxuICBNZXJnZVxufVxuXG4vKipcbiAqIFRoaXMgVmlzaXRvciBpcyB1c2VkOlxuICogMS4gdG8gZXh0cmFjdCBhbGwgdGhlIHRyYW5zbGF0YWJsZSBzdHJpbmdzIGZyb20gYW4gaHRtbCBBU1QgKHNlZSBgZXh0cmFjdCgpYCksXG4gKiAyLiB0byByZXBsYWNlIHRoZSB0cmFuc2xhdGFibGUgc3RyaW5ncyB3aXRoIHRoZSBhY3R1YWwgdHJhbnNsYXRpb25zIChzZWUgYG1lcmdlKClgKVxuICpcbiAqIEBpbnRlcm5hbFxuICovXG5jbGFzcyBWaXNpdG9yIGltcGxlbWVudHMgaHRtbC5WaXNpdG9yIHtcbiAgcHJpdmF0ZSBkZXB0aDogbnVtYmVyO1xuXG4gIC8vIDxlbCBpMThuPi4uLjwvZWw+XG4gIHByaXZhdGUgaW5JMThuTm9kZTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBpbkltcGxpY2l0Tm9kZTogYm9vbGVhbjtcblxuICAvLyA8IS0taTE4bi0tPi4uLjwhLS0vaTE4bi0tPlxuICBwcml2YXRlIGluSTE4bkJsb2NrOiBib29sZWFuO1xuICBwcml2YXRlIGJsb2NrQ2hpbGRyZW46IGh0bWwuTm9kZVtdID0gW107XG4gIHByaXZhdGUgYmxvY2tTdGFydERlcHRoOiBudW1iZXI7XG5cbiAgLy8gezxpY3UgbWVzc2FnZT59XG4gIHByaXZhdGUgaW5JY3U6IGJvb2xlYW47XG5cbiAgLy8gc2V0IHRvIHZvaWQgMCB3aGVuIG5vdCBpbiBhIHNlY3Rpb25cbiAgcHJpdmF0ZSBtc2dDb3VudEF0U2VjdGlvblN0YXJ0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgZXJyb3JzOiBJMThuRXJyb3JbXTtcbiAgcHJpdmF0ZSBtb2RlOiBWaXNpdG9yTW9kZTtcblxuICAvLyBWaXNpdG9yTW9kZS5FeHRyYWN0IG9ubHlcbiAgcHJpdmF0ZSBtZXNzYWdlczogaTE4bi5NZXNzYWdlW107XG5cbiAgLy8gVmlzaXRvck1vZGUuTWVyZ2Ugb25seVxuICBwcml2YXRlIHRyYW5zbGF0aW9uczogVHJhbnNsYXRpb25CdW5kbGU7XG4gIHByaXZhdGUgY3JlYXRlSTE4bk1lc3NhZ2U6IChtc2c6IGh0bWwuTm9kZVtdLCBtZWFuaW5nOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IGkxOG4uTWVzc2FnZTtcbiAgcHJpdmF0ZSBtZXRhZGF0YTogTWVzc2FnZU1ldGFkYXRhO1xuICBwcml2YXRlIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaW1wbGljaXRUYWdzOiBzdHJpbmdbXSA9IFtdKSB7fVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0cyB0aGUgbWVzc2FnZXMgZnJvbSB0aGUgdHJlZVxuICAgKi9cbiAgZXh0cmFjdChub2RlOiBodG1sLk5vZGUsIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcpOiBFeHRyYWN0aW9uUmVzdWx0IHtcbiAgICB0aGlzLmluaXQoVmlzaXRvck1vZGUuRXh0cmFjdCwgaW50ZXJwb2xhdGlvbkNvbmZpZyk7XG5cbiAgICBub2RlLnZpc2l0KHRoaXMsIG51bGwpO1xuXG4gICAgaWYgKHRoaXMuaW5JMThuQmxvY2spIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKG5vZGUsIFwiVW5jbG9zZWQgYmxvY2tcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFeHRyYWN0aW9uUmVzdWx0KHRoaXMubWVzc2FnZXMsIHRoaXMuZXJyb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdHJlZSB3aGVyZSBhbGwgdHJhbnNsYXRhYmxlIG5vZGVzIGFyZSB0cmFuc2xhdGVkXG4gICAqL1xuICBtZXJnZShcbiAgICBub2RlOiBodG1sLk5vZGUsXG4gICAgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZSxcbiAgICBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnLFxuICAgIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgbWV0YWRhdGE6IE1lc3NhZ2VNZXRhZGF0YSA9IHt9XG4gICk6IFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgdGhpcy5pbml0KFZpc2l0b3JNb2RlLk1lcmdlLCBpbnRlcnBvbGF0aW9uQ29uZmlnLCBwYXJhbXMpO1xuICAgIHRoaXMudHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zO1xuICAgIHRoaXMubWV0YWRhdGEgPSBtZXRhZGF0YTtcblxuICAgIGNvbnN0IHRyYW5zbGF0ZWROb2RlID0gbm9kZS52aXNpdCh0aGlzLCBudWxsKTtcblxuICAgIGlmICh0aGlzLmluSTE4bkJsb2NrKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihub2RlLCBcIlVuY2xvc2VkIGJsb2NrXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUGFyc2VUcmVlUmVzdWx0KHRyYW5zbGF0ZWROb2RlLmNoaWxkcmVuLCB0aGlzLmVycm9ycyk7XG4gIH1cblxuICB2aXNpdEV4cGFuc2lvbkNhc2UoaWN1Q2FzZTogaHRtbC5FeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIC8vIFBhcnNlIGNhc2VzIGZvciB0cmFuc2xhdGFibGUgaHRtbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgZXhwcmVzc2lvbiA9IGh0bWwudmlzaXRBbGwodGhpcywgaWN1Q2FzZS5leHByZXNzaW9uLCBjb250ZXh0KTtcblxuICAgIGlmICh0aGlzLm1vZGUgPT09IFZpc2l0b3JNb2RlLk1lcmdlKSB7XG4gICAgICByZXR1cm4gbmV3IGh0bWwuRXhwYW5zaW9uQ2FzZShcbiAgICAgICAgaWN1Q2FzZS52YWx1ZSxcbiAgICAgICAgZXhwcmVzc2lvbixcbiAgICAgICAgaWN1Q2FzZS5zb3VyY2VTcGFuLFxuICAgICAgICBpY3VDYXNlLnZhbHVlU291cmNlU3BhbixcbiAgICAgICAgaWN1Q2FzZS5leHBTb3VyY2VTcGFuXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uKGljdTogaHRtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSk6IGh0bWwuRXhwYW5zaW9uIHtcbiAgICB0aGlzLm1heUJlQWRkQmxvY2tDaGlsZHJlbihpY3UpO1xuXG4gICAgY29uc3Qgd2FzSW5JY3UgPSB0aGlzLmluSWN1O1xuXG4gICAgaWYgKCF0aGlzLmluSWN1KSB7XG4gICAgICAvLyBuZXN0ZWQgSUNVIG1lc3NhZ2VzIHNob3VsZCBub3QgYmUgZXh0cmFjdGVkIGJ1dCB0b3AtbGV2ZWwgdHJhbnNsYXRlZCBhcyBhIHdob2xlXG4gICAgICBpZiAodGhpcy5pc0luVHJhbnNsYXRhYmxlU2VjdGlvbikge1xuICAgICAgICB0aGlzLmFkZE1lc3NhZ2UoW2ljdV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5pbkljdSA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2FzZXMgPSBodG1sLnZpc2l0QWxsKHRoaXMsIGljdS5jYXNlcywgY29udGV4dCk7XG5cbiAgICBpZiAodGhpcy5tb2RlID09PSBWaXNpdG9yTW9kZS5NZXJnZSkge1xuICAgICAgaWN1ID0gbmV3IGh0bWwuRXhwYW5zaW9uKGljdS5zd2l0Y2hWYWx1ZSwgaWN1LnR5cGUsIGNhc2VzLCBpY3Uuc291cmNlU3BhbiwgaWN1LnN3aXRjaFZhbHVlU291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgdGhpcy5pbkljdSA9IHdhc0luSWN1O1xuXG4gICAgcmV0dXJuIGljdTtcbiAgfVxuXG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBodG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGh0bWwuVGV4dCwgY29udGV4dDogYW55KTogaHRtbC5UZXh0IHtcbiAgICBpZiAodGhpcy5pc0luVHJhbnNsYXRhYmxlU2VjdGlvbikge1xuICAgICAgdGhpcy5tYXlCZUFkZEJsb2NrQ2hpbGRyZW4odGV4dCk7XG4gICAgfVxuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsOiBodG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGh0bWwuRWxlbWVudCB8IG51bGwge1xuICAgIHRoaXMubWF5QmVBZGRCbG9ja0NoaWxkcmVuKGVsKTtcbiAgICB0aGlzLmRlcHRoKys7XG4gICAgY29uc3Qgd2FzSW5JMThuTm9kZSA9IHRoaXMuaW5JMThuTm9kZTtcbiAgICBjb25zdCB3YXNJbkltcGxpY2l0Tm9kZSA9IHRoaXMuaW5JbXBsaWNpdE5vZGU7XG4gICAgbGV0IGNoaWxkTm9kZXM6IGh0bWwuTm9kZVtdID0gW107XG4gICAgbGV0IHRyYW5zbGF0ZWRDaGlsZE5vZGVzOiBodG1sLk5vZGVbXSA9IHVuZGVmaW5lZCE7XG5cbiAgICAvLyBFeHRyYWN0OlxuICAgIC8vIC0gdG9wIGxldmVsIG5vZGVzIHdpdGggdGhlIChpbXBsaWNpdCkgXCJpMThuXCIgYXR0cmlidXRlIGlmIG5vdCBhbHJlYWR5IGluIGEgc2VjdGlvblxuICAgIC8vIC0gSUNVIG1lc3NhZ2VzXG4gICAgY29uc3QgaTE4bkF0dHIgPSBnZXRJMThuQXR0cihlbCk7XG4gICAgY29uc3QgaXNJbXBsaWNpdCA9IHRoaXMuX2ltcGxpY2l0VGFncy5zb21lKHRhZyA9PiBlbC5uYW1lID09PSB0YWcpICYmICF0aGlzLmluSWN1ICYmICF0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uO1xuICAgIGNvbnN0IGlzVG9wTGV2ZWxJbXBsaWNpdCA9ICF3YXNJbkltcGxpY2l0Tm9kZSAmJiBpc0ltcGxpY2l0O1xuICAgIHRoaXMuaW5JbXBsaWNpdE5vZGUgPSB3YXNJbkltcGxpY2l0Tm9kZSB8fCBpc0ltcGxpY2l0O1xuICAgIGlmICghdGhpcy5pc0luVHJhbnNsYXRhYmxlU2VjdGlvbiAmJiAhdGhpcy5pbkljdSkge1xuICAgICAgaWYgKGkxOG5BdHRyIHx8IGlzVG9wTGV2ZWxJbXBsaWNpdCkge1xuICAgICAgICB0aGlzLmluSTE4bk5vZGUgPSB0cnVlO1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5hZGRNZXNzYWdlKGVsLmNoaWxkcmVuLCB0aGlzLm1ldGFkYXRhKSE7XG4gICAgICAgIHRyYW5zbGF0ZWRDaGlsZE5vZGVzID0gdGhpcy50cmFuc2xhdGVNZXNzYWdlKGVsLCBtZXNzYWdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuRXh0cmFjdCkge1xuICAgICAgICBjb25zdCBpc1RyYW5zbGF0YWJsZSA9IGkxOG5BdHRyIHx8IGlzVG9wTGV2ZWxJbXBsaWNpdDtcbiAgICAgICAgaWYgKGlzVHJhbnNsYXRhYmxlKSB7XG4gICAgICAgICAgdGhpcy5vcGVuVHJhbnNsYXRhYmxlU2VjdGlvbihlbCk7XG4gICAgICAgIH1cbiAgICAgICAgaHRtbC52aXNpdEFsbCh0aGlzLCBlbC5jaGlsZHJlbik7XG4gICAgICAgIGlmIChpc1RyYW5zbGF0YWJsZSkge1xuICAgICAgICAgIHRoaXMuX2Nsb3NlVHJhbnNsYXRhYmxlU2VjdGlvbihlbCwgZWwuY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpMThuQXR0ciB8fCBpc1RvcExldmVsSW1wbGljaXQpIHtcbiAgICAgICAgdGhpcy5fcmVwb3J0RXJyb3IoZWwsIFwiQ291bGQgbm90IG1hcmsgYW4gZWxlbWVudCBhcyB0cmFuc2xhdGFibGUgaW5zaWRlIGEgdHJhbnNsYXRhYmxlIHNlY3Rpb25cIik7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1vZGUgPT09IFZpc2l0b3JNb2RlLkV4dHJhY3QpIHtcbiAgICAgICAgLy8gRGVzY2VuZCBpbnRvIGNoaWxkIG5vZGVzIGZvciBleHRyYWN0aW9uXG4gICAgICAgIGh0bWwudmlzaXRBbGwodGhpcywgZWwuY2hpbGRyZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGUgPT09IFZpc2l0b3JNb2RlLk1lcmdlKSB7XG4gICAgICBjb25zdCB2aXNpdE5vZGVzID0gdHJhbnNsYXRlZENoaWxkTm9kZXMgfHwgZWwuY2hpbGRyZW47XG4gICAgICB2aXNpdE5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICBjb25zdCB2aXNpdGVkID0gY2hpbGQudmlzaXQodGhpcywgY29udGV4dCk7XG4gICAgICAgIGlmICh2aXNpdGVkICYmICF0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKSB7XG4gICAgICAgICAgLy8gRG8gbm90IGFkZCB0aGUgY2hpbGRyZW4gZnJvbSB0cmFuc2xhdGFibGUgc2VjdGlvbnMgKD0gaTE4biBibG9ja3MgaGVyZSlcbiAgICAgICAgICAvLyBUaGV5IHdpbGwgYmUgYWRkZWQgbGF0ZXIgaW4gdGhpcyBsb29wIHdoZW4gdGhlIGJsb2NrIGNsb3NlcyAoaS5lLiBvbiBgPCEtLSAvaTE4biAtLT5gKVxuICAgICAgICAgIGNoaWxkTm9kZXMgPSBjaGlsZE5vZGVzLmNvbmNhdCh2aXNpdGVkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXB0aC0tO1xuICAgIHRoaXMuaW5JMThuTm9kZSA9IHdhc0luSTE4bk5vZGU7XG4gICAgdGhpcy5pbkltcGxpY2l0Tm9kZSA9IHdhc0luSW1wbGljaXROb2RlO1xuXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuTWVyZ2UpIHtcbiAgICAgIHJldHVybiBuZXcgaHRtbC5FbGVtZW50KGVsLm5hbWUsIFtdLCBjaGlsZE5vZGVzLCBlbC5zb3VyY2VTcGFuLCBlbC5zdGFydFNvdXJjZVNwYW4sIGVsLmVuZFNvdXJjZVNwYW4pO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogaHRtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwidW5yZWFjaGFibGUgY29kZVwiKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdChtb2RlOiBWaXNpdG9yTW9kZSwgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZywgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5tb2RlID0gbW9kZTtcbiAgICB0aGlzLmluSTE4bkJsb2NrID0gZmFsc2U7XG4gICAgdGhpcy5pbkkxOG5Ob2RlID0gZmFsc2U7XG4gICAgdGhpcy5kZXB0aCA9IDA7XG4gICAgdGhpcy5pbkljdSA9IGZhbHNlO1xuICAgIHRoaXMubXNnQ291bnRBdFNlY3Rpb25TdGFydCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgIHRoaXMubWVzc2FnZXMgPSBbXTtcbiAgICB0aGlzLmluSW1wbGljaXROb2RlID0gZmFsc2U7XG4gICAgdGhpcy5jcmVhdGVJMThuTWVzc2FnZSA9IGNyZWF0ZUkxOG5NZXNzYWdlRmFjdG9yeShpbnRlcnBvbGF0aW9uQ29uZmlnKTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgfVxuXG4gIC8vIGFkZCBhIHRyYW5zbGF0YWJsZSBtZXNzYWdlXG4gIHByaXZhdGUgYWRkTWVzc2FnZShhc3Q6IGh0bWwuTm9kZVtdLCB7bWVhbmluZyA9IFwiXCIsIGRlc2NyaXB0aW9uID0gXCJcIiwgaWQgPSBcIlwifSA9IHt9KTogaTE4bi5NZXNzYWdlIHwgbnVsbCB7XG4gICAgaWYgKFxuICAgICAgYXN0Lmxlbmd0aCA9PT0gMCB8fFxuICAgICAgKGFzdC5sZW5ndGggPT09IDEgJiYgYXN0WzBdIGluc3RhbmNlb2YgaHRtbC5BdHRyaWJ1dGUgJiYgIShhc3RbMF0gYXMgaHRtbC5BdHRyaWJ1dGUpLnZhbHVlKVxuICAgICkge1xuICAgICAgLy8gRG8gbm90IGNyZWF0ZSBlbXB0eSBtZXNzYWdlc1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuY3JlYXRlSTE4bk1lc3NhZ2UoYXN0LCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWQpO1xuICAgIHRoaXMubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIC8vIFRyYW5zbGF0ZXMgdGhlIGdpdmVuIG1lc3NhZ2UgZ2l2ZW4gdGhlIGBUcmFuc2xhdGlvbkJ1bmRsZWBcbiAgLy8gVGhpcyBpcyB1c2VkIGZvciB0cmFuc2xhdGluZyBlbGVtZW50cyAvIGJsb2NrcyAtIHNlZSBgX3RyYW5zbGF0ZUF0dHJpYnV0ZXNgIGZvciBhdHRyaWJ1dGVzXG4gIC8vIG5vLW9wIHdoZW4gY2FsbGVkIGluIGV4dHJhY3Rpb24gbW9kZSAocmV0dXJucyBbXSlcbiAgcHJpdmF0ZSB0cmFuc2xhdGVNZXNzYWdlKGVsOiBodG1sLk5vZGUsIG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IGh0bWwuTm9kZVtdIHtcbiAgICBpZiAobWVzc2FnZSAmJiB0aGlzLm1vZGUgPT09IFZpc2l0b3JNb2RlLk1lcmdlKSB7XG4gICAgICBjb25zdCBub2RlcyA9IHRoaXMudHJhbnNsYXRpb25zLmdldChtZXNzYWdlLCB0aGlzLnBhcmFtcyk7XG4gICAgICBpZiAobm9kZXMpIHtcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihlbCwgYFRyYW5zbGF0aW9uIHVuYXZhaWxhYmxlIGZvciBtZXNzYWdlIGlkPVwiJHt0aGlzLnRyYW5zbGF0aW9ucy5kaWdlc3QobWVzc2FnZSl9XCJgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQWRkIHRoZSBub2RlIGFzIGEgY2hpbGQgb2YgdGhlIGJsb2NrIHdoZW46XG4gICAqIC0gd2UgYXJlIGluIGEgYmxvY2ssXG4gICAqIC0gd2UgYXJlIG5vdCBpbnNpZGUgYSBJQ1UgbWVzc2FnZSAodGhvc2UgYXJlIGhhbmRsZWQgc2VwYXJhdGVseSksXG4gICAqIC0gdGhlIG5vZGUgaXMgYSBcImRpcmVjdCBjaGlsZFwiIG9mIHRoZSBibG9ja1xuICAgKi9cbiAgcHJpdmF0ZSBtYXlCZUFkZEJsb2NrQ2hpbGRyZW4obm9kZTogaHRtbC5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5JMThuQmxvY2sgJiYgIXRoaXMuaW5JY3UgJiYgdGhpcy5kZXB0aCA9PT0gdGhpcy5ibG9ja1N0YXJ0RGVwdGgpIHtcbiAgICAgIHRoaXMuYmxvY2tDaGlsZHJlbi5wdXNoKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgc3RhcnQgb2YgYSBzZWN0aW9uLCBzZWUgYF9jbG9zZVRyYW5zbGF0YWJsZVNlY3Rpb25gXG4gICAqL1xuICBwcml2YXRlIG9wZW5UcmFuc2xhdGFibGVTZWN0aW9uKG5vZGU6IGh0bWwuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihub2RlLCBcIlVuZXhwZWN0ZWQgc2VjdGlvbiBzdGFydFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tc2dDb3VudEF0U2VjdGlvblN0YXJ0ID0gdGhpcy5tZXNzYWdlcy5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgdHJhbnNsYXRhYmxlIHNlY3Rpb24gY291bGQgYmU6XG4gICAqIC0gdGhlIGNvbnRlbnQgb2YgdHJhbnNsYXRhYmxlIGVsZW1lbnQsXG4gICAqIC0gbm9kZXMgYmV0d2VlbiBgPCEtLSBpMThuIC0tPmAgYW5kIGA8IS0tIC9pMThuIC0tPmAgY29tbWVudHNcbiAgICovXG4gIHByaXZhdGUgZ2V0IGlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm1zZ0NvdW50QXRTZWN0aW9uU3RhcnQgIT09IHZvaWQgMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGVzIGEgc2VjdGlvbi5cbiAgICpcbiAgICogSWYgYSBzZWN0aW9uIGhhcyBvbmx5IG9uZSBzaWduaWZpY2FudCBjaGlsZHJlbiAoY29tbWVudHMgbm90IHNpZ25pZmljYW50KSB0aGVuIHdlIHNob3VsZCBub3RcbiAgICoga2VlcCB0aGUgbWVzc2FnZSBmcm9tIHRoaXMgY2hpbGRyZW46XG4gICAqXG4gICAqIGA8cCBpMThuPVwibWVhbmluZ3xkZXNjcmlwdGlvblwiPntJQ1UgbWVzc2FnZX08L3A+YCB3b3VsZCBwcm9kdWNlIHR3byBtZXNzYWdlczpcbiAgICogLSBvbmUgZm9yIHRoZSA8cD4gY29udGVudCB3aXRoIG1lYW5pbmcgYW5kIGRlc2NyaXB0aW9uLFxuICAgKiAtIGFub3RoZXIgb25lIGZvciB0aGUgSUNVIG1lc3NhZ2UuXG4gICAqXG4gICAqIEluIHRoaXMgY2FzZSB0aGUgbGFzdCBtZXNzYWdlIGlzIGRpc2NhcmRlZCBhcyBpdCBjb250YWlucyBsZXNzIGluZm9ybWF0aW9uICh0aGUgQVNUIGlzXG4gICAqIG90aGVyd2lzZSBpZGVudGljYWwpLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgd2Ugc2hvdWxkIHN0aWxsIGtlZXAgbWVzc2FnZXMgZXh0cmFjdGVkIGZyb20gYXR0cmlidXRlcyBpbnNpZGUgdGhlIHNlY3Rpb24gKGllIGluIHRoZVxuICAgKiBJQ1UgbWVzc2FnZSBoZXJlKVxuICAgKi9cbiAgcHJpdmF0ZSBfY2xvc2VUcmFuc2xhdGFibGVTZWN0aW9uKG5vZGU6IGh0bWwuTm9kZSwgZGlyZWN0Q2hpbGRyZW46IGh0bWwuTm9kZVtdKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKSB7XG4gICAgICB0aGlzLl9yZXBvcnRFcnJvcihub2RlLCBcIlVuZXhwZWN0ZWQgc2VjdGlvbiBlbmRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhcnRJbmRleCA9IHRoaXMubXNnQ291bnRBdFNlY3Rpb25TdGFydDtcbiAgICBjb25zdCBzaWduaWZpY2FudENoaWxkcmVuOiBudW1iZXIgPSBkaXJlY3RDaGlsZHJlbi5yZWR1Y2UoXG4gICAgICAoY291bnQ6IG51bWJlciwgbjogaHRtbC5Ob2RlKTogbnVtYmVyID0+IGNvdW50ICsgKG4gaW5zdGFuY2VvZiBodG1sLkNvbW1lbnQgPyAwIDogMSksXG4gICAgICAwXG4gICAgKTtcblxuICAgIGlmIChzaWduaWZpY2FudENoaWxkcmVuID09PSAxKSB7XG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5tZXNzYWdlcy5sZW5ndGggLSAxOyBpID49IHN0YXJ0SW5kZXghOyBpLS0pIHtcbiAgICAgICAgY29uc3QgYXN0ID0gdGhpcy5tZXNzYWdlc1tpXS5ub2RlcztcbiAgICAgICAgaWYgKCEoYXN0Lmxlbmd0aCA9PT0gMSAmJiBhc3RbMF0gaW5zdGFuY2VvZiBpMThuLlRleHQpKSB7XG4gICAgICAgICAgdGhpcy5tZXNzYWdlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1zZ0NvdW50QXRTZWN0aW9uU3RhcnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIF9yZXBvcnRFcnJvcihub2RlOiBodG1sLk5vZGUsIG1zZzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5lcnJvcnMucHVzaChuZXcgSTE4bkVycm9yKG5vZGUuc291cmNlU3BhbiEsIG1zZykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEkxOG5BdHRyKHA6IGh0bWwuRWxlbWVudCk6IGh0bWwuQXR0cmlidXRlIHwgbnVsbCB7XG4gIHJldHVybiBwLmF0dHJzLmZpbmQoYXR0ciA9PiBhdHRyLm5hbWUgPT09IF9JMThOX0FUVFIpIHx8IG51bGw7XG59XG4iXX0=