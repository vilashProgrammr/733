/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as html from "../ast/ast";
import * as i18n from "../ast/i18n_ast";
import { Parser } from "./parser";
import { Lexer } from "./lexer";
import { PlaceholderRegistry } from "../serializers/placeholder";
import { getHtmlTagDefinition } from "../ast/html_tags";
var /** @type {?} */ _expParser = new Parser(new Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 * @param {?} interpolationConfig
 * @return {?}
 */
export function createI18nMessageFactory(interpolationConfig) {
    var /** @type {?} */ visitor = new I18nVisitor(_expParser, interpolationConfig);
    return function (nodes, meaning, description, id) {
        return visitor.toI18nMessage(nodes, meaning, description, id);
    };
}
var I18nVisitor = /** @class */ (function () {
    function I18nVisitor(_expressionParser, _interpolationConfig) {
        this._expressionParser = _expressionParser;
        this._interpolationConfig = _interpolationConfig;
    }
    /**
     * @param {?} nodes
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     * @return {?}
     */
    I18nVisitor.prototype.toI18nMessage = /**
     * @param {?} nodes
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     * @return {?}
     */
    function (nodes, meaning, description, id) {
        this._isIcu = nodes.length === 1 && nodes[0] instanceof html.Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        var /** @type {?} */ i18nodes = html.visitAll(this, nodes, {});
        return new i18n.Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    };
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitElement = /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    function (el, context) {
        var /** @type {?} */ children = html.visitAll(this, el.children);
        var /** @type {?} */ attrs = {};
        el.attrs.forEach(function (attr) {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        var /** @type {?} */ isVoid = getHtmlTagDefinition(el.name).isVoid;
        var /** @type {?} */ startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = el.sourceSpan ? /** @type {?} */ ((el.sourceSpan)).toString() : "";
        var /** @type {?} */ closePhName = "";
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = "</" + el.name + ">";
        }
        return new i18n.TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, /** @type {?} */ ((el.sourceSpan)));
    };
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitAttribute = /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    function (attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        return this._visitTextWithInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
    };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitComment = /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    function (comment, context) {
        return null;
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitExpansion = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        this._icuDepth++;
        var /** @type {?} */ i18nIcuCases = {};
        var /** @type {?} */ i18nIcu = new i18n.Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach(function (caze) {
            i18nIcuCases[caze.value] = new i18n.Container(caze.expression.map(function (node) { return node.visit(_this, {}); }), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            var /** @type {?} */ expPh = this._placeholderRegistry.getUniquePlaceholder("VAR_" + icu.type);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations. We need to create a new visitor (they are not re-entrant) to compute the
        // message id.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        var /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName("ICU", icu.sourceSpan.toString());
        var /** @type {?} */ visitor = new I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], "", "", "");
        return new i18n.IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    };
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    I18nVisitor.prototype.visitExpansionCase = /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    function (icuCase, context) {
        throw new Error("Unreachable code");
    };
    /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    I18nVisitor.prototype._visitTextWithInterpolation = /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    function (text, sourceSpan) {
        var /** @type {?} */ splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new i18n.Text(text, sourceSpan);
        }
        // Return a group of text + expressions
        var /** @type {?} */ nodes = [];
        var /** @type {?} */ container = new i18n.Container(nodes, sourceSpan);
        var _a = this._interpolationConfig, sDelimiter = _a.start, eDelimiter = _a.end;
        for (var /** @type {?} */ i = 0; i < splitInterpolation.strings.length - 1; i++) {
            var /** @type {?} */ expression = splitInterpolation.expressions[i];
            var /** @type {?} */ baseName = extractPlaceholderName(expression) || "INTERPOLATION";
            var /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new i18n.Text(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new i18n.Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        // The last index contains no expression
        var /** @type {?} */ lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new i18n.Text(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    };
    return I18nVisitor;
}());
function I18nVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    I18nVisitor.prototype._isIcu;
    /** @type {?} */
    I18nVisitor.prototype._icuDepth;
    /** @type {?} */
    I18nVisitor.prototype._placeholderRegistry;
    /** @type {?} */
    I18nVisitor.prototype._placeholderToContent;
    /** @type {?} */
    I18nVisitor.prototype._placeholderToMessage;
    /** @type {?} */
    I18nVisitor.prototype._expressionParser;
    /** @type {?} */
    I18nVisitor.prototype._interpolationConfig;
}
var /** @type {?} */ _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
/**
 * @param {?} input
 * @return {?}
 */
function extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvcGFyc2VyL2kxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxJQUFJLE1BQU0saUJBQWlCLENBQUM7QUFFeEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR3RELHFCQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OztBQUszQyxNQUFNLG1DQUNKLG1CQUF3QztJQUV4QyxxQkFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLFVBQUMsS0FBa0IsRUFBRSxPQUFlLEVBQUUsV0FBbUIsRUFBRSxFQUFVO1FBQzFFLE9BQUEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7SUFBdEQsQ0FBc0QsQ0FBQztDQUMxRDtBQUVELElBQUE7SUFPRSxxQkFBb0IsaUJBQXlCLEVBQVUsb0JBQXlDO1FBQTVFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBUTtRQUFVLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBcUI7S0FBSTs7Ozs7Ozs7SUFFN0YsbUNBQWE7Ozs7Ozs7Y0FBQyxLQUFrQixFQUFFLE9BQWUsRUFBRSxXQUFtQixFQUFFLEVBQVU7UUFDdkYsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENB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Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUQscUJBQU0sY0FBYyxHQUFHLDZFQUE2RSxDQUFDOzs7OztBQUVyRyxnQ0FBZ0MsS0FBYTtJQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGh0bWwgZnJvbSBcIi4uL2FzdC9hc3RcIjtcbmltcG9ydCAqIGFzIGkxOG4gZnJvbSBcIi4uL2FzdC9pMThuX2FzdFwiO1xuaW1wb3J0IHtJbnRlcnBvbGF0aW9uQ29uZmlnfSBmcm9tIFwiLi4vYXN0L2ludGVycG9sYXRpb25fY29uZmlnXCI7XG5pbXBvcnQge1BhcnNlcn0gZnJvbSBcIi4vcGFyc2VyXCI7XG5pbXBvcnQge0xleGVyfSBmcm9tIFwiLi9sZXhlclwiO1xuaW1wb3J0IHtQbGFjZWhvbGRlclJlZ2lzdHJ5fSBmcm9tIFwiLi4vc2VyaWFsaXplcnMvcGxhY2Vob2xkZXJcIjtcbmltcG9ydCB7Z2V0SHRtbFRhZ0RlZmluaXRpb259IGZyb20gXCIuLi9hc3QvaHRtbF90YWdzXCI7XG5pbXBvcnQge1BhcnNlU291cmNlU3Bhbn0gZnJvbSBcIi4uL2FzdC9wYXJzZV91dGlsXCI7XG5cbmNvbnN0IF9leHBQYXJzZXIgPSBuZXcgUGFyc2VyKG5ldyBMZXhlcigpKTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gY29udmVydGluZyBodG1sIG5vZGVzIHRvIGFuIGkxOG4gTWVzc2FnZSBnaXZlbiBhbiBpbnRlcnBvbGF0aW9uQ29uZmlnXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJMThuTWVzc2FnZUZhY3RvcnkoXG4gIGludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWdcbik6IChub2RlczogaHRtbC5Ob2RlW10sIG1lYW5pbmc6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgaWQ6IHN0cmluZykgPT4gaTE4bi5NZXNzYWdlIHtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBJMThuVmlzaXRvcihfZXhwUGFyc2VyLCBpbnRlcnBvbGF0aW9uQ29uZmlnKTtcblxuICByZXR1cm4gKG5vZGVzOiBodG1sLk5vZGVbXSwgbWVhbmluZzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpZDogc3RyaW5nKSA9PlxuICAgIHZpc2l0b3IudG9JMThuTWVzc2FnZShub2RlcywgbWVhbmluZywgZGVzY3JpcHRpb24sIGlkKTtcbn1cblxuY2xhc3MgSTE4blZpc2l0b3IgaW1wbGVtZW50cyBodG1sLlZpc2l0b3Ige1xuICBwcml2YXRlIF9pc0ljdTogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfaWN1RGVwdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJSZWdpc3RyeTogUGxhY2Vob2xkZXJSZWdpc3RyeTtcbiAgcHJpdmF0ZSBfcGxhY2Vob2xkZXJUb0NvbnRlbnQ6IHtbcGhOYW1lOiBzdHJpbmddOiBzdHJpbmd9O1xuICBwcml2YXRlIF9wbGFjZWhvbGRlclRvTWVzc2FnZToge1twaE5hbWU6IHN0cmluZ106IGkxOG4uTWVzc2FnZX07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZXhwcmVzc2lvblBhcnNlcjogUGFyc2VyLCBwcml2YXRlIF9pbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnKSB7fVxuXG4gIHB1YmxpYyB0b0kxOG5NZXNzYWdlKG5vZGVzOiBodG1sLk5vZGVbXSwgbWVhbmluZzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpZDogc3RyaW5nKTogaTE4bi5NZXNzYWdlIHtcbiAgICB0aGlzLl9pc0ljdSA9IG5vZGVzLmxlbmd0aCA9PT0gMSAmJiBub2Rlc1swXSBpbnN0YW5jZW9mIGh0bWwuRXhwYW5zaW9uO1xuICAgIHRoaXMuX2ljdURlcHRoID0gMDtcbiAgICB0aGlzLl9wbGFjZWhvbGRlclJlZ2lzdHJ5ID0gbmV3IFBsYWNlaG9sZGVyUmVnaXN0cnkoKTtcbiAgICB0aGlzLl9wbGFjZWhvbGRlclRvQ29udGVudCA9IHt9O1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9NZXNzYWdlID0ge307XG5cbiAgICBjb25zdCBpMThub2RlczogaTE4bi5Ob2RlW10gPSBodG1sLnZpc2l0QWxsKHRoaXMsIG5vZGVzLCB7fSk7XG5cbiAgICByZXR1cm4gbmV3IGkxOG4uTWVzc2FnZShpMThub2RlcywgdGhpcy5fcGxhY2Vob2xkZXJUb0NvbnRlbnQsIHRoaXMuX3BsYWNlaG9sZGVyVG9NZXNzYWdlLCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWQpO1xuICB9XG5cbiAgdmlzaXRFbGVtZW50KGVsOiBodG1sLkVsZW1lbnQsIGNvbnRleHQ6IGFueSk6IGkxOG4uTm9kZSB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBodG1sLnZpc2l0QWxsKHRoaXMsIGVsLmNoaWxkcmVuKTtcbiAgICBjb25zdCBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG4gICAgZWwuYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICAgIC8vIERvIG5vdCB2aXNpdCB0aGUgYXR0cmlidXRlcywgdHJhbnNsYXRhYmxlIG9uZXMgYXJlIHRvcC1sZXZlbCBBU1RzXG4gICAgICBhdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGlzVm9pZDogYm9vbGVhbiA9IGdldEh0bWxUYWdEZWZpbml0aW9uKGVsLm5hbWUpLmlzVm9pZDtcbiAgICBjb25zdCBzdGFydFBoTmFtZSA9IHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkuZ2V0U3RhcnRUYWdQbGFjZWhvbGRlck5hbWUoZWwubmFtZSwgYXR0cnMsIGlzVm9pZCk7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJUb0NvbnRlbnRbc3RhcnRQaE5hbWVdID0gZWwuc291cmNlU3BhbiA/IGVsLnNvdXJjZVNwYW4hLnRvU3RyaW5nKCkgOiBcIlwiO1xuXG4gICAgbGV0IGNsb3NlUGhOYW1lID0gXCJcIjtcblxuICAgIGlmICghaXNWb2lkKSB7XG4gICAgICBjbG9zZVBoTmFtZSA9IHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkuZ2V0Q2xvc2VUYWdQbGFjZWhvbGRlck5hbWUoZWwubmFtZSk7XG4gICAgICB0aGlzLl9wbGFjZWhvbGRlclRvQ29udGVudFtjbG9zZVBoTmFtZV0gPSBgPC8ke2VsLm5hbWV9PmA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBpMThuLlRhZ1BsYWNlaG9sZGVyKGVsLm5hbWUsIGF0dHJzLCBzdGFydFBoTmFtZSwgY2xvc2VQaE5hbWUsIGNoaWxkcmVuLCBpc1ZvaWQsIGVsLnNvdXJjZVNwYW4hKTtcbiAgfVxuXG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogaHRtbC5BdHRyaWJ1dGUsIGNvbnRleHQ6IGFueSk6IGkxOG4uTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2l0VGV4dFdpdGhJbnRlcnBvbGF0aW9uKGF0dHJpYnV0ZS52YWx1ZSwgYXR0cmlidXRlLnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRUZXh0KHRleHQ6IGh0bWwuVGV4dCwgY29udGV4dDogYW55KTogaTE4bi5Ob2RlIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaXRUZXh0V2l0aEludGVycG9sYXRpb24odGV4dC52YWx1ZSwgdGV4dC5zb3VyY2VTcGFuISk7XG4gIH1cblxuICB2aXNpdENvbW1lbnQoY29tbWVudDogaHRtbC5Db21tZW50LCBjb250ZXh0OiBhbnkpOiBpMThuLk5vZGUgfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uKGljdTogaHRtbC5FeHBhbnNpb24sIGNvbnRleHQ6IGFueSk6IGkxOG4uTm9kZSB7XG4gICAgdGhpcy5faWN1RGVwdGgrKztcbiAgICBjb25zdCBpMThuSWN1Q2FzZXM6IHtbazogc3RyaW5nXTogaTE4bi5Ob2RlfSA9IHt9O1xuICAgIGNvbnN0IGkxOG5JY3UgPSBuZXcgaTE4bi5JY3UoaWN1LnN3aXRjaFZhbHVlLCBpY3UudHlwZSwgaTE4bkljdUNhc2VzLCBpY3Uuc291cmNlU3Bhbik7XG4gICAgaWN1LmNhc2VzLmZvckVhY2goKGNhemUpOiB2b2lkID0+IHtcbiAgICAgIGkxOG5JY3VDYXNlc1tjYXplLnZhbHVlXSA9IG5ldyBpMThuLkNvbnRhaW5lcihcbiAgICAgICAgY2F6ZS5leHByZXNzaW9uLm1hcChub2RlID0+IG5vZGUudmlzaXQodGhpcywge30pKSxcbiAgICAgICAgY2F6ZS5leHBTb3VyY2VTcGFuXG4gICAgICApO1xuICAgIH0pO1xuICAgIHRoaXMuX2ljdURlcHRoLS07XG5cbiAgICBpZiAodGhpcy5faXNJY3UgfHwgdGhpcy5faWN1RGVwdGggPiAwKSB7XG4gICAgICAvLyBSZXR1cm5zIGFuIElDVSBub2RlIHdoZW46XG4gICAgICAvLyAtIHRoZSBtZXNzYWdlICh2cyBhIHBhcnQgb2YgdGhlIG1lc3NhZ2UpIGlzIGFuIElDVSBtZXNzYWdlLCBvclxuICAgICAgLy8gLSB0aGUgSUNVIG1lc3NhZ2UgaXMgbmVzdGVkLlxuICAgICAgY29uc3QgZXhwUGggPSB0aGlzLl9wbGFjZWhvbGRlclJlZ2lzdHJ5LmdldFVuaXF1ZVBsYWNlaG9sZGVyKGBWQVJfJHtpY3UudHlwZX1gKTtcbiAgICAgIGkxOG5JY3UuZXhwcmVzc2lvblBsYWNlaG9sZGVyID0gZXhwUGg7XG4gICAgICB0aGlzLl9wbGFjZWhvbGRlclRvQ29udGVudFtleHBQaF0gPSBpY3Uuc3dpdGNoVmFsdWU7XG5cbiAgICAgIHJldHVybiBpMThuSWN1O1xuICAgIH1cblxuICAgIC8vIEVsc2UgcmV0dXJucyBhIHBsYWNlaG9sZGVyXG4gICAgLy8gSUNVIHBsYWNlaG9sZGVycyBzaG91bGQgbm90IGJlIHJlcGxhY2VkIHdpdGggdGhlaXIgb3JpZ2luYWwgY29udGVudCBidXQgd2l0aCB0aGUgdGhlaXJcbiAgICAvLyB0cmFuc2xhdGlvbnMuIFdlIG5lZWQgdG8gY3JlYXRlIGEgbmV3IHZpc2l0b3IgKHRoZXkgYXJlIG5vdCByZS1lbnRyYW50KSB0byBjb21wdXRlIHRoZVxuICAgIC8vIG1lc3NhZ2UgaWQuXG4gICAgLy8gVE9ETyh2aWNiKTogYWRkIGEgaHRtbC5Ob2RlIC0+IGkxOG4uTWVzc2FnZSBjYWNoZSB0byBhdm9pZCBoYXZpbmcgdG8gcmUtY3JlYXRlIHRoZSBtc2dcbiAgICBjb25zdCBwaE5hbWUgPSB0aGlzLl9wbGFjZWhvbGRlclJlZ2lzdHJ5LmdldFBsYWNlaG9sZGVyTmFtZShcIklDVVwiLCBpY3Uuc291cmNlU3Bhbi50b1N0cmluZygpKTtcbiAgICBjb25zdCB2aXNpdG9yID0gbmV3IEkxOG5WaXNpdG9yKHRoaXMuX2V4cHJlc3Npb25QYXJzZXIsIHRoaXMuX2ludGVycG9sYXRpb25Db25maWcpO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9NZXNzYWdlW3BoTmFtZV0gPSB2aXNpdG9yLnRvSTE4bk1lc3NhZ2UoW2ljdV0sIFwiXCIsIFwiXCIsIFwiXCIpO1xuICAgIHJldHVybiBuZXcgaTE4bi5JY3VQbGFjZWhvbGRlcihpMThuSWN1LCBwaE5hbWUsIGljdS5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShpY3VDYXNlOiBodG1sLkV4cGFuc2lvbkNhc2UsIGNvbnRleHQ6IGFueSk6IGkxOG4uTm9kZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5yZWFjaGFibGUgY29kZVwiKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0VGV4dFdpdGhJbnRlcnBvbGF0aW9uKHRleHQ6IHN0cmluZywgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKTogaTE4bi5Ob2RlIHtcbiAgICBjb25zdCBzcGxpdEludGVycG9sYXRpb24gPSB0aGlzLl9leHByZXNzaW9uUGFyc2VyLnNwbGl0SW50ZXJwb2xhdGlvbihcbiAgICAgIHRleHQsXG4gICAgICBzb3VyY2VTcGFuLnN0YXJ0LnRvU3RyaW5nKCksXG4gICAgICB0aGlzLl9pbnRlcnBvbGF0aW9uQ29uZmlnXG4gICAgKTtcblxuICAgIGlmICghc3BsaXRJbnRlcnBvbGF0aW9uKSB7XG4gICAgICAvLyBObyBleHByZXNzaW9uLCByZXR1cm4gYSBzaW5nbGUgdGV4dFxuICAgICAgcmV0dXJuIG5ldyBpMThuLlRleHQodGV4dCwgc291cmNlU3Bhbik7XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGEgZ3JvdXAgb2YgdGV4dCArIGV4cHJlc3Npb25zXG4gICAgY29uc3Qgbm9kZXM6IGkxOG4uTm9kZVtdID0gW107XG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IGkxOG4uQ29udGFpbmVyKG5vZGVzLCBzb3VyY2VTcGFuKTtcbiAgICBjb25zdCB7c3RhcnQ6IHNEZWxpbWl0ZXIsIGVuZDogZURlbGltaXRlcn0gPSB0aGlzLl9pbnRlcnBvbGF0aW9uQ29uZmlnO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpdEludGVycG9sYXRpb24uc3RyaW5ncy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGNvbnN0IGV4cHJlc3Npb24gPSBzcGxpdEludGVycG9sYXRpb24uZXhwcmVzc2lvbnNbaV07XG4gICAgICBjb25zdCBiYXNlTmFtZSA9IGV4dHJhY3RQbGFjZWhvbGRlck5hbWUoZXhwcmVzc2lvbikgfHwgXCJJTlRFUlBPTEFUSU9OXCI7XG4gICAgICBjb25zdCBwaE5hbWUgPSB0aGlzLl9wbGFjZWhvbGRlclJlZ2lzdHJ5LmdldFBsYWNlaG9sZGVyTmFtZShiYXNlTmFtZSwgZXhwcmVzc2lvbik7XG5cbiAgICAgIGlmIChzcGxpdEludGVycG9sYXRpb24uc3RyaW5nc1tpXS5sZW5ndGgpIHtcbiAgICAgICAgLy8gTm8gbmVlZCB0byBhZGQgZW1wdHkgc3RyaW5nc1xuICAgICAgICBub2Rlcy5wdXNoKG5ldyBpMThuLlRleHQoc3BsaXRJbnRlcnBvbGF0aW9uLnN0cmluZ3NbaV0sIHNvdXJjZVNwYW4pKTtcbiAgICAgIH1cblxuICAgICAgbm9kZXMucHVzaChuZXcgaTE4bi5QbGFjZWhvbGRlcihleHByZXNzaW9uLCBwaE5hbWUsIHNvdXJjZVNwYW4pKTtcbiAgICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9Db250ZW50W3BoTmFtZV0gPSBzRGVsaW1pdGVyICsgZXhwcmVzc2lvbiArIGVEZWxpbWl0ZXI7XG4gICAgfVxuXG4gICAgLy8gVGhlIGxhc3QgaW5kZXggY29udGFpbnMgbm8gZXhwcmVzc2lvblxuICAgIGNvbnN0IGxhc3RTdHJpbmdJZHggPSBzcGxpdEludGVycG9sYXRpb24uc3RyaW5ncy5sZW5ndGggLSAxO1xuICAgIGlmIChzcGxpdEludGVycG9sYXRpb24uc3RyaW5nc1tsYXN0U3RyaW5nSWR4XS5sZW5ndGgpIHtcbiAgICAgIG5vZGVzLnB1c2gobmV3IGkxOG4uVGV4dChzcGxpdEludGVycG9sYXRpb24uc3RyaW5nc1tsYXN0U3RyaW5nSWR4XSwgc291cmNlU3BhbikpO1xuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG59XG5cbmNvbnN0IF9DVVNUT01fUEhfRVhQID0gL1xcL1xcL1tcXHNcXFNdKmkxOG5bXFxzXFxTXSpcXChbXFxzXFxTXSpwaFtcXHNcXFNdKj1bXFxzXFxTXSooXCJ8JykoW1xcc1xcU10qPylcXDFbXFxzXFxTXSpcXCkvZztcblxuZnVuY3Rpb24gZXh0cmFjdFBsYWNlaG9sZGVyTmFtZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGlucHV0LnNwbGl0KF9DVVNUT01fUEhfRVhQKVsyXTtcbn1cbiJdfQ==