/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import * as html from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import { I18nError } from "../ast/parse_util";
import { DEFAULT_INTERPOLATION_CONFIG } from "../ast/interpolation_config";
import { createI18nMessageFactory } from "./i18n";
import { Parser, ParseTreeResult } from "../ast/parser";
import { getHtmlTagDefinition } from "../ast/html_tags";
import { MissingTranslationStrategy } from "@angular/core";
var /** @type {?} */ _I18N_ATTR = "i18n";
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
var HtmlParser = /** @class */ (function (_super) {
    tslib_1.__extends(HtmlParser, _super);
    function HtmlParser(interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var _this = _super.call(this, getHtmlTagDefinition) || this;
        _this.interpolationConfig = interpolationConfig;
        return _this;
    }
    /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    HtmlParser.prototype.parse = /**
     * @param {?} source
     * @param {?} url
     * @param {?=} parseExpansionForms
     * @return {?}
     */
    function (source, url, parseExpansionForms) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        return _super.prototype.parse.call(this, source, url, parseExpansionForms, this.interpolationConfig);
    };
    /**
     * Extract translatable messages from an html AST
     */
    /**
     * Extract translatable messages from an html AST
     * @param {?} nodes
     * @return {?}
     */
    HtmlParser.prototype.extractMessages = /**
     * Extract translatable messages from an html AST
     * @param {?} nodes
     * @return {?}
     */
    function (nodes) {
        var /** @type {?} */ visitor = new Visitor(["wrapper"]);
        // Construct a single fake root element
        var /** @type {?} */ wrapper = new html.Element("wrapper", [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        return visitor.extract(wrapper, this.interpolationConfig);
    };
    /**
     * @param {?} nodes
     * @param {?} translations
     * @param {?} params
     * @param {?=} metadata
     * @param {?=} implicitTags
     * @return {?}
     */
    HtmlParser.prototype.mergeTranslations = /**
     * @param {?} nodes
     * @param {?} translations
     * @param {?} params
     * @param {?=} metadata
     * @param {?=} implicitTags
     * @return {?}
     */
    function (nodes, translations, params, metadata, implicitTags) {
        if (implicitTags === void 0) { implicitTags = []; }
        var /** @type {?} */ visitor = new Visitor(implicitTags);
        // Construct a single fake root element
        var /** @type {?} */ wrapper = new html.Element("wrapper", [], nodes, /** @type {?} */ ((undefined)), undefined, undefined);
        return visitor.merge(wrapper, translations, this.interpolationConfig, params, metadata);
    };
    return HtmlParser;
}(Parser));
export { HtmlParser };
function HtmlParser_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlParser.prototype.interpolationConfig;
}
var ExtractionResult = /** @class */ (function () {
    function ExtractionResult(messages, errors) {
        this.messages = messages;
        this.errors = errors;
    }
    return ExtractionResult;
}());
export { ExtractionResult };
function ExtractionResult_tsickle_Closure_declarations() {
    /** @type {?} */
    ExtractionResult.prototype.messages;
    /** @type {?} */
    ExtractionResult.prototype.errors;
}
/**
 * A container for translated messages
 */
var /**
 * A container for translated messages
 */
TranslationBundle = /** @class */ (function () {
    function TranslationBundle(i18nNodesByMsgId, digest, interpolationConfig, missingTranslationStrategy, mapperFactory, console) {
        if (i18nNodesByMsgId === void 0) { i18nNodesByMsgId = {}; }
        this.i18nNodesByMsgId = i18nNodesByMsgId;
        this.digest = digest;
        this.mapperFactory = mapperFactory;
        this.i18nToHtml = new I18nToHtmlVisitor(i18nNodesByMsgId, digest, /** @type {?} */ ((mapperFactory)), missingTranslationStrategy, interpolationConfig, console);
    }
    // Creates a `TranslationBundle` by parsing the given `content` with the `serializer`.
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
    TranslationBundle.load = /**
     * @param {?} content
     * @param {?} url
     * @param {?} digest
     * @param {?} createNameMapper
     * @param {?} loadFct
     * @param {?} missingTranslationStrategy
     * @param {?=} interpolationConfig
     * @return {?}
     */
    function (content, url, digest, createNameMapper, loadFct, missingTranslationStrategy, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        var /** @type {?} */ i18nNodesByMsgId = loadFct(content, url);
        var /** @type {?} */ digestFn = function (m) { return digest(m); };
        var /** @type {?} */ mapperFactory = function (m) { return ((createNameMapper(m))); };
        return new TranslationBundle(i18nNodesByMsgId, digestFn, interpolationConfig, missingTranslationStrategy, mapperFactory, console);
    };
    // Returns the translation as HTML nodes from the given source message.
    /**
     * @param {?} srcMsg
     * @param {?} params
     * @return {?}
     */
    TranslationBundle.prototype.get = /**
     * @param {?} srcMsg
     * @param {?} params
     * @return {?}
     */
    function (srcMsg, params) {
        var /** @type {?} */ htmlRes = this.i18nToHtml.convert(srcMsg, params);
        if (htmlRes.errors.length) {
            throw new Error(htmlRes.errors.join("\n"));
        }
        return htmlRes.nodes;
    };
    /**
     * @param {?} srcMsg
     * @return {?}
     */
    TranslationBundle.prototype.has = /**
     * @param {?} srcMsg
     * @return {?}
     */
    function (srcMsg) {
        return this.digest(srcMsg) in this.i18nNodesByMsgId;
    };
    return TranslationBundle;
}());
/**
 * A container for translated messages
 */
export { TranslationBundle };
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
var I18nToHtmlVisitor = /** @class */ (function () {
    function I18nToHtmlVisitor(_i18nNodesByMsgId, _digest, _mapperFactory, _missingTranslationStrategy, _interpolationConfig, _console) {
        if (_i18nNodesByMsgId === void 0) { _i18nNodesByMsgId = {}; }
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
    I18nToHtmlVisitor.prototype.convert = /**
     * @param {?} srcMsg
     * @param {?} params
     * @return {?}
     */
    function (srcMsg, params) {
        this._contextStack.length = 0;
        this._errors.length = 0;
        this._params = params;
        this._paramKeys = Object.keys(params);
        // i18n to text
        var /** @type {?} */ text = this.convertToText(srcMsg);
        // text to html
        var /** @type {?} */ url = srcMsg.nodes[0].sourceSpan.start.file.url;
        var /** @type {?} */ htmlParser = new HtmlParser().parse(text, url, true);
        return {
            nodes: htmlParser.rootNodes,
            errors: tslib_1.__spread(this._errors, htmlParser.errors)
        };
    };
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) {
        return text.value;
    };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        return container.children.map(function (n) { return n.visit(_this); }).join("");
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ cases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        // TODO(vicb): Once all format switch to using expression placeholders
        // we should throw when the placeholder is not in the source message
        var /** @type {?} */ exp = this._srcMsg.placeholders.hasOwnProperty(icu.expression)
            ? this._srcMsg.placeholders[icu.expression]
            : icu.expression;
        return "{" + exp + ", " + icu.type + ", " + cases.join(" ") + "}";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ phName = this._mapper(ph.name);
        if (this._srcMsg.placeholders.hasOwnProperty(phName)) {
            return this.convertToValue(this._srcMsg.placeholders[phName]);
        }
        if (this._srcMsg.placeholderToMessage.hasOwnProperty(phName)) {
            return this.convertToText(this._srcMsg.placeholderToMessage[phName]);
        }
        this._addError(ph, "Unknown placeholder \"" + ph.name + "\"");
        return "";
    };
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var _this = this;
        var /** @type {?} */ tag = "" + ph.tag;
        var /** @type {?} */ attrs = Object.keys(ph.attrs)
            .map(function (name) { return name + "=\"" + ph.attrs[name] + "\""; })
            .join(" ");
        if (ph.isVoid) {
            return "<" + tag + " " + attrs + "/>";
        }
        var /** @type {?} */ children = ph.children.map(function (c) { return c.visit(_this); }).join("");
        return "<" + tag + " " + attrs + ">" + children + "</" + tag + ">";
    };
    // Loaded message contains only placeholders (vs tag and icu placeholders).
    // However when a translation can not be found, we need to serialize the source message
    // which can contain tag placeholders
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        // An ICU placeholder references the source message to be serialized
        return this.convertToText(this._srcMsg.placeholderToMessage[ph.name]);
    };
    /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.convertToText = /**
     * Convert a source message to a translated text string:
     * - text nodes are replaced with their translation,
     * - placeholders are replaced with their content,
     * - ICU nodes are converted to ICU expressions.
     * @param {?} srcMsg
     * @return {?}
     */
    function (srcMsg) {
        var _this = this;
        var /** @type {?} */ id = this._digest(srcMsg);
        var /** @type {?} */ mapper = this._mapperFactory ? this._mapperFactory(srcMsg) : null;
        var /** @type {?} */ nodes;
        this._contextStack.push({ msg: this._srcMsg, mapper: this._mapper });
        this._srcMsg = srcMsg;
        if (this._i18nNodesByMsgId.hasOwnProperty(id)) {
            // When there is a translation use its nodes as the source
            // And create a mapper to convert serialized placeholder names to internal names
            nodes = this._i18nNodesByMsgId[id];
            this._mapper = function (name) { return (mapper ? /** @type {?} */ ((mapper.toInternalName(name))) : name); };
        }
        else {
            // When no translation has been found
            // - report an error / a warning / nothing,
            // - use the nodes from the original message
            // - placeholders are already internal and need no mapper
            if (this._missingTranslationStrategy === MissingTranslationStrategy.Error) {
                this._addError(srcMsg.nodes[0], "Missing translation for message \"" + id + "\"");
            }
            else if (this._console && this._missingTranslationStrategy === MissingTranslationStrategy.Warning) {
                this._console.warn("Missing translation for message \"" + id + "\"");
            }
            nodes = srcMsg.nodes;
            this._mapper = function (name) { return name; };
        }
        var /** @type {?} */ text = nodes.map(function (node) { return node.visit(_this); }).join("");
        var /** @type {?} */ context = /** @type {?} */ ((this._contextStack.pop()));
        this._srcMsg = context.msg;
        this._mapper = context.mapper;
        return text;
    };
    /**
     * @param {?} placeholder
     * @return {?}
     */
    I18nToHtmlVisitor.prototype.convertToValue = /**
     * @param {?} placeholder
     * @return {?}
     */
    function (placeholder) {
        var /** @type {?} */ param = placeholder.replace(this._interpolationConfig.start, "").replace(this._interpolationConfig.end, "");
        return this._paramKeys.indexOf(param) !== -1 ? this._params[param] : placeholder;
    };
    /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    I18nToHtmlVisitor.prototype._addError = /**
     * @param {?} el
     * @param {?} msg
     * @return {?}
     */
    function (el, msg) {
        this._errors.push(new I18nError(el.sourceSpan, msg));
    };
    return I18nToHtmlVisitor;
}());
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
var VisitorMode = {
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
var /**
 * This Visitor is used:
 * 1. to extract all the translatable strings from an html AST (see `extract()`),
 * 2. to replace the translatable strings with the actual translations (see `merge()`)
 *
 * \@internal
 */
Visitor = /** @class */ (function () {
    function Visitor(_implicitTags) {
        if (_implicitTags === void 0) { _implicitTags = []; }
        this._implicitTags = _implicitTags;
        this.blockChildren = [];
    }
    /**
     * Extracts the messages from the tree
     */
    /**
     * Extracts the messages from the tree
     * @param {?} node
     * @param {?} interpolationConfig
     * @return {?}
     */
    Visitor.prototype.extract = /**
     * Extracts the messages from the tree
     * @param {?} node
     * @param {?} interpolationConfig
     * @return {?}
     */
    function (node, interpolationConfig) {
        this.init(VisitorMode.Extract, interpolationConfig);
        node.visit(this, null);
        if (this.inI18nBlock) {
            this._reportError(node, "Unclosed block");
        }
        return new ExtractionResult(this.messages, this.errors);
    };
    /**
     * Returns a tree where all translatable nodes are translated
     */
    /**
     * Returns a tree where all translatable nodes are translated
     * @param {?} node
     * @param {?} translations
     * @param {?} interpolationConfig
     * @param {?} params
     * @param {?=} metadata
     * @return {?}
     */
    Visitor.prototype.merge = /**
     * Returns a tree where all translatable nodes are translated
     * @param {?} node
     * @param {?} translations
     * @param {?} interpolationConfig
     * @param {?} params
     * @param {?=} metadata
     * @return {?}
     */
    function (node, translations, interpolationConfig, params, metadata) {
        if (metadata === void 0) { metadata = {}; }
        this.init(VisitorMode.Merge, interpolationConfig, params);
        this.translations = translations;
        this.metadata = metadata;
        var /** @type {?} */ translatedNode = node.visit(this, null);
        if (this.inI18nBlock) {
            this._reportError(node, "Unclosed block");
        }
        return new ParseTreeResult(translatedNode.children, this.errors);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitExpansionCase = /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    function (icuCase, context) {
        // Parse cases for translatable html attributes
        var /** @type {?} */ expression = html.visitAll(this, icuCase.expression, context);
        if (this.mode === VisitorMode.Merge) {
            return new html.ExpansionCase(icuCase.value, expression, icuCase.sourceSpan, icuCase.valueSourceSpan, icuCase.expSourceSpan);
        }
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitExpansion = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        this.mayBeAddBlockChildren(icu);
        var /** @type {?} */ wasInIcu = this.inIcu;
        if (!this.inIcu) {
            // nested ICU messages should not be extracted but top-level translated as a whole
            if (this.isInTranslatableSection) {
                this.addMessage([icu]);
            }
            this.inIcu = true;
        }
        var /** @type {?} */ cases = html.visitAll(this, icu.cases, context);
        if (this.mode === VisitorMode.Merge) {
            icu = new html.Expansion(icu.switchValue, icu.type, cases, icu.sourceSpan, icu.switchValueSourceSpan);
        }
        this.inIcu = wasInIcu;
        return icu;
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) {
        return;
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        if (this.isInTranslatableSection) {
            this.mayBeAddBlockChildren(text);
        }
        return text;
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitElement = /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    function (el, context) {
        var _this = this;
        this.mayBeAddBlockChildren(el);
        this.depth++;
        var /** @type {?} */ wasInI18nNode = this.inI18nNode;
        var /** @type {?} */ wasInImplicitNode = this.inImplicitNode;
        var /** @type {?} */ childNodes = [];
        var /** @type {?} */ translatedChildNodes = /** @type {?} */ ((undefined));
        // Extract:
        // - top level nodes with the (implicit) "i18n" attribute if not already in a section
        // - ICU messages
        var /** @type {?} */ i18nAttr = getI18nAttr(el);
        var /** @type {?} */ isImplicit = this._implicitTags.some(function (tag) { return el.name === tag; }) && !this.inIcu && !this.isInTranslatableSection;
        var /** @type {?} */ isTopLevelImplicit = !wasInImplicitNode && isImplicit;
        this.inImplicitNode = wasInImplicitNode || isImplicit;
        if (!this.isInTranslatableSection && !this.inIcu) {
            if (i18nAttr || isTopLevelImplicit) {
                this.inI18nNode = true;
                var /** @type {?} */ message = /** @type {?} */ ((this.addMessage(el.children, this.metadata)));
                translatedChildNodes = this.translateMessage(el, message);
            }
            if (this.mode === VisitorMode.Extract) {
                var /** @type {?} */ isTranslatable = i18nAttr || isTopLevelImplicit;
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
            var /** @type {?} */ visitNodes = translatedChildNodes || el.children;
            visitNodes.forEach(function (child) {
                var /** @type {?} */ visited = child.visit(_this, context);
                if (visited && !_this.isInTranslatableSection) {
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
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) {
        throw new Error("unreachable code");
    };
    /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @param {?=} params
     * @return {?}
     */
    Visitor.prototype.init = /**
     * @param {?} mode
     * @param {?} interpolationConfig
     * @param {?=} params
     * @return {?}
     */
    function (mode, interpolationConfig, params) {
        if (params === void 0) { params = {}; }
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
    };
    /**
     * @param {?} ast
     * @param {?=} __1
     * @return {?}
     */
    Visitor.prototype.addMessage = /**
     * @param {?} ast
     * @param {?=} __1
     * @return {?}
     */
    function (ast, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.meaning, meaning = _c === void 0 ? "" : _c, _d = _b.description, description = _d === void 0 ? "" : _d, _e = _b.id, id = _e === void 0 ? "" : _e;
        if (ast.length === 0 ||
            (ast.length === 1 && ast[0] instanceof html.Attribute && !(/** @type {?} */ (ast[0])).value)) {
            // Do not create empty messages
            return null;
        }
        var /** @type {?} */ message = this.createI18nMessage(ast, meaning, description, id);
        this.messages.push(message);
        return message;
    };
    /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    Visitor.prototype.translateMessage = /**
     * @param {?} el
     * @param {?} message
     * @return {?}
     */
    function (el, message) {
        if (message && this.mode === VisitorMode.Merge) {
            var /** @type {?} */ nodes = this.translations.get(message, this.params);
            if (nodes) {
                return nodes;
            }
            this._reportError(el, "Translation unavailable for message id=\"" + this.translations.digest(message) + "\"");
        }
        return [];
    };
    /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     * @param {?} node
     * @return {?}
     */
    Visitor.prototype.mayBeAddBlockChildren = /**
     * Add the node as a child of the block when:
     * - we are in a block,
     * - we are not inside a ICU message (those are handled separately),
     * - the node is a "direct child" of the block
     * @param {?} node
     * @return {?}
     */
    function (node) {
        if (this.inI18nBlock && !this.inIcu && this.depth === this.blockStartDepth) {
            this.blockChildren.push(node);
        }
    };
    /**
     * Marks the start of a section, see `_closeTranslatableSection`
     * @param {?} node
     * @return {?}
     */
    Visitor.prototype.openTranslatableSection = /**
     * Marks the start of a section, see `_closeTranslatableSection`
     * @param {?} node
     * @return {?}
     */
    function (node) {
        if (this.isInTranslatableSection) {
            this._reportError(node, "Unexpected section start");
        }
        else {
            this.msgCountAtSectionStart = this.messages.length;
        }
    };
    Object.defineProperty(Visitor.prototype, "isInTranslatableSection", {
        get: /**
         * A translatable section could be:
         * - the content of translatable element,
         * - nodes between `<!-- i18n -->` and `<!-- /i18n -->` comments
         * @return {?}
         */
        function () {
            return this.msgCountAtSectionStart !== void 0;
        },
        enumerable: true,
        configurable: true
    });
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
    Visitor.prototype._closeTranslatableSection = /**
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
    function (node, directChildren) {
        if (!this.isInTranslatableSection) {
            this._reportError(node, "Unexpected section end");
            return;
        }
        var /** @type {?} */ startIndex = this.msgCountAtSectionStart;
        var /** @type {?} */ significantChildren = directChildren.reduce(function (count, n) { return count + (n instanceof html.Comment ? 0 : 1); }, 0);
        if (significantChildren === 1) {
            for (var /** @type {?} */ i = this.messages.length - 1; i >= /** @type {?} */ ((startIndex)); i--) {
                var /** @type {?} */ ast = this.messages[i].nodes;
                if (!(ast.length === 1 && ast[0] instanceof i18n.Text)) {
                    this.messages.splice(i, 1);
                    break;
                }
            }
        }
        this.msgCountAtSectionStart = undefined;
    };
    /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    Visitor.prototype._reportError = /**
     * @param {?} node
     * @param {?} msg
     * @return {?}
     */
    function (node, msg) {
        this.errors.push(new I18nError(/** @type {?} */ ((node.sourceSpan)), msg));
    };
    return Visitor;
}());
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
    return p.attrs.find(function (attr) { return attr.name === _I18N_ATTR; }) || null;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvcGFyc2VyL2h0bWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEtBQUssSUFBSSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1QyxPQUFPLEVBQUMsNEJBQTRCLEVBQXNCLE1BQU0sNkJBQTZCLENBQUM7QUFDOUYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxNQUFNLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRXRELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6RCxxQkFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7O0FBUTFCLElBQUE7SUFBZ0Msc0NBQU07SUFDcEMsb0JBQW9CLG1CQUF1RTtnR0FBQTtRQUEzRixZQUNFLGtCQUFNLG9CQUFvQixDQUFDLFNBQzVCO1FBRm1CLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBb0Q7O0tBRTFGOzs7Ozs7O0lBRUQsMEJBQUs7Ozs7OztJQUFMLFVBQU0sTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBMkI7UUFBM0Isb0NBQUEsRUFBQSwyQkFBMkI7UUFDNUQsTUFBTSxDQUFDLGlCQUFNLEtBQUssWUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ2hGO0lBRUQ7O09BRUc7Ozs7OztJQUNILG9DQUFlOzs7OztJQUFmLFVBQWdCLEtBQWtCO1FBQ2hDLHFCQUFNLE9BQU8sR0FB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SyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsS0FBSyxDQUFDO2lCQUNQO2FBQ0Y7U0FDRjtRQUVELElBQUksQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLENBQUM7Ozs7Ozs7SUFHbEMsOEJBQVk7Ozs7O2NBQUMsSUFBZSxFQUFFLEdBQVc7UUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLG9CQUFDLElBQUksQ0FBQyxVQUFVLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzs7a0JBbmtCM0Q7SUFxa0JDLENBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVELHFCQUFxQixDQUFlO0lBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUF4QixDQUF3QixDQUFDLElBQUksSUFBSSxDQUFDO0NBQy9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaHRtbCBmcm9tIFwiLi4vYXN0L2FzdFwiO1xuaW1wb3J0ICogYXMgaTE4biBmcm9tIFwiLi4vYXN0L2kxOG5fYXN0XCI7XG5pbXBvcnQge0kxOG5FcnJvcn0gZnJvbSBcIi4uL2FzdC9wYXJzZV91dGlsXCI7XG5pbXBvcnQge0RFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUcsIEludGVycG9sYXRpb25Db25maWd9IGZyb20gXCIuLi9hc3QvaW50ZXJwb2xhdGlvbl9jb25maWdcIjtcbmltcG9ydCB7Y3JlYXRlSTE4bk1lc3NhZ2VGYWN0b3J5fSBmcm9tIFwiLi9pMThuXCI7XG5pbXBvcnQge1BhcnNlciwgUGFyc2VUcmVlUmVzdWx0fSBmcm9tIFwiLi4vYXN0L3BhcnNlclwiO1xuaW1wb3J0IHtnZXRIdG1sVGFnRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2FzdC9odG1sX3RhZ3NcIjtcbmltcG9ydCB7STE4bk1lc3NhZ2VzQnlJZCwgUGxhY2Vob2xkZXJNYXBwZXJ9IGZyb20gXCIuLi9zZXJpYWxpemVycy9zZXJpYWxpemVyXCI7XG5pbXBvcnQge01pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5jb25zdCBfSTE4Tl9BVFRSID0gXCJpMThuXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWVzc2FnZU1ldGFkYXRhIHtcbiAgbWVhbmluZz86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gIGlkPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgSHRtbFBhcnNlciBleHRlbmRzIFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyA9IERFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUcpIHtcbiAgICBzdXBlcihnZXRIdG1sVGFnRGVmaW5pdGlvbik7XG4gIH1cblxuICBwYXJzZShzb3VyY2U6IHN0cmluZywgdXJsOiBzdHJpbmcsIHBhcnNlRXhwYW5zaW9uRm9ybXMgPSBmYWxzZSk6IFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgcmV0dXJuIHN1cGVyLnBhcnNlKHNvdXJjZSwgdXJsLCBwYXJzZUV4cGFuc2lvbkZvcm1zLCB0aGlzLmludGVycG9sYXRpb25Db25maWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdHJhbnNsYXRhYmxlIG1lc3NhZ2VzIGZyb20gYW4gaHRtbCBBU1RcbiAgICovXG4gIGV4dHJhY3RNZXNzYWdlcyhub2RlczogaHRtbC5Ob2RlW10pOiBFeHRyYWN0aW9uUmVzdWx0IHtcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IFZpc2l0b3IoW1wid3JhcHBlclwiXSk7XG4gICAgLy8gQ29uc3RydWN0IGEgc2luZ2xlIGZha2Ugcm9vdCBlbGVtZW50XG4gICAgY29uc3Qgd3JhcHBlciA9IG5ldyBodG1sLkVsZW1lbnQoXCJ3cmFwcGVyXCIsIFtdLCBub2RlcywgdW5kZWZpbmVkISwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIHJldHVybiB2aXNpdG9yLmV4dHJhY3Qod3JhcHBlciwgdGhpcy5pbnRlcnBvbGF0aW9uQ29uZmlnKTtcbiAgfVxuXG4gIG1lcmdlVHJhbnNsYXRpb25zKFxuICAgIG5vZGVzOiBodG1sLk5vZGVbXSxcbiAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlLFxuICAgIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgbWV0YWRhdGE/OiBNZXNzYWdlTWV0YWRhdGEsXG4gICAgaW1wbGljaXRUYWdzOiBzdHJpbmdbXSA9IFtdXG4gICk6IFBhcnNlVHJlZVJlc3VsdCB7XG4gICAgY29uc3QgdmlzaXRvciA9IG5ldyBWaXNpdG9yKGltcGxpY2l0VGFncyk7XG4gICAgLy8gQ29uc3RydWN0IGEgc2luZ2xlIGZha2Ugcm9vdCBlbGVtZW50XG4gICAgY29uc3Qgd3JhcHBlciA9IG5ldyBodG1sLkVsZW1lbnQoXCJ3cmFwcGVyXCIsIFtdLCBub2RlcywgdW5kZWZpbmVkISwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIHJldHVybiB2aXNpdG9yLm1lcmdlKHdyYXBwZXIsIHRyYW5zbGF0aW9ucywgdGhpcy5pbnRlcnBvbGF0aW9uQ29uZmlnLCBwYXJhbXMsIG1ldGFkYXRhKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXh0cmFjdGlvblJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXNzYWdlczogaTE4bi5NZXNzYWdlW10sIHB1YmxpYyBlcnJvcnM6IEkxOG5FcnJvcltdKSB7fVxufVxuXG4vKipcbiAqIEEgY29udGFpbmVyIGZvciB0cmFuc2xhdGVkIG1lc3NhZ2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2xhdGlvbkJ1bmRsZSB7XG4gIHByaXZhdGUgaTE4blRvSHRtbDogSTE4blRvSHRtbFZpc2l0b3I7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBpMThuTm9kZXNCeU1zZ0lkOiB7W21zZ0lkOiBzdHJpbmddOiBpMThuLk5vZGVbXX0gPSB7fSxcbiAgICBwdWJsaWMgZGlnZXN0OiAobTogaTE4bi5NZXNzYWdlKSA9PiBzdHJpbmcsXG4gICAgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyxcbiAgICBtaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneTogTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3ksXG4gICAgcHVibGljIG1hcHBlckZhY3Rvcnk/OiAobTogaTE4bi5NZXNzYWdlKSA9PiBQbGFjZWhvbGRlck1hcHBlcixcbiAgICBjb25zb2xlPzogQ29uc29sZVxuICApIHtcbiAgICB0aGlzLmkxOG5Ub0h0bWwgPSBuZXcgSTE4blRvSHRtbFZpc2l0b3IoXG4gICAgICBpMThuTm9kZXNCeU1zZ0lkLFxuICAgICAgZGlnZXN0LFxuICAgICAgbWFwcGVyRmFjdG9yeSEsXG4gICAgICBtaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSxcbiAgICAgIGludGVycG9sYXRpb25Db25maWcsXG4gICAgICBjb25zb2xlXG4gICAgKTtcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSBgVHJhbnNsYXRpb25CdW5kbGVgIGJ5IHBhcnNpbmcgdGhlIGdpdmVuIGBjb250ZW50YCB3aXRoIHRoZSBgc2VyaWFsaXplcmAuXG4gIHN0YXRpYyBsb2FkKFxuICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkaWdlc3Q6IChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpID0+IHN0cmluZyxcbiAgICBjcmVhdGVOYW1lTWFwcGVyOiAobWVzc2FnZTogaTE4bi5NZXNzYWdlKSA9PiBQbGFjZWhvbGRlck1hcHBlciB8IG51bGwsXG4gICAgbG9hZEZjdDogKGNvbnRlbnQ6IHN0cmluZywgdXJsOiBzdHJpbmcpID0+IEkxOG5NZXNzYWdlc0J5SWQsXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k6IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICAgIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcgPSBERUZBVUxUX0lOVEVSUE9MQVRJT05fQ09ORklHXG4gICk6IFRyYW5zbGF0aW9uQnVuZGxlIHtcbiAgICBjb25zdCBpMThuTm9kZXNCeU1zZ0lkID0gbG9hZEZjdChjb250ZW50LCB1cmwpO1xuICAgIGNvbnN0IGRpZ2VzdEZuID0gKG06IGkxOG4uTWVzc2FnZSkgPT4gZGlnZXN0KG0pO1xuICAgIGNvbnN0IG1hcHBlckZhY3RvcnkgPSAobTogaTE4bi5NZXNzYWdlKSA9PiBjcmVhdGVOYW1lTWFwcGVyKG0pITtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0aW9uQnVuZGxlKFxuICAgICAgaTE4bk5vZGVzQnlNc2dJZCxcbiAgICAgIGRpZ2VzdEZuLFxuICAgICAgaW50ZXJwb2xhdGlvbkNvbmZpZyxcbiAgICAgIG1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICAgICAgbWFwcGVyRmFjdG9yeSxcbiAgICAgIGNvbnNvbGVcbiAgICApO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgdHJhbnNsYXRpb24gYXMgSFRNTCBub2RlcyBmcm9tIHRoZSBnaXZlbiBzb3VyY2UgbWVzc2FnZS5cbiAgZ2V0KHNyY01zZzogaTE4bi5NZXNzYWdlLCBwYXJhbXMpOiBodG1sLk5vZGVbXSB7XG4gICAgY29uc3QgaHRtbFJlcyA9IHRoaXMuaTE4blRvSHRtbC5jb252ZXJ0KHNyY01zZywgcGFyYW1zKTtcbiAgICBpZiAoaHRtbFJlcy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoaHRtbFJlcy5lcnJvcnMuam9pbihcIlxcblwiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxSZXMubm9kZXM7XG4gIH1cblxuICBoYXMoc3JjTXNnOiBpMThuLk1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaWdlc3Qoc3JjTXNnKSBpbiB0aGlzLmkxOG5Ob2Rlc0J5TXNnSWQ7XG4gIH1cbn1cblxuY2xhc3MgSTE4blRvSHRtbFZpc2l0b3IgaW1wbGVtZW50cyBpMThuLlZpc2l0b3Ige1xuICBwcml2YXRlIF9zcmNNc2c6IGkxOG4uTWVzc2FnZTtcbiAgcHJpdmF0ZSBfY29udGV4dFN0YWNrOiB7bXNnOiBpMThuLk1lc3NhZ2U7IG1hcHBlcjogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nfVtdID0gW107XG4gIHByaXZhdGUgX2Vycm9yczogSTE4bkVycm9yW10gPSBbXTtcbiAgcHJpdmF0ZSBfbWFwcGVyOiAobmFtZTogc3RyaW5nKSA9PiBzdHJpbmc7XG4gIHByaXZhdGUgX3BhcmFtczoge1trZXk6IHN0cmluZ106IGFueX07XG4gIHByaXZhdGUgX3BhcmFtS2V5czogc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfaTE4bk5vZGVzQnlNc2dJZDoge1ttc2dJZDogc3RyaW5nXTogaTE4bi5Ob2RlW119ID0ge30sXG4gICAgcHJpdmF0ZSBfZGlnZXN0OiAobTogaTE4bi5NZXNzYWdlKSA9PiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfbWFwcGVyRmFjdG9yeTogKG06IGkxOG4uTWVzc2FnZSkgPT4gUGxhY2Vob2xkZXJNYXBwZXIsXG4gICAgcHJpdmF0ZSBfbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k6IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICAgIHByaXZhdGUgX2ludGVycG9sYXRpb25Db25maWc/OiBJbnRlcnBvbGF0aW9uQ29uZmlnLFxuICAgIHByaXZhdGUgX2NvbnNvbGU/OiBDb25zb2xlXG4gICkge31cblxuICBjb252ZXJ0KHNyY01zZzogaTE4bi5NZXNzYWdlLCBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KToge25vZGVzOiBodG1sLk5vZGVbXTsgZXJyb3JzOiBJMThuRXJyb3JbXX0ge1xuICAgIHRoaXMuX2NvbnRleHRTdGFjay5sZW5ndGggPSAwO1xuICAgIHRoaXMuX2Vycm9ycy5sZW5ndGggPSAwO1xuICAgIHRoaXMuX3BhcmFtcyA9IHBhcmFtcztcbiAgICB0aGlzLl9wYXJhbUtleXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpO1xuXG4gICAgLy8gaTE4biB0byB0ZXh0XG4gICAgY29uc3QgdGV4dCA9IHRoaXMuY29udmVydFRvVGV4dChzcmNNc2cpO1xuXG4gICAgLy8gdGV4dCB0byBodG1sXG4gICAgY29uc3QgdXJsID0gc3JjTXNnLm5vZGVzWzBdLnNvdXJjZVNwYW4uc3RhcnQuZmlsZS51cmw7XG4gICAgY29uc3QgaHRtbFBhcnNlciA9IG5ldyBIdG1sUGFyc2VyKCkucGFyc2UodGV4dCwgdXJsLCB0cnVlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBub2RlczogaHRtbFBhcnNlci5yb290Tm9kZXMsXG4gICAgICBlcnJvcnM6IFsuLi50aGlzLl9lcnJvcnMsIC4uLmh0bWxQYXJzZXIuZXJyb3JzXVxuICAgIH07XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogaTE4bi5UZXh0LCBjb250ZXh0PzogYW55KTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGV4dC52YWx1ZTtcbiAgfVxuXG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogaTE4bi5Db250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBjb250YWluZXIuY2hpbGRyZW4ubWFwKG4gPT4gbi52aXNpdCh0aGlzKSkuam9pbihcIlwiKTtcbiAgfVxuXG4gIHZpc2l0SWN1KGljdTogaTE4bi5JY3UsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGNhc2VzID0gT2JqZWN0LmtleXMoaWN1LmNhc2VzKS5tYXAoayA9PiBgJHtrfSB7JHtpY3UuY2FzZXNba10udmlzaXQodGhpcyl9fWApO1xuXG4gICAgLy8gVE9ETyh2aWNiKTogT25jZSBhbGwgZm9ybWF0IHN3aXRjaCB0byB1c2luZyBleHByZXNzaW9uIHBsYWNlaG9sZGVyc1xuICAgIC8vIHdlIHNob3VsZCB0aHJvdyB3aGVuIHRoZSBwbGFjZWhvbGRlciBpcyBub3QgaW4gdGhlIHNvdXJjZSBtZXNzYWdlXG4gICAgY29uc3QgZXhwID0gdGhpcy5fc3JjTXNnLnBsYWNlaG9sZGVycy5oYXNPd25Qcm9wZXJ0eShpY3UuZXhwcmVzc2lvbilcbiAgICAgID8gdGhpcy5fc3JjTXNnLnBsYWNlaG9sZGVyc1tpY3UuZXhwcmVzc2lvbl1cbiAgICAgIDogaWN1LmV4cHJlc3Npb247XG5cbiAgICByZXR1cm4gYHske2V4cH0sICR7aWN1LnR5cGV9LCAke2Nhc2VzLmpvaW4oXCIgXCIpfX1gO1xuICB9XG5cbiAgdmlzaXRQbGFjZWhvbGRlcihwaDogaTE4bi5QbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHN0cmluZyB7XG4gICAgY29uc3QgcGhOYW1lID0gdGhpcy5fbWFwcGVyKHBoLm5hbWUpO1xuICAgIGlmICh0aGlzLl9zcmNNc2cucGxhY2Vob2xkZXJzLmhhc093blByb3BlcnR5KHBoTmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUb1ZhbHVlKHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlcnNbcGhOYW1lXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlclRvTWVzc2FnZS5oYXNPd25Qcm9wZXJ0eShwaE5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9UZXh0KHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlclRvTWVzc2FnZVtwaE5hbWVdKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRFcnJvcihwaCwgYFVua25vd24gcGxhY2Vob2xkZXIgXCIke3BoLm5hbWV9XCJgKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuXG4gIC8vIExvYWRlZCBtZXNzYWdlIGNvbnRhaW5zIG9ubHkgcGxhY2Vob2xkZXJzICh2cyB0YWcgYW5kIGljdSBwbGFjZWhvbGRlcnMpLlxuICAvLyBIb3dldmVyIHdoZW4gYSB0cmFuc2xhdGlvbiBjYW4gbm90IGJlIGZvdW5kLCB3ZSBuZWVkIHRvIHNlcmlhbGl6ZSB0aGUgc291cmNlIG1lc3NhZ2VcbiAgLy8gd2hpY2ggY2FuIGNvbnRhaW4gdGFnIHBsYWNlaG9sZGVyc1xuICB2aXNpdFRhZ1BsYWNlaG9sZGVyKHBoOiBpMThuLlRhZ1BsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogc3RyaW5nIHtcbiAgICBjb25zdCB0YWcgPSBgJHtwaC50YWd9YDtcbiAgICBjb25zdCBhdHRycyA9IE9iamVjdC5rZXlzKHBoLmF0dHJzKVxuICAgICAgLm1hcChuYW1lID0+IGAke25hbWV9PVwiJHtwaC5hdHRyc1tuYW1lXX1cImApXG4gICAgICAuam9pbihcIiBcIik7XG4gICAgaWYgKHBoLmlzVm9pZCkge1xuICAgICAgcmV0dXJuIGA8JHt0YWd9ICR7YXR0cnN9Lz5gO1xuICAgIH1cbiAgICBjb25zdCBjaGlsZHJlbiA9IHBoLmNoaWxkcmVuLm1hcCgoYzogaTE4bi5Ob2RlKSA9PiBjLnZpc2l0KHRoaXMpKS5qb2luKFwiXCIpO1xuICAgIHJldHVybiBgPCR7dGFnfSAke2F0dHJzfT4ke2NoaWxkcmVufTwvJHt0YWd9PmA7XG4gIH1cblxuICAvLyBMb2FkZWQgbWVzc2FnZSBjb250YWlucyBvbmx5IHBsYWNlaG9sZGVycyAodnMgdGFnIGFuZCBpY3UgcGxhY2Vob2xkZXJzKS5cbiAgLy8gSG93ZXZlciB3aGVuIGEgdHJhbnNsYXRpb24gY2FuIG5vdCBiZSBmb3VuZCwgd2UgbmVlZCB0byBzZXJpYWxpemUgdGhlIHNvdXJjZSBtZXNzYWdlXG4gIC8vIHdoaWNoIGNhbiBjb250YWluIHRhZyBwbGFjZWhvbGRlcnNcbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IHN0cmluZyB7XG4gICAgLy8gQW4gSUNVIHBsYWNlaG9sZGVyIHJlZmVyZW5jZXMgdGhlIHNvdXJjZSBtZXNzYWdlIHRvIGJlIHNlcmlhbGl6ZWRcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0VG9UZXh0KHRoaXMuX3NyY01zZy5wbGFjZWhvbGRlclRvTWVzc2FnZVtwaC5uYW1lXSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCBhIHNvdXJjZSBtZXNzYWdlIHRvIGEgdHJhbnNsYXRlZCB0ZXh0IHN0cmluZzpcbiAgICogLSB0ZXh0IG5vZGVzIGFyZSByZXBsYWNlZCB3aXRoIHRoZWlyIHRyYW5zbGF0aW9uLFxuICAgKiAtIHBsYWNlaG9sZGVycyBhcmUgcmVwbGFjZWQgd2l0aCB0aGVpciBjb250ZW50LFxuICAgKiAtIElDVSBub2RlcyBhcmUgY29udmVydGVkIHRvIElDVSBleHByZXNzaW9ucy5cbiAgICovXG4gIHByaXZhdGUgY29udmVydFRvVGV4dChzcmNNc2c6IGkxOG4uTWVzc2FnZSk6IHN0cmluZyB7XG4gICAgY29uc3QgaWQgPSB0aGlzLl9kaWdlc3Qoc3JjTXNnKTtcblxuICAgIGNvbnN0IG1hcHBlciA9IHRoaXMuX21hcHBlckZhY3RvcnkgPyB0aGlzLl9tYXBwZXJGYWN0b3J5KHNyY01zZykgOiBudWxsO1xuICAgIGxldCBub2RlczogaTE4bi5Ob2RlW107XG5cbiAgICB0aGlzLl9jb250ZXh0U3RhY2sucHVzaCh7bXNnOiB0aGlzLl9zcmNNc2csIG1hcHBlcjogdGhpcy5fbWFwcGVyfSk7XG4gICAgdGhpcy5fc3JjTXNnID0gc3JjTXNnO1xuXG4gICAgaWYgKHRoaXMuX2kxOG5Ob2Rlc0J5TXNnSWQuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgICAvLyBXaGVuIHRoZXJlIGlzIGEgdHJhbnNsYXRpb24gdXNlIGl0cyBub2RlcyBhcyB0aGUgc291cmNlXG4gICAgICAvLyBBbmQgY3JlYXRlIGEgbWFwcGVyIHRvIGNvbnZlcnQgc2VyaWFsaXplZCBwbGFjZWhvbGRlciBuYW1lcyB0byBpbnRlcm5hbCBuYW1lc1xuICAgICAgbm9kZXMgPSB0aGlzLl9pMThuTm9kZXNCeU1zZ0lkW2lkXTtcbiAgICAgIHRoaXMuX21hcHBlciA9IChuYW1lOiBzdHJpbmcpID0+IChtYXBwZXIgPyBtYXBwZXIudG9JbnRlcm5hbE5hbWUobmFtZSkhIDogbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFdoZW4gbm8gdHJhbnNsYXRpb24gaGFzIGJlZW4gZm91bmRcbiAgICAgIC8vIC0gcmVwb3J0IGFuIGVycm9yIC8gYSB3YXJuaW5nIC8gbm90aGluZyxcbiAgICAgIC8vIC0gdXNlIHRoZSBub2RlcyBmcm9tIHRoZSBvcmlnaW5hbCBtZXNzYWdlXG4gICAgICAvLyAtIHBsYWNlaG9sZGVycyBhcmUgYWxyZWFkeSBpbnRlcm5hbCBhbmQgbmVlZCBubyBtYXBwZXJcbiAgICAgIGlmICh0aGlzLl9taXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9PT0gTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kuRXJyb3IpIHtcbiAgICAgICAgdGhpcy5fYWRkRXJyb3Ioc3JjTXNnLm5vZGVzWzBdLCBgTWlzc2luZyB0cmFuc2xhdGlvbiBmb3IgbWVzc2FnZSBcIiR7aWR9XCJgKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fY29uc29sZSAmJiB0aGlzLl9taXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9PT0gTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kuV2FybmluZykge1xuICAgICAgICB0aGlzLl9jb25zb2xlLndhcm4oYE1pc3NpbmcgdHJhbnNsYXRpb24gZm9yIG1lc3NhZ2UgXCIke2lkfVwiYCk7XG4gICAgICB9XG4gICAgICBub2RlcyA9IHNyY01zZy5ub2RlcztcbiAgICAgIHRoaXMuX21hcHBlciA9IChuYW1lOiBzdHJpbmcpID0+IG5hbWU7XG4gICAgfVxuICAgIGNvbnN0IHRleHQgPSBub2Rlcy5tYXAobm9kZSA9PiBub2RlLnZpc2l0KHRoaXMpKS5qb2luKFwiXCIpO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLl9jb250ZXh0U3RhY2sucG9wKCkhO1xuICAgIHRoaXMuX3NyY01zZyA9IGNvbnRleHQubXNnO1xuICAgIHRoaXMuX21hcHBlciA9IGNvbnRleHQubWFwcGVyO1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0VG9WYWx1ZShwbGFjZWhvbGRlcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBwYXJhbSA9IHBsYWNlaG9sZGVyLnJlcGxhY2UodGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZy5zdGFydCwgXCJcIikucmVwbGFjZSh0aGlzLl9pbnRlcnBvbGF0aW9uQ29uZmlnLmVuZCwgXCJcIik7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmFtS2V5cy5pbmRleE9mKHBhcmFtKSAhPT0gLTEgPyB0aGlzLl9wYXJhbXNbcGFyYW1dIDogcGxhY2Vob2xkZXI7XG4gIH1cblxuICBwcml2YXRlIF9hZGRFcnJvcihlbDogaTE4bi5Ob2RlLCBtc2c6IHN0cmluZykge1xuICAgIHRoaXMuX2Vycm9ycy5wdXNoKG5ldyBJMThuRXJyb3IoZWwuc291cmNlU3BhbiwgbXNnKSk7XG4gIH1cbn1cblxuZW51bSBWaXNpdG9yTW9kZSB7XG4gIEV4dHJhY3QsXG4gIE1lcmdlXG59XG5cbi8qKlxuICogVGhpcyBWaXNpdG9yIGlzIHVzZWQ6XG4gKiAxLiB0byBleHRyYWN0IGFsbCB0aGUgdHJhbnNsYXRhYmxlIHN0cmluZ3MgZnJvbSBhbiBodG1sIEFTVCAoc2VlIGBleHRyYWN0KClgKSxcbiAqIDIuIHRvIHJlcGxhY2UgdGhlIHRyYW5zbGF0YWJsZSBzdHJpbmdzIHdpdGggdGhlIGFjdHVhbCB0cmFuc2xhdGlvbnMgKHNlZSBgbWVyZ2UoKWApXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIFZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIGRlcHRoOiBudW1iZXI7XG5cbiAgLy8gPGVsIGkxOG4+Li4uPC9lbD5cbiAgcHJpdmF0ZSBpbkkxOG5Ob2RlOiBib29sZWFuO1xuICBwcml2YXRlIGluSW1wbGljaXROb2RlOiBib29sZWFuO1xuXG4gIC8vIDwhLS1pMThuLS0+Li4uPCEtLS9pMThuLS0+XG4gIHByaXZhdGUgaW5JMThuQmxvY2s6IGJvb2xlYW47XG4gIHByaXZhdGUgYmxvY2tDaGlsZHJlbjogaHRtbC5Ob2RlW10gPSBbXTtcbiAgcHJpdmF0ZSBibG9ja1N0YXJ0RGVwdGg6IG51bWJlcjtcblxuICAvLyB7PGljdSBtZXNzYWdlPn1cbiAgcHJpdmF0ZSBpbkljdTogYm9vbGVhbjtcblxuICAvLyBzZXQgdG8gdm9pZCAwIHdoZW4gbm90IGluIGEgc2VjdGlvblxuICBwcml2YXRlIG1zZ0NvdW50QXRTZWN0aW9uU3RhcnQ6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBlcnJvcnM6IEkxOG5FcnJvcltdO1xuICBwcml2YXRlIG1vZGU6IFZpc2l0b3JNb2RlO1xuXG4gIC8vIFZpc2l0b3JNb2RlLkV4dHJhY3Qgb25seVxuICBwcml2YXRlIG1lc3NhZ2VzOiBpMThuLk1lc3NhZ2VbXTtcblxuICAvLyBWaXNpdG9yTW9kZS5NZXJnZSBvbmx5XG4gIHByaXZhdGUgdHJhbnNsYXRpb25zOiBUcmFuc2xhdGlvbkJ1bmRsZTtcbiAgcHJpdmF0ZSBjcmVhdGVJMThuTWVzc2FnZTogKG1zZzogaHRtbC5Ob2RlW10sIG1lYW5pbmc6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgaWQ6IHN0cmluZykgPT4gaTE4bi5NZXNzYWdlO1xuICBwcml2YXRlIG1ldGFkYXRhOiBNZXNzYWdlTWV0YWRhdGE7XG4gIHByaXZhdGUgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9pbXBsaWNpdFRhZ3M6IHN0cmluZ1tdID0gW10pIHt9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIHRoZSBtZXNzYWdlcyBmcm9tIHRoZSB0cmVlXG4gICAqL1xuICBleHRyYWN0KG5vZGU6IGh0bWwuTm9kZSwgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyk6IEV4dHJhY3Rpb25SZXN1bHQge1xuICAgIHRoaXMuaW5pdChWaXNpdG9yTW9kZS5FeHRyYWN0LCBpbnRlcnBvbGF0aW9uQ29uZmlnKTtcblxuICAgIG5vZGUudmlzaXQodGhpcywgbnVsbCk7XG5cbiAgICBpZiAodGhpcy5pbkkxOG5CbG9jaykge1xuICAgICAgdGhpcy5fcmVwb3J0RXJyb3Iobm9kZSwgXCJVbmNsb3NlZCBibG9ja1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEV4dHJhY3Rpb25SZXN1bHQodGhpcy5tZXNzYWdlcywgdGhpcy5lcnJvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB0cmVlIHdoZXJlIGFsbCB0cmFuc2xhdGFibGUgbm9kZXMgYXJlIHRyYW5zbGF0ZWRcbiAgICovXG4gIG1lcmdlKFxuICAgIG5vZGU6IGh0bWwuTm9kZSxcbiAgICB0cmFuc2xhdGlvbnM6IFRyYW5zbGF0aW9uQnVuZGxlLFxuICAgIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcsXG4gICAgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICBtZXRhZGF0YTogTWVzc2FnZU1ldGFkYXRhID0ge31cbiAgKTogUGFyc2VUcmVlUmVzdWx0IHtcbiAgICB0aGlzLmluaXQoVmlzaXRvck1vZGUuTWVyZ2UsIGludGVycG9sYXRpb25Db25maWcsIHBhcmFtcyk7XG4gICAgdGhpcy50cmFuc2xhdGlvbnMgPSB0cmFuc2xhdGlvbnM7XG4gICAgdGhpcy5tZXRhZGF0YSA9IG1ldGFkYXRhO1xuXG4gICAgY29uc3QgdHJhbnNsYXRlZE5vZGUgPSBub2RlLnZpc2l0KHRoaXMsIG51bGwpO1xuXG4gICAgaWYgKHRoaXMuaW5JMThuQmxvY2spIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKG5vZGUsIFwiVW5jbG9zZWQgYmxvY2tcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQYXJzZVRyZWVSZXN1bHQodHJhbnNsYXRlZE5vZGUuY2hpbGRyZW4sIHRoaXMuZXJyb3JzKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShpY3VDYXNlOiBodG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgLy8gUGFyc2UgY2FzZXMgZm9yIHRyYW5zbGF0YWJsZSBodG1sIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBleHByZXNzaW9uID0gaHRtbC52aXNpdEFsbCh0aGlzLCBpY3VDYXNlLmV4cHJlc3Npb24sIGNvbnRleHQpO1xuXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuTWVyZ2UpIHtcbiAgICAgIHJldHVybiBuZXcgaHRtbC5FeHBhbnNpb25DYXNlKFxuICAgICAgICBpY3VDYXNlLnZhbHVlLFxuICAgICAgICBleHByZXNzaW9uLFxuICAgICAgICBpY3VDYXNlLnNvdXJjZVNwYW4sXG4gICAgICAgIGljdUNhc2UudmFsdWVTb3VyY2VTcGFuLFxuICAgICAgICBpY3VDYXNlLmV4cFNvdXJjZVNwYW5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oaWN1OiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogaHRtbC5FeHBhbnNpb24ge1xuICAgIHRoaXMubWF5QmVBZGRCbG9ja0NoaWxkcmVuKGljdSk7XG5cbiAgICBjb25zdCB3YXNJbkljdSA9IHRoaXMuaW5JY3U7XG5cbiAgICBpZiAoIXRoaXMuaW5JY3UpIHtcbiAgICAgIC8vIG5lc3RlZCBJQ1UgbWVzc2FnZXMgc2hvdWxkIG5vdCBiZSBleHRyYWN0ZWQgYnV0IHRvcC1sZXZlbCB0cmFuc2xhdGVkIGFzIGEgd2hvbGVcbiAgICAgIGlmICh0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKSB7XG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZShbaWN1XSk7XG4gICAgICB9XG4gICAgICB0aGlzLmluSWN1ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjYXNlcyA9IGh0bWwudmlzaXRBbGwodGhpcywgaWN1LmNhc2VzLCBjb250ZXh0KTtcblxuICAgIGlmICh0aGlzLm1vZGUgPT09IFZpc2l0b3JNb2RlLk1lcmdlKSB7XG4gICAgICBpY3UgPSBuZXcgaHRtbC5FeHBhbnNpb24oaWN1LnN3aXRjaFZhbHVlLCBpY3UudHlwZSwgY2FzZXMsIGljdS5zb3VyY2VTcGFuLCBpY3Uuc3dpdGNoVmFsdWVTb3VyY2VTcGFuKTtcbiAgICB9XG5cbiAgICB0aGlzLmluSWN1ID0gd2FzSW5JY3U7XG5cbiAgICByZXR1cm4gaWN1O1xuICB9XG5cbiAgdmlzaXRDb21tZW50KGNvbW1lbnQ6IGh0bWwuQ29tbWVudCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogaHRtbC5UZXh0LCBjb250ZXh0OiBhbnkpOiBodG1sLlRleHQge1xuICAgIGlmICh0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uKSB7XG4gICAgICB0aGlzLm1heUJlQWRkQmxvY2tDaGlsZHJlbih0ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWw6IGh0bWwuRWxlbWVudCwgY29udGV4dDogYW55KTogaHRtbC5FbGVtZW50IHwgbnVsbCB7XG4gICAgdGhpcy5tYXlCZUFkZEJsb2NrQ2hpbGRyZW4oZWwpO1xuICAgIHRoaXMuZGVwdGgrKztcbiAgICBjb25zdCB3YXNJbkkxOG5Ob2RlID0gdGhpcy5pbkkxOG5Ob2RlO1xuICAgIGNvbnN0IHdhc0luSW1wbGljaXROb2RlID0gdGhpcy5pbkltcGxpY2l0Tm9kZTtcbiAgICBsZXQgY2hpbGROb2RlczogaHRtbC5Ob2RlW10gPSBbXTtcbiAgICBsZXQgdHJhbnNsYXRlZENoaWxkTm9kZXM6IGh0bWwuTm9kZVtdID0gdW5kZWZpbmVkITtcblxuICAgIC8vIEV4dHJhY3Q6XG4gICAgLy8gLSB0b3AgbGV2ZWwgbm9kZXMgd2l0aCB0aGUgKGltcGxpY2l0KSBcImkxOG5cIiBhdHRyaWJ1dGUgaWYgbm90IGFscmVhZHkgaW4gYSBzZWN0aW9uXG4gICAgLy8gLSBJQ1UgbWVzc2FnZXNcbiAgICBjb25zdCBpMThuQXR0ciA9IGdldEkxOG5BdHRyKGVsKTtcbiAgICBjb25zdCBpc0ltcGxpY2l0ID0gdGhpcy5faW1wbGljaXRUYWdzLnNvbWUodGFnID0+IGVsLm5hbWUgPT09IHRhZykgJiYgIXRoaXMuaW5JY3UgJiYgIXRoaXMuaXNJblRyYW5zbGF0YWJsZVNlY3Rpb247XG4gICAgY29uc3QgaXNUb3BMZXZlbEltcGxpY2l0ID0gIXdhc0luSW1wbGljaXROb2RlICYmIGlzSW1wbGljaXQ7XG4gICAgdGhpcy5pbkltcGxpY2l0Tm9kZSA9IHdhc0luSW1wbGljaXROb2RlIHx8IGlzSW1wbGljaXQ7XG4gICAgaWYgKCF0aGlzLmlzSW5UcmFuc2xhdGFibGVTZWN0aW9uICYmICF0aGlzLmluSWN1KSB7XG4gICAgICBpZiAoaTE4bkF0dHIgfHwgaXNUb3BMZXZlbEltcGxpY2l0KSB7XG4gICAgICAgIHRoaXMuaW5JMThuTm9kZSA9IHRydWU7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLmFkZE1lc3NhZ2UoZWwuY2hpbGRyZW4sIHRoaXMubWV0YWRhdGEpITtcbiAgICAgICAgdHJhbnNsYXRlZENoaWxkTm9kZXMgPSB0aGlzLnRyYW5zbGF0ZU1lc3NhZ2UoZWwsIG1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tb2RlID09PSBWaXNpdG9yTW9kZS5FeHRyYWN0KSB7XG4gICAgICAgIGNvbnN0IGlzVHJhbnNsYXRhYmxlID0gaTE4bkF0dHIgfHwgaXNUb3BMZXZlbEltcGxpY2l0O1xuICAgICAgICBpZiAoaXNUcmFuc2xhdGFibGUpIHtcbiAgICAgICAgICB0aGlzLm9wZW5UcmFuc2xhdGFibGVTZWN0aW9uKGVsKTtcbiAgICAgICAgfVxuICAgICAgICBodG1sLnZpc2l0QWxsKHRoaXMsIGVsLmNoaWxkcmVuKTtcbiAgICAgICAgaWYgKGlzVHJhbnNsYXRhYmxlKSB7XG4gICAgICAgICAgdGhpcy5fY2xvc2VUcmFuc2xhdGFibGVTZWN0aW9uKGVsLCBlbC5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGkxOG5BdHRyIHx8IGlzVG9wTGV2ZWxJbXBsaWNpdCkge1xuICAgICAgICB0aGlzLl9yZXBvcnRFcnJvcihlbCwgXCJDb3VsZCBub3QgbWFyayBhbiBlbGVtZW50IGFzIHRyYW5zbGF0YWJsZSBpbnNpZGUgYSB0cmFuc2xhdGFibGUgc2VjdGlvblwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuRXh0cmFjdCkge1xuICAgICAgICAvLyBEZXNjZW5kIGludG8gY2hpbGQgbm9kZXMgZm9yIGV4dHJhY3Rpb25cbiAgICAgICAgaHRtbC52aXNpdEFsbCh0aGlzLCBlbC5jaGlsZHJlbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuTWVyZ2UpIHtcbiAgICAgIGNvbnN0IHZpc2l0Tm9kZXMgPSB0cmFuc2xhdGVkQ2hpbGROb2RlcyB8fCBlbC5jaGlsZHJlbjtcbiAgICAgIHZpc2l0Tm9kZXMuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIGNvbnN0IHZpc2l0ZWQgPSBjaGlsZC52aXNpdCh0aGlzLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHZpc2l0ZWQgJiYgIXRoaXMuaXNJblRyYW5zbGF0YWJsZVNlY3Rpb24pIHtcbiAgICAgICAgICAvLyBEbyBub3QgYWRkIHRoZSBjaGlsZHJlbiBmcm9tIHRyYW5zbGF0YWJsZSBzZWN0aW9ucyAoPSBpMThuIGJsb2NrcyBoZXJlKVxuICAgICAgICAgIC8vIFRoZXkgd2lsbCBiZSBhZGRlZCBsYXRlciBpbiB0aGlzIGxvb3Agd2hlbiB0aGUgYmxvY2sgY2xvc2VzIChpLmUuIG9uIGA8IS0tIC9pMThuIC0tPmApXG4gICAgICAgICAgY2hpbGROb2RlcyA9IGNoaWxkTm9kZXMuY29uY2F0KHZpc2l0ZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRlcHRoLS07XG4gICAgdGhpcy5pbkkxOG5Ob2RlID0gd2FzSW5JMThuTm9kZTtcbiAgICB0aGlzLmluSW1wbGljaXROb2RlID0gd2FzSW5JbXBsaWNpdE5vZGU7XG5cbiAgICBpZiAodGhpcy5tb2RlID09PSBWaXNpdG9yTW9kZS5NZXJnZSkge1xuICAgICAgcmV0dXJuIG5ldyBodG1sLkVsZW1lbnQoZWwubmFtZSwgW10sIGNoaWxkTm9kZXMsIGVsLnNvdXJjZVNwYW4sIGVsLnN0YXJ0U291cmNlU3BhbiwgZWwuZW5kU291cmNlU3Bhbik7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bnJlYWNoYWJsZSBjb2RlXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0KG1vZGU6IFZpc2l0b3JNb2RlLCBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnLCBwYXJhbXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgIHRoaXMuaW5JMThuQmxvY2sgPSBmYWxzZTtcbiAgICB0aGlzLmluSTE4bk5vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmRlcHRoID0gMDtcbiAgICB0aGlzLmluSWN1ID0gZmFsc2U7XG4gICAgdGhpcy5tc2dDb3VudEF0U2VjdGlvblN0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdO1xuICAgIHRoaXMuaW5JbXBsaWNpdE5vZGUgPSBmYWxzZTtcbiAgICB0aGlzLmNyZWF0ZUkxOG5NZXNzYWdlID0gY3JlYXRlSTE4bk1lc3NhZ2VGYWN0b3J5KGludGVycG9sYXRpb25Db25maWcpO1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICB9XG5cbiAgLy8gYWRkIGEgdHJhbnNsYXRhYmxlIG1lc3NhZ2VcbiAgcHJpdmF0ZSBhZGRNZXNzYWdlKGFzdDogaHRtbC5Ob2RlW10sIHttZWFuaW5nID0gXCJcIiwgZGVzY3JpcHRpb24gPSBcIlwiLCBpZCA9IFwiXCJ9ID0ge30pOiBpMThuLk1lc3NhZ2UgfCBudWxsIHtcbiAgICBpZiAoXG4gICAgICBhc3QubGVuZ3RoID09PSAwIHx8XG4gICAgICAoYXN0Lmxlbmd0aCA9PT0gMSAmJiBhc3RbMF0gaW5zdGFuY2VvZiBodG1sLkF0dHJpYnV0ZSAmJiAhKGFzdFswXSBhcyBodG1sLkF0dHJpYnV0ZSkudmFsdWUpXG4gICAgKSB7XG4gICAgICAvLyBEbyBub3QgY3JlYXRlIGVtcHR5IG1lc3NhZ2VzXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5jcmVhdGVJMThuTWVzc2FnZShhc3QsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZCk7XG4gICAgdGhpcy5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpO1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG5cbiAgLy8gVHJhbnNsYXRlcyB0aGUgZ2l2ZW4gbWVzc2FnZSBnaXZlbiB0aGUgYFRyYW5zbGF0aW9uQnVuZGxlYFxuICAvLyBUaGlzIGlzIHVzZWQgZm9yIHRyYW5zbGF0aW5nIGVsZW1lbnRzIC8gYmxvY2tzIC0gc2VlIGBfdHJhbnNsYXRlQXR0cmlidXRlc2AgZm9yIGF0dHJpYnV0ZXNcbiAgLy8gbm8tb3Agd2hlbiBjYWxsZWQgaW4gZXh0cmFjdGlvbiBtb2RlIChyZXR1cm5zIFtdKVxuICBwcml2YXRlIHRyYW5zbGF0ZU1lc3NhZ2UoZWw6IGh0bWwuTm9kZSwgbWVzc2FnZTogaTE4bi5NZXNzYWdlKTogaHRtbC5Ob2RlW10ge1xuICAgIGlmIChtZXNzYWdlICYmIHRoaXMubW9kZSA9PT0gVmlzaXRvck1vZGUuTWVyZ2UpIHtcbiAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy50cmFuc2xhdGlvbnMuZ2V0KG1lc3NhZ2UsIHRoaXMucGFyYW1zKTtcbiAgICAgIGlmIChub2Rlcykge1xuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKGVsLCBgVHJhbnNsYXRpb24gdW5hdmFpbGFibGUgZm9yIG1lc3NhZ2UgaWQ9XCIke3RoaXMudHJhbnNsYXRpb25zLmRpZ2VzdChtZXNzYWdlKX1cImApO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgdGhlIG5vZGUgYXMgYSBjaGlsZCBvZiB0aGUgYmxvY2sgd2hlbjpcbiAgICogLSB3ZSBhcmUgaW4gYSBibG9jayxcbiAgICogLSB3ZSBhcmUgbm90IGluc2lkZSBhIElDVSBtZXNzYWdlICh0aG9zZSBhcmUgaGFuZGxlZCBzZXBhcmF0ZWx5KSxcbiAgICogLSB0aGUgbm9kZSBpcyBhIFwiZGlyZWN0IGNoaWxkXCIgb2YgdGhlIGJsb2NrXG4gICAqL1xuICBwcml2YXRlIG1heUJlQWRkQmxvY2tDaGlsZHJlbihub2RlOiBodG1sLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbkkxOG5CbG9jayAmJiAhdGhpcy5pbkljdSAmJiB0aGlzLmRlcHRoID09PSB0aGlzLmJsb2NrU3RhcnREZXB0aCkge1xuICAgICAgdGhpcy5ibG9ja0NoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBzdGFydCBvZiBhIHNlY3Rpb24sIHNlZSBgX2Nsb3NlVHJhbnNsYXRhYmxlU2VjdGlvbmBcbiAgICovXG4gIHByaXZhdGUgb3BlblRyYW5zbGF0YWJsZVNlY3Rpb24obm9kZTogaHRtbC5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJblRyYW5zbGF0YWJsZVNlY3Rpb24pIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKG5vZGUsIFwiVW5leHBlY3RlZCBzZWN0aW9uIHN0YXJ0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1zZ0NvdW50QXRTZWN0aW9uU3RhcnQgPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQSB0cmFuc2xhdGFibGUgc2VjdGlvbiBjb3VsZCBiZTpcbiAgICogLSB0aGUgY29udGVudCBvZiB0cmFuc2xhdGFibGUgZWxlbWVudCxcbiAgICogLSBub2RlcyBiZXR3ZWVuIGA8IS0tIGkxOG4gLS0+YCBhbmQgYDwhLS0gL2kxOG4gLS0+YCBjb21tZW50c1xuICAgKi9cbiAgcHJpdmF0ZSBnZXQgaXNJblRyYW5zbGF0YWJsZVNlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubXNnQ291bnRBdFNlY3Rpb25TdGFydCAhPT0gdm9pZCAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZXMgYSBzZWN0aW9uLlxuICAgKlxuICAgKiBJZiBhIHNlY3Rpb24gaGFzIG9ubHkgb25lIHNpZ25pZmljYW50IGNoaWxkcmVuIChjb21tZW50cyBub3Qgc2lnbmlmaWNhbnQpIHRoZW4gd2Ugc2hvdWxkIG5vdFxuICAgKiBrZWVwIHRoZSBtZXNzYWdlIGZyb20gdGhpcyBjaGlsZHJlbjpcbiAgICpcbiAgICogYDxwIGkxOG49XCJtZWFuaW5nfGRlc2NyaXB0aW9uXCI+e0lDVSBtZXNzYWdlfTwvcD5gIHdvdWxkIHByb2R1Y2UgdHdvIG1lc3NhZ2VzOlxuICAgKiAtIG9uZSBmb3IgdGhlIDxwPiBjb250ZW50IHdpdGggbWVhbmluZyBhbmQgZGVzY3JpcHRpb24sXG4gICAqIC0gYW5vdGhlciBvbmUgZm9yIHRoZSBJQ1UgbWVzc2FnZS5cbiAgICpcbiAgICogSW4gdGhpcyBjYXNlIHRoZSBsYXN0IG1lc3NhZ2UgaXMgZGlzY2FyZGVkIGFzIGl0IGNvbnRhaW5zIGxlc3MgaW5mb3JtYXRpb24gKHRoZSBBU1QgaXNcbiAgICogb3RoZXJ3aXNlIGlkZW50aWNhbCkuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB3ZSBzaG91bGQgc3RpbGwga2VlcCBtZXNzYWdlcyBleHRyYWN0ZWQgZnJvbSBhdHRyaWJ1dGVzIGluc2lkZSB0aGUgc2VjdGlvbiAoaWUgaW4gdGhlXG4gICAqIElDVSBtZXNzYWdlIGhlcmUpXG4gICAqL1xuICBwcml2YXRlIF9jbG9zZVRyYW5zbGF0YWJsZVNlY3Rpb24obm9kZTogaHRtbC5Ob2RlLCBkaXJlY3RDaGlsZHJlbjogaHRtbC5Ob2RlW10pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNJblRyYW5zbGF0YWJsZVNlY3Rpb24pIHtcbiAgICAgIHRoaXMuX3JlcG9ydEVycm9yKG5vZGUsIFwiVW5leHBlY3RlZCBzZWN0aW9uIGVuZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5tc2dDb3VudEF0U2VjdGlvblN0YXJ0O1xuICAgIGNvbnN0IHNpZ25pZmljYW50Q2hpbGRyZW46IG51bWJlciA9IGRpcmVjdENoaWxkcmVuLnJlZHVjZShcbiAgICAgIChjb3VudDogbnVtYmVyLCBuOiBodG1sLk5vZGUpOiBudW1iZXIgPT4gY291bnQgKyAobiBpbnN0YW5jZW9mIGh0bWwuQ29tbWVudCA/IDAgOiAxKSxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgaWYgKHNpZ25pZmljYW50Q2hpbGRyZW4gPT09IDEpIHtcbiAgICAgIGZvciAobGV0IGkgPSB0aGlzLm1lc3NhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gc3RhcnRJbmRleCE7IGktLSkge1xuICAgICAgICBjb25zdCBhc3QgPSB0aGlzLm1lc3NhZ2VzW2ldLm5vZGVzO1xuICAgICAgICBpZiAoIShhc3QubGVuZ3RoID09PSAxICYmIGFzdFswXSBpbnN0YW5jZW9mIGkxOG4uVGV4dCkpIHtcbiAgICAgICAgICB0aGlzLm1lc3NhZ2VzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubXNnQ291bnRBdFNlY3Rpb25TdGFydCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcG9ydEVycm9yKG5vZGU6IGh0bWwuTm9kZSwgbXNnOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBJMThuRXJyb3Iobm9kZS5zb3VyY2VTcGFuISwgbXNnKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0STE4bkF0dHIocDogaHRtbC5FbGVtZW50KTogaHRtbC5BdHRyaWJ1dGUgfCBudWxsIHtcbiAgcmV0dXJuIHAuYXR0cnMuZmluZChhdHRyID0+IGF0dHIubmFtZSA9PT0gX0kxOE5fQVRUUikgfHwgbnVsbDtcbn1cbiJdfQ==