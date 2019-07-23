/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var /**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
ParseLocation = /** @class */ (function () {
    function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    /**
     * @return {?}
     */
    ParseLocation.prototype.toString = /**
     * @return {?}
     */
    function () {
        return this.offset != null ? this.line + ":" + this.col : "";
    };
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    ParseLocation.prototype.getContext = /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    function (maxChars, maxLines) {
        var /** @type {?} */ content = this.file.content;
        var /** @type {?} */ startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            var /** @type {?} */ endOffset = startOffset;
            var /** @type {?} */ ctxChars = 0;
            var /** @type {?} */ ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] === "\n") {
                    if (++ctxLines === maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] === "\n") {
                    if (++ctxLines === maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1)
            };
        }
        return null;
    };
    return ParseLocation;
}());
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { ParseLocation };
function ParseLocation_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseLocation.prototype.file;
    /** @type {?} */
    ParseLocation.prototype.offset;
    /** @type {?} */
    ParseLocation.prototype.line;
    /** @type {?} */
    ParseLocation.prototype.col;
}
var ParseSourceFile = /** @class */ (function () {
    function ParseSourceFile(content, url) {
        if (url === void 0) { url = ""; }
        this.content = content;
        this.url = url;
    }
    return ParseSourceFile;
}());
export { ParseSourceFile };
function ParseSourceFile_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSourceFile.prototype.content;
    /** @type {?} */
    ParseSourceFile.prototype.url;
}
var ParseSourceSpan = /** @class */ (function () {
    function ParseSourceSpan(start, end, details) {
        if (details === void 0) { details = null; }
        this.start = start;
        this.end = end;
        this.details = details;
    }
    /**
     * @return {?}
     */
    ParseSourceSpan.prototype.toString = /**
     * @return {?}
     */
    function () {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    };
    return ParseSourceSpan;
}());
export { ParseSourceSpan };
function ParseSourceSpan_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSourceSpan.prototype.start;
    /** @type {?} */
    ParseSourceSpan.prototype.end;
    /** @type {?} */
    ParseSourceSpan.prototype.details;
}
/** @enum {number} */
var ParseErrorLevel = {
    WARNING: 0,
    ERROR: 1,
};
export { ParseErrorLevel };
ParseErrorLevel[ParseErrorLevel.WARNING] = "WARNING";
ParseErrorLevel[ParseErrorLevel.ERROR] = "ERROR";
var ParseError = /** @class */ (function () {
    function ParseError(span, msg, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    /**
     * @return {?}
     */
    ParseError.prototype.contextualMessage = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ ctx = this.span.start.getContext(100, 3);
        return ctx ? " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" : "";
    };
    /**
     * @return {?}
     */
    ParseError.prototype.toString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ details = this.span.details ? ", " + this.span.details : "";
        return "" + this.msg + this.contextualMessage() + ": " + this.span.start + details;
    };
    return ParseError;
}());
export { ParseError };
function ParseError_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseError.prototype.span;
    /** @type {?} */
    ParseError.prototype.msg;
    /** @type {?} */
    ParseError.prototype.level;
}
/**
 * An i18n error.
 */
var /**
 * An i18n error.
 */
I18nError = /** @class */ (function (_super) {
    tslib_1.__extends(I18nError, _super);
    function I18nError(span, msg) {
        return _super.call(this, span, msg) || this;
    }
    return I18nError;
}(ParseError));
/**
 * An i18n error.
 */
export { I18nError };
/**
 * @param {?} s
 * @return {?}
 */
export function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvYXN0L3BhcnNlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7QUFBQTtJQUNFLHVCQUFtQixJQUFxQixFQUFTLE1BQWMsRUFBUyxJQUFZLEVBQVMsR0FBVztRQUFyRixTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtLQUFJOzs7O0lBRTVHLGdDQUFROzs7SUFBUjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUksSUFBSSxDQUFDLElBQUksU0FBSSxJQUFJLENBQUMsR0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDOUQ7SUFFRCx3Q0FBd0M7SUFDeEMsOERBQThEOzs7Ozs7SUFDOUQsa0NBQVU7Ozs7O0lBQVYsVUFBVyxRQUFnQixFQUFFLFFBQWdCO1FBQzNDLHFCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxxQkFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFDRCxxQkFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDO1lBQzVCLHFCQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDakIscUJBQUksUUFBUSxHQUFHLENB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QUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNsRSxNQUFNLENBQUMsS0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxVQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQVMsQ0FBQztLQUMvRTtxQkEvRkg7SUFnR0MsQ0FBQTtBQWhCRCxzQkFnQkM7Ozs7Ozs7Ozs7OztBQUtEOzs7QUFBQTtJQUErQixxQ0FBVTtJQUN2QyxtQkFBWSxJQUFxQixFQUFFLEdBQVc7ZUFDNUMsa0JBQU0sSUFBSSxFQUFFLEdBQUcsQ0FBQztLQUNqQjtvQkF4R0g7RUFxRytCLFVBQVUsRUFJeEMsQ0FBQTs7OztBQUpELHFCQUlDOzs7OztBQUVELE1BQU0sdUJBQXVCLENBQVM7SUFDcEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7Q0FDeEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0kxOG5EZWZ9IGZyb20gXCIuLi9pMThuLXBvbHlmaWxsXCI7XG5cbi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IGNsYXNzIFBhcnNlTG9jYXRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZmlsZTogUGFyc2VTb3VyY2VGaWxlLCBwdWJsaWMgb2Zmc2V0OiBudW1iZXIsIHB1YmxpYyBsaW5lOiBudW1iZXIsIHB1YmxpYyBjb2w6IG51bWJlcikge31cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm9mZnNldCAhPSBudWxsID8gYCR7dGhpcy5saW5lfToke3RoaXMuY29sfWAgOiBcIlwiO1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBzb3VyY2UgYXJvdW5kIHRoZSBsb2NhdGlvblxuICAvLyBVcCB0byBgbWF4Q2hhcnNgIG9yIGBtYXhMaW5lc2Agb24gZWFjaCBzaWRlIG9mIHRoZSBsb2NhdGlvblxuICBnZXRDb250ZXh0KG1heENoYXJzOiBudW1iZXIsIG1heExpbmVzOiBudW1iZXIpOiB7YmVmb3JlOiBzdHJpbmc7IGFmdGVyOiBzdHJpbmd9IHwgbnVsbCB7XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuZmlsZS5jb250ZW50O1xuICAgIGxldCBzdGFydE9mZnNldCA9IHRoaXMub2Zmc2V0O1xuXG4gICAgaWYgKHN0YXJ0T2Zmc2V0ICE9IG51bGwpIHtcbiAgICAgIGlmIChzdGFydE9mZnNldCA+IGNvbnRlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICBzdGFydE9mZnNldCA9IGNvbnRlbnQubGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICAgIGxldCBlbmRPZmZzZXQgPSBzdGFydE9mZnNldDtcbiAgICAgIGxldCBjdHhDaGFycyA9IDA7XG4gICAgICBsZXQgY3R4TGluZXMgPSAwO1xuXG4gICAgICB3aGlsZSAoY3R4Q2hhcnMgPCBtYXhDaGFycyAmJiBzdGFydE9mZnNldCA+IDApIHtcbiAgICAgICAgc3RhcnRPZmZzZXQtLTtcbiAgICAgICAgY3R4Q2hhcnMrKztcbiAgICAgICAgaWYgKGNvbnRlbnRbc3RhcnRPZmZzZXRdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgaWYgKCsrY3R4TGluZXMgPT09IG1heExpbmVzKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3R4Q2hhcnMgPSAwO1xuICAgICAgY3R4TGluZXMgPSAwO1xuICAgICAgd2hpbGUgKGN0eENoYXJzIDwgbWF4Q2hhcnMgJiYgZW5kT2Zmc2V0IDwgY29udGVudC5sZW5ndGggLSAxKSB7XG4gICAgICAgIGVuZE9mZnNldCsrO1xuICAgICAgICBjdHhDaGFycysrO1xuICAgICAgICBpZiAoY29udGVudFtlbmRPZmZzZXRdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgaWYgKCsrY3R4TGluZXMgPT09IG1heExpbmVzKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgYmVmb3JlOiBjb250ZW50LnN1YnN0cmluZyhzdGFydE9mZnNldCwgdGhpcy5vZmZzZXQpLFxuICAgICAgICBhZnRlcjogY29udGVudC5zdWJzdHJpbmcodGhpcy5vZmZzZXQsIGVuZE9mZnNldCArIDEpXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZUZpbGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGVudDogc3RyaW5nLCBwdWJsaWMgdXJsID0gXCJcIikge31cbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlU291cmNlU3BhbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzdGFydDogUGFyc2VMb2NhdGlvbiwgcHVibGljIGVuZDogUGFyc2VMb2NhdGlvbiwgcHVibGljIGRldGFpbHM6IHN0cmluZyB8IG51bGwgPSBudWxsKSB7fVxuXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuc3RhcnQuZmlsZS5jb250ZW50LnN1YnN0cmluZyh0aGlzLnN0YXJ0Lm9mZnNldCwgdGhpcy5lbmQub2Zmc2V0KTtcbiAgfVxufVxuXG5leHBvcnQgZW51bSBQYXJzZUVycm9yTGV2ZWwge1xuICBXQVJOSU5HLFxuICBFUlJPUlxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIG1zZzogc3RyaW5nLFxuICAgIHB1YmxpYyBsZXZlbDogUGFyc2VFcnJvckxldmVsID0gUGFyc2VFcnJvckxldmVsLkVSUk9SXG4gICkge31cblxuICBjb250ZXh0dWFsTWVzc2FnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuc3Bhbi5zdGFydC5nZXRDb250ZXh0KDEwMCwgMyk7XG4gICAgcmV0dXJuIGN0eCA/IGAgKFwiJHtjdHguYmVmb3JlfVske1BhcnNlRXJyb3JMZXZlbFt0aGlzLmxldmVsXX0gLT5dJHtjdHguYWZ0ZXJ9XCIpYCA6IFwiXCI7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIGNvbnN0IGRldGFpbHMgPSB0aGlzLnNwYW4uZGV0YWlscyA/IGAsICR7dGhpcy5zcGFuLmRldGFpbHN9YCA6IFwiXCI7XG4gICAgcmV0dXJuIGAke3RoaXMubXNnfSR7dGhpcy5jb250ZXh0dWFsTWVzc2FnZSgpfTogJHt0aGlzLnNwYW4uc3RhcnR9JHtkZXRhaWxzfWA7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBpMThuIGVycm9yLlxuICovXG5leHBvcnQgY2xhc3MgSTE4bkVycm9yIGV4dGVuZHMgUGFyc2VFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU291cmNlU3BhbiwgbXNnOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzcGFuLCBtc2cpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoczogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHMucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgXCJcXFxcJDFcIik7XG59XG4iXX0=