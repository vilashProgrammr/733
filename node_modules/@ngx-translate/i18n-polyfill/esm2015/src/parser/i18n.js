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
const /** @type {?} */ _expParser = new Parser(new Lexer());
/**
 * Returns a function converting html nodes to an i18n Message given an interpolationConfig
 * @param {?} interpolationConfig
 * @return {?}
 */
export function createI18nMessageFactory(interpolationConfig) {
    const /** @type {?} */ visitor = new I18nVisitor(_expParser, interpolationConfig);
    return (nodes, meaning, description, id) => visitor.toI18nMessage(nodes, meaning, description, id);
}
class I18nVisitor {
    /**
     * @param {?} _expressionParser
     * @param {?} _interpolationConfig
     */
    constructor(_expressionParser, _interpolationConfig) {
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
    toI18nMessage(nodes, meaning, description, id) {
        this._isIcu = nodes.length === 1 && nodes[0] instanceof html.Expansion;
        this._icuDepth = 0;
        this._placeholderRegistry = new PlaceholderRegistry();
        this._placeholderToContent = {};
        this._placeholderToMessage = {};
        const /** @type {?} */ i18nodes = html.visitAll(this, nodes, {});
        return new i18n.Message(i18nodes, this._placeholderToContent, this._placeholderToMessage, meaning, description, id);
    }
    /**
     * @param {?} el
     * @param {?} context
     * @return {?}
     */
    visitElement(el, context) {
        const /** @type {?} */ children = html.visitAll(this, el.children);
        const /** @type {?} */ attrs = {};
        el.attrs.forEach(attr => {
            // Do not visit the attributes, translatable ones are top-level ASTs
            attrs[attr.name] = attr.value;
        });
        const /** @type {?} */ isVoid = getHtmlTagDefinition(el.name).isVoid;
        const /** @type {?} */ startPhName = this._placeholderRegistry.getStartTagPlaceholderName(el.name, attrs, isVoid);
        this._placeholderToContent[startPhName] = el.sourceSpan ? /** @type {?} */ ((el.sourceSpan)).toString() : "";
        let /** @type {?} */ closePhName = "";
        if (!isVoid) {
            closePhName = this._placeholderRegistry.getCloseTagPlaceholderName(el.name);
            this._placeholderToContent[closePhName] = `</${el.name}>`;
        }
        return new i18n.TagPlaceholder(el.name, attrs, startPhName, closePhName, children, isVoid, /** @type {?} */ ((el.sourceSpan)));
    }
    /**
     * @param {?} attribute
     * @param {?} context
     * @return {?}
     */
    visitAttribute(attribute, context) {
        return this._visitTextWithInterpolation(attribute.value, attribute.sourceSpan);
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    visitText(text, context) {
        return this._visitTextWithInterpolation(text.value, /** @type {?} */ ((text.sourceSpan)));
    }
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    visitComment(comment, context) {
        return null;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    visitExpansion(icu, context) {
        this._icuDepth++;
        const /** @type {?} */ i18nIcuCases = {};
        const /** @type {?} */ i18nIcu = new i18n.Icu(icu.switchValue, icu.type, i18nIcuCases, icu.sourceSpan);
        icu.cases.forEach((caze) => {
            i18nIcuCases[caze.value] = new i18n.Container(caze.expression.map(node => node.visit(this, {})), caze.expSourceSpan);
        });
        this._icuDepth--;
        if (this._isIcu || this._icuDepth > 0) {
            // Returns an ICU node when:
            // - the message (vs a part of the message) is an ICU message, or
            // - the ICU message is nested.
            const /** @type {?} */ expPh = this._placeholderRegistry.getUniquePlaceholder(`VAR_${icu.type}`);
            i18nIcu.expressionPlaceholder = expPh;
            this._placeholderToContent[expPh] = icu.switchValue;
            return i18nIcu;
        }
        // Else returns a placeholder
        // ICU placeholders should not be replaced with their original content but with the their
        // translations. We need to create a new visitor (they are not re-entrant) to compute the
        // message id.
        // TODO(vicb): add a html.Node -> i18n.Message cache to avoid having to re-create the msg
        const /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName("ICU", icu.sourceSpan.toString());
        const /** @type {?} */ visitor = new I18nVisitor(this._expressionParser, this._interpolationConfig);
        this._placeholderToMessage[phName] = visitor.toI18nMessage([icu], "", "", "");
        return new i18n.IcuPlaceholder(i18nIcu, phName, icu.sourceSpan);
    }
    /**
     * @param {?} icuCase
     * @param {?} context
     * @return {?}
     */
    visitExpansionCase(icuCase, context) {
        throw new Error("Unreachable code");
    }
    /**
     * @param {?} text
     * @param {?} sourceSpan
     * @return {?}
     */
    _visitTextWithInterpolation(text, sourceSpan) {
        const /** @type {?} */ splitInterpolation = this._expressionParser.splitInterpolation(text, sourceSpan.start.toString(), this._interpolationConfig);
        if (!splitInterpolation) {
            // No expression, return a single text
            return new i18n.Text(text, sourceSpan);
        }
        // Return a group of text + expressions
        const /** @type {?} */ nodes = [];
        const /** @type {?} */ container = new i18n.Container(nodes, sourceSpan);
        const { start: sDelimiter, end: eDelimiter } = this._interpolationConfig;
        for (let /** @type {?} */ i = 0; i < splitInterpolation.strings.length - 1; i++) {
            const /** @type {?} */ expression = splitInterpolation.expressions[i];
            const /** @type {?} */ baseName = extractPlaceholderName(expression) || "INTERPOLATION";
            const /** @type {?} */ phName = this._placeholderRegistry.getPlaceholderName(baseName, expression);
            if (splitInterpolation.strings[i].length) {
                // No need to add empty strings
                nodes.push(new i18n.Text(splitInterpolation.strings[i], sourceSpan));
            }
            nodes.push(new i18n.Placeholder(expression, phName, sourceSpan));
            this._placeholderToContent[phName] = sDelimiter + expression + eDelimiter;
        }
        // The last index contains no expression
        const /** @type {?} */ lastStringIdx = splitInterpolation.strings.length - 1;
        if (splitInterpolation.strings[lastStringIdx].length) {
            nodes.push(new i18n.Text(splitInterpolation.strings[lastStringIdx], sourceSpan));
        }
        return container;
    }
}
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
const /** @type {?} */ _CUSTOM_PH_EXP = /\/\/[\s\S]*i18n[\s\S]*\([\s\S]*ph[\s\S]*=[\s\S]*("|')([\s\S]*?)\1[\s\S]*\)/g;
/**
 * @param {?} input
 * @return {?}
 */
function extractPlaceholderName(input) {
    return input.split(_CUSTOM_PH_EXP)[2];
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvcGFyc2VyL2kxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sS0FBSyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sS0FBSyxJQUFJLE1BQU0saUJBQWlCLENBQUM7QUFFeEMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNoQyxPQUFPLEVBQUMsS0FBSyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDRCQUE0QixDQUFDO0FBQy9ELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR3RELHVCQUFNLFVBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUM7Ozs7OztBQUszQyxNQUFNLG1DQUNKLG1CQUF3QztJQUV4Qyx1QkFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFFakUsTUFBTSxDQUFDLENBQUMsS0FBa0IsRUFBRSxPQUFlLEVBQUUsV0FBbUIsRUFBRSxFQUFVLEVBQUUsRUFBRSxDQUM5RSxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0NBQzFEO0FBRUQ7Ozs7O0lBT0UsWUFBb0IsaUJBQXlCLEVBQVUsb0JBQXlDO1FBQTVFLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBUTtRQUFVLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBcUI7S0FBSTs7Ozs7Ozs7SUFFN0YsYUFBYSxDQUFDLEtBQWtCLEVBQUUsT0FBZSxFQUFFLFdBQW1CLEVBQUUsRUFBVTtRQUN2RixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FB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O0FBRXJHLGdDQUFnQyxLQUFhO0lBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaHRtbCBmcm9tIFwiLi4vYXN0L2FzdFwiO1xuaW1wb3J0ICogYXMgaTE4biBmcm9tIFwiLi4vYXN0L2kxOG5fYXN0XCI7XG5pbXBvcnQge0ludGVycG9sYXRpb25Db25maWd9IGZyb20gXCIuLi9hc3QvaW50ZXJwb2xhdGlvbl9jb25maWdcIjtcbmltcG9ydCB7UGFyc2VyfSBmcm9tIFwiLi9wYXJzZXJcIjtcbmltcG9ydCB7TGV4ZXJ9IGZyb20gXCIuL2xleGVyXCI7XG5pbXBvcnQge1BsYWNlaG9sZGVyUmVnaXN0cnl9IGZyb20gXCIuLi9zZXJpYWxpemVycy9wbGFjZWhvbGRlclwiO1xuaW1wb3J0IHtnZXRIdG1sVGFnRGVmaW5pdGlvbn0gZnJvbSBcIi4uL2FzdC9odG1sX3RhZ3NcIjtcbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tIFwiLi4vYXN0L3BhcnNlX3V0aWxcIjtcblxuY29uc3QgX2V4cFBhcnNlciA9IG5ldyBQYXJzZXIobmV3IExleGVyKCkpO1xuXG4vKipcbiAqIFJldHVybnMgYSBmdW5jdGlvbiBjb252ZXJ0aW5nIGh0bWwgbm9kZXMgdG8gYW4gaTE4biBNZXNzYWdlIGdpdmVuIGFuIGludGVycG9sYXRpb25Db25maWdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUkxOG5NZXNzYWdlRmFjdG9yeShcbiAgaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZ1xuKTogKG5vZGVzOiBodG1sLk5vZGVbXSwgbWVhbmluZzogc3RyaW5nLCBkZXNjcmlwdGlvbjogc3RyaW5nLCBpZDogc3RyaW5nKSA9PiBpMThuLk1lc3NhZ2Uge1xuICBjb25zdCB2aXNpdG9yID0gbmV3IEkxOG5WaXNpdG9yKF9leHBQYXJzZXIsIGludGVycG9sYXRpb25Db25maWcpO1xuXG4gIHJldHVybiAobm9kZXM6IGh0bWwuTm9kZVtdLCBtZWFuaW5nOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+XG4gICAgdmlzaXRvci50b0kxOG5NZXNzYWdlKG5vZGVzLCBtZWFuaW5nLCBkZXNjcmlwdGlvbiwgaWQpO1xufVxuXG5jbGFzcyBJMThuVmlzaXRvciBpbXBsZW1lbnRzIGh0bWwuVmlzaXRvciB7XG4gIHByaXZhdGUgX2lzSWN1OiBib29sZWFuO1xuICBwcml2YXRlIF9pY3VEZXB0aDogbnVtYmVyO1xuICBwcml2YXRlIF9wbGFjZWhvbGRlclJlZ2lzdHJ5OiBQbGFjZWhvbGRlclJlZ2lzdHJ5O1xuICBwcml2YXRlIF9wbGFjZWhvbGRlclRvQ29udGVudDoge1twaE5hbWU6IHN0cmluZ106IHN0cmluZ307XG4gIHByaXZhdGUgX3BsYWNlaG9sZGVyVG9NZXNzYWdlOiB7W3BoTmFtZTogc3RyaW5nXTogaTE4bi5NZXNzYWdlfTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9leHByZXNzaW9uUGFyc2VyOiBQYXJzZXIsIHByaXZhdGUgX2ludGVycG9sYXRpb25Db25maWc6IEludGVycG9sYXRpb25Db25maWcpIHt9XG5cbiAgcHVibGljIHRvSTE4bk1lc3NhZ2Uobm9kZXM6IGh0bWwuTm9kZVtdLCBtZWFuaW5nOiBzdHJpbmcsIGRlc2NyaXB0aW9uOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBpMThuLk1lc3NhZ2Uge1xuICAgIHRoaXMuX2lzSWN1ID0gbm9kZXMubGVuZ3RoID09PSAxICYmIG5vZGVzWzBdIGluc3RhbmNlb2YgaHRtbC5FeHBhbnNpb247XG4gICAgdGhpcy5faWN1RGVwdGggPSAwO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkgPSBuZXcgUGxhY2Vob2xkZXJSZWdpc3RyeSgpO1xuICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9Db250ZW50ID0ge307XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJUb01lc3NhZ2UgPSB7fTtcblxuICAgIGNvbnN0IGkxOG5vZGVzOiBpMThuLk5vZGVbXSA9IGh0bWwudmlzaXRBbGwodGhpcywgbm9kZXMsIHt9KTtcblxuICAgIHJldHVybiBuZXcgaTE4bi5NZXNzYWdlKGkxOG5vZGVzLCB0aGlzLl9wbGFjZWhvbGRlclRvQ29udGVudCwgdGhpcy5fcGxhY2Vob2xkZXJUb01lc3NhZ2UsIG1lYW5pbmcsIGRlc2NyaXB0aW9uLCBpZCk7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoZWw6IGh0bWwuRWxlbWVudCwgY29udGV4dDogYW55KTogaTE4bi5Ob2RlIHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IGh0bWwudmlzaXRBbGwodGhpcywgZWwuY2hpbGRyZW4pO1xuICAgIGNvbnN0IGF0dHJzOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgICBlbC5hdHRycy5mb3JFYWNoKGF0dHIgPT4ge1xuICAgICAgLy8gRG8gbm90IHZpc2l0IHRoZSBhdHRyaWJ1dGVzLCB0cmFuc2xhdGFibGUgb25lcyBhcmUgdG9wLWxldmVsIEFTVHNcbiAgICAgIGF0dHJzW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xuICAgIH0pO1xuXG4gICAgY29uc3QgaXNWb2lkOiBib29sZWFuID0gZ2V0SHRtbFRhZ0RlZmluaXRpb24oZWwubmFtZSkuaXNWb2lkO1xuICAgIGNvbnN0IHN0YXJ0UGhOYW1lID0gdGhpcy5fcGxhY2Vob2xkZXJSZWdpc3RyeS5nZXRTdGFydFRhZ1BsYWNlaG9sZGVyTmFtZShlbC5uYW1lLCBhdHRycywgaXNWb2lkKTtcbiAgICB0aGlzLl9wbGFjZWhvbGRlclRvQ29udGVudFtzdGFydFBoTmFtZV0gPSBlbC5zb3VyY2VTcGFuID8gZWwuc291cmNlU3BhbiEudG9TdHJpbmcoKSA6IFwiXCI7XG5cbiAgICBsZXQgY2xvc2VQaE5hbWUgPSBcIlwiO1xuXG4gICAgaWYgKCFpc1ZvaWQpIHtcbiAgICAgIGNsb3NlUGhOYW1lID0gdGhpcy5fcGxhY2Vob2xkZXJSZWdpc3RyeS5nZXRDbG9zZVRhZ1BsYWNlaG9sZGVyTmFtZShlbC5uYW1lKTtcbiAgICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9Db250ZW50W2Nsb3NlUGhOYW1lXSA9IGA8LyR7ZWwubmFtZX0+YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGkxOG4uVGFnUGxhY2Vob2xkZXIoZWwubmFtZSwgYXR0cnMsIHN0YXJ0UGhOYW1lLCBjbG9zZVBoTmFtZSwgY2hpbGRyZW4sIGlzVm9pZCwgZWwuc291cmNlU3BhbiEpO1xuICB9XG5cbiAgdmlzaXRBdHRyaWJ1dGUoYXR0cmlidXRlOiBodG1sLkF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogaTE4bi5Ob2RlIHtcbiAgICByZXR1cm4gdGhpcy5fdmlzaXRUZXh0V2l0aEludGVycG9sYXRpb24oYXR0cmlidXRlLnZhbHVlLCBhdHRyaWJ1dGUuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdFRleHQodGV4dDogaHRtbC5UZXh0LCBjb250ZXh0OiBhbnkpOiBpMThuLk5vZGUge1xuICAgIHJldHVybiB0aGlzLl92aXNpdFRleHRXaXRoSW50ZXJwb2xhdGlvbih0ZXh0LnZhbHVlLCB0ZXh0LnNvdXJjZVNwYW4hKTtcbiAgfVxuXG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBodG1sLkNvbW1lbnQsIGNvbnRleHQ6IGFueSk6IGkxOG4uTm9kZSB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb24oaWN1OiBodG1sLkV4cGFuc2lvbiwgY29udGV4dDogYW55KTogaTE4bi5Ob2RlIHtcbiAgICB0aGlzLl9pY3VEZXB0aCsrO1xuICAgIGNvbnN0IGkxOG5JY3VDYXNlczoge1trOiBzdHJpbmddOiBpMThuLk5vZGV9ID0ge307XG4gICAgY29uc3QgaTE4bkljdSA9IG5ldyBpMThuLkljdShpY3Uuc3dpdGNoVmFsdWUsIGljdS50eXBlLCBpMThuSWN1Q2FzZXMsIGljdS5zb3VyY2VTcGFuKTtcbiAgICBpY3UuY2FzZXMuZm9yRWFjaCgoY2F6ZSk6IHZvaWQgPT4ge1xuICAgICAgaTE4bkljdUNhc2VzW2NhemUudmFsdWVdID0gbmV3IGkxOG4uQ29udGFpbmVyKFxuICAgICAgICBjYXplLmV4cHJlc3Npb24ubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzLCB7fSkpLFxuICAgICAgICBjYXplLmV4cFNvdXJjZVNwYW5cbiAgICAgICk7XG4gICAgfSk7XG4gICAgdGhpcy5faWN1RGVwdGgtLTtcblxuICAgIGlmICh0aGlzLl9pc0ljdSB8fCB0aGlzLl9pY3VEZXB0aCA+IDApIHtcbiAgICAgIC8vIFJldHVybnMgYW4gSUNVIG5vZGUgd2hlbjpcbiAgICAgIC8vIC0gdGhlIG1lc3NhZ2UgKHZzIGEgcGFydCBvZiB0aGUgbWVzc2FnZSkgaXMgYW4gSUNVIG1lc3NhZ2UsIG9yXG4gICAgICAvLyAtIHRoZSBJQ1UgbWVzc2FnZSBpcyBuZXN0ZWQuXG4gICAgICBjb25zdCBleHBQaCA9IHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkuZ2V0VW5pcXVlUGxhY2Vob2xkZXIoYFZBUl8ke2ljdS50eXBlfWApO1xuICAgICAgaTE4bkljdS5leHByZXNzaW9uUGxhY2Vob2xkZXIgPSBleHBQaDtcbiAgICAgIHRoaXMuX3BsYWNlaG9sZGVyVG9Db250ZW50W2V4cFBoXSA9IGljdS5zd2l0Y2hWYWx1ZTtcblxuICAgICAgcmV0dXJuIGkxOG5JY3U7XG4gICAgfVxuXG4gICAgLy8gRWxzZSByZXR1cm5zIGEgcGxhY2Vob2xkZXJcbiAgICAvLyBJQ1UgcGxhY2Vob2xkZXJzIHNob3VsZCBub3QgYmUgcmVwbGFjZWQgd2l0aCB0aGVpciBvcmlnaW5hbCBjb250ZW50IGJ1dCB3aXRoIHRoZSB0aGVpclxuICAgIC8vIHRyYW5zbGF0aW9ucy4gV2UgbmVlZCB0byBjcmVhdGUgYSBuZXcgdmlzaXRvciAodGhleSBhcmUgbm90IHJlLWVudHJhbnQpIHRvIGNvbXB1dGUgdGhlXG4gICAgLy8gbWVzc2FnZSBpZC5cbiAgICAvLyBUT0RPKHZpY2IpOiBhZGQgYSBodG1sLk5vZGUgLT4gaTE4bi5NZXNzYWdlIGNhY2hlIHRvIGF2b2lkIGhhdmluZyB0byByZS1jcmVhdGUgdGhlIG1zZ1xuICAgIGNvbnN0IHBoTmFtZSA9IHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkuZ2V0UGxhY2Vob2xkZXJOYW1lKFwiSUNVXCIsIGljdS5zb3VyY2VTcGFuLnRvU3RyaW5nKCkpO1xuICAgIGNvbnN0IHZpc2l0b3IgPSBuZXcgSTE4blZpc2l0b3IodGhpcy5fZXhwcmVzc2lvblBhcnNlciwgdGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZyk7XG4gICAgdGhpcy5fcGxhY2Vob2xkZXJUb01lc3NhZ2VbcGhOYW1lXSA9IHZpc2l0b3IudG9JMThuTWVzc2FnZShbaWN1XSwgXCJcIiwgXCJcIiwgXCJcIik7XG4gICAgcmV0dXJuIG5ldyBpMThuLkljdVBsYWNlaG9sZGVyKGkxOG5JY3UsIHBoTmFtZSwgaWN1LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRFeHBhbnNpb25DYXNlKGljdUNhc2U6IGh0bWwuRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogaTE4bi5Ob2RlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlYWNoYWJsZSBjb2RlXCIpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRUZXh0V2l0aEludGVycG9sYXRpb24odGV4dDogc3RyaW5nLCBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4pOiBpMThuLk5vZGUge1xuICAgIGNvbnN0IHNwbGl0SW50ZXJwb2xhdGlvbiA9IHRoaXMuX2V4cHJlc3Npb25QYXJzZXIuc3BsaXRJbnRlcnBvbGF0aW9uKFxuICAgICAgdGV4dCxcbiAgICAgIHNvdXJjZVNwYW4uc3RhcnQudG9TdHJpbmcoKSxcbiAgICAgIHRoaXMuX2ludGVycG9sYXRpb25Db25maWdcbiAgICApO1xuXG4gICAgaWYgKCFzcGxpdEludGVycG9sYXRpb24pIHtcbiAgICAgIC8vIE5vIGV4cHJlc3Npb24sIHJldHVybiBhIHNpbmdsZSB0ZXh0XG4gICAgICByZXR1cm4gbmV3IGkxOG4uVGV4dCh0ZXh0LCBzb3VyY2VTcGFuKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBncm91cCBvZiB0ZXh0ICsgZXhwcmVzc2lvbnNcbiAgICBjb25zdCBub2RlczogaTE4bi5Ob2RlW10gPSBbXTtcbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgaTE4bi5Db250YWluZXIobm9kZXMsIHNvdXJjZVNwYW4pO1xuICAgIGNvbnN0IHtzdGFydDogc0RlbGltaXRlciwgZW5kOiBlRGVsaW1pdGVyfSA9IHRoaXMuX2ludGVycG9sYXRpb25Db25maWc7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwbGl0SW50ZXJwb2xhdGlvbi5zdHJpbmdzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgY29uc3QgZXhwcmVzc2lvbiA9IHNwbGl0SW50ZXJwb2xhdGlvbi5leHByZXNzaW9uc1tpXTtcbiAgICAgIGNvbnN0IGJhc2VOYW1lID0gZXh0cmFjdFBsYWNlaG9sZGVyTmFtZShleHByZXNzaW9uKSB8fCBcIklOVEVSUE9MQVRJT05cIjtcbiAgICAgIGNvbnN0IHBoTmFtZSA9IHRoaXMuX3BsYWNlaG9sZGVyUmVnaXN0cnkuZ2V0UGxhY2Vob2xkZXJOYW1lKGJhc2VOYW1lLCBleHByZXNzaW9uKTtcblxuICAgICAgaWYgKHNwbGl0SW50ZXJwb2xhdGlvbi5zdHJpbmdzW2ldLmxlbmd0aCkge1xuICAgICAgICAvLyBObyBuZWVkIHRvIGFkZCBlbXB0eSBzdHJpbmdzXG4gICAgICAgIG5vZGVzLnB1c2gobmV3IGkxOG4uVGV4dChzcGxpdEludGVycG9sYXRpb24uc3RyaW5nc1tpXSwgc291cmNlU3BhbikpO1xuICAgICAgfVxuXG4gICAgICBub2Rlcy5wdXNoKG5ldyBpMThuLlBsYWNlaG9sZGVyKGV4cHJlc3Npb24sIHBoTmFtZSwgc291cmNlU3BhbikpO1xuICAgICAgdGhpcy5fcGxhY2Vob2xkZXJUb0NvbnRlbnRbcGhOYW1lXSA9IHNEZWxpbWl0ZXIgKyBleHByZXNzaW9uICsgZURlbGltaXRlcjtcbiAgICB9XG5cbiAgICAvLyBUaGUgbGFzdCBpbmRleCBjb250YWlucyBubyBleHByZXNzaW9uXG4gICAgY29uc3QgbGFzdFN0cmluZ0lkeCA9IHNwbGl0SW50ZXJwb2xhdGlvbi5zdHJpbmdzLmxlbmd0aCAtIDE7XG4gICAgaWYgKHNwbGl0SW50ZXJwb2xhdGlvbi5zdHJpbmdzW2xhc3RTdHJpbmdJZHhdLmxlbmd0aCkge1xuICAgICAgbm9kZXMucHVzaChuZXcgaTE4bi5UZXh0KHNwbGl0SW50ZXJwb2xhdGlvbi5zdHJpbmdzW2xhc3RTdHJpbmdJZHhdLCBzb3VyY2VTcGFuKSk7XG4gICAgfVxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cbn1cblxuY29uc3QgX0NVU1RPTV9QSF9FWFAgPSAvXFwvXFwvW1xcc1xcU10qaTE4bltcXHNcXFNdKlxcKFtcXHNcXFNdKnBoW1xcc1xcU10qPVtcXHNcXFNdKihcInwnKShbXFxzXFxTXSo/KVxcMVtcXHNcXFNdKlxcKS9nO1xuXG5mdW5jdGlvbiBleHRyYWN0UGxhY2Vob2xkZXJOYW1lKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gaW5wdXQuc3BsaXQoX0NVU1RPTV9QSF9FWFApWzJdO1xufVxuIl19