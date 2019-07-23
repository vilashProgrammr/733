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
export class ParseLocation {
    /**
     * @param {?} file
     * @param {?} offset
     * @param {?} line
     * @param {?} col
     */
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.offset != null ? `${this.line}:${this.col}` : "";
    }
    /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    getContext(maxChars, maxLines) {
        const /** @type {?} */ content = this.file.content;
        let /** @type {?} */ startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            let /** @type {?} */ endOffset = startOffset;
            let /** @type {?} */ ctxChars = 0;
            let /** @type {?} */ ctxLines = 0;
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
    }
}
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
export class ParseSourceFile {
    /**
     * @param {?} content
     * @param {?=} url
     */
    constructor(content, url = "") {
        this.content = content;
        this.url = url;
    }
}
function ParseSourceFile_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSourceFile.prototype.content;
    /** @type {?} */
    ParseSourceFile.prototype.url;
}
export class ParseSourceSpan {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} details
     */
    constructor(start, end, details = null) {
        this.start = start;
        this.end = end;
        this.details = details;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
function ParseSourceSpan_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSourceSpan.prototype.start;
    /** @type {?} */
    ParseSourceSpan.prototype.end;
    /** @type {?} */
    ParseSourceSpan.prototype.details;
}
/** @enum {number} */
const ParseErrorLevel = {
    WARNING: 0,
    ERROR: 1,
};
export { ParseErrorLevel };
ParseErrorLevel[ParseErrorLevel.WARNING] = "WARNING";
ParseErrorLevel[ParseErrorLevel.ERROR] = "ERROR";
export class ParseError {
    /**
     * @param {?} span
     * @param {?} msg
     * @param {?=} level
     */
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    /**
     * @return {?}
     */
    contextualMessage() {
        const /** @type {?} */ ctx = this.span.start.getContext(100, 3);
        return ctx ? ` ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : "";
    }
    /**
     * @return {?}
     */
    toString() {
        const /** @type {?} */ details = this.span.details ? `, ${this.span.details}` : "";
        return `${this.msg}${this.contextualMessage()}: ${this.span.start}${details}`;
    }
}
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
export class I18nError extends ParseError {
    /**
     * @param {?} span
     * @param {?} msg
     */
    constructor(span, msg) {
        super(span, msg);
    }
}
/**
 * @param {?} s
 * @return {?}
 */
export function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvYXN0L3BhcnNlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFVQSxNQUFNOzs7Ozs7O0lBQ0osWUFBbUIsSUFBcUIsRUFBUyxNQUFjLEVBQVMsSUFBWSxFQUFTLEdBQVc7UUFBckYsU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7S0FBSTs7OztJQUU1RyxRQUFRO1FBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDOUQ7Ozs7OztJQUlELFVBQVUsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQzNDLHVCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNsQyxxQkFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFDRCxxQkFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDO1lBQzVCLHFCQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDakIscUJBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztZQUVqQixPQUFPLFFBQVEsR0FBRyxRQUFRLElB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QUFPLEVBQUUsQ0FBQztLQUMvRTtDQUNGOzs7Ozs7Ozs7Ozs7QUFLRCxNQUFNLGdCQUFpQixTQUFRLFVBQVU7Ozs7O0lBQ3ZDLFlBQVksSUFBcUIsRUFBRSxHQUFXO1FBQzVDLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDbEI7Q0FDRjs7Ozs7QUFFRCxNQUFNLHVCQUF1QixDQUFTO0lBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0NBQ3hEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJMThuRGVmfSBmcm9tIFwiLi4vaTE4bi1wb2x5ZmlsbFwiO1xuXG4vKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCBjbGFzcyBQYXJzZUxvY2F0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGZpbGU6IFBhcnNlU291cmNlRmlsZSwgcHVibGljIG9mZnNldDogbnVtYmVyLCBwdWJsaWMgbGluZTogbnVtYmVyLCBwdWJsaWMgY29sOiBudW1iZXIpIHt9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5vZmZzZXQgIT0gbnVsbCA/IGAke3RoaXMubGluZX06JHt0aGlzLmNvbH1gIDogXCJcIjtcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgc291cmNlIGFyb3VuZCB0aGUgbG9jYXRpb25cbiAgLy8gVXAgdG8gYG1heENoYXJzYCBvciBgbWF4TGluZXNgIG9uIGVhY2ggc2lkZSBvZiB0aGUgbG9jYXRpb25cbiAgZ2V0Q29udGV4dChtYXhDaGFyczogbnVtYmVyLCBtYXhMaW5lczogbnVtYmVyKToge2JlZm9yZTogc3RyaW5nOyBhZnRlcjogc3RyaW5nfSB8IG51bGwge1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmZpbGUuY29udGVudDtcbiAgICBsZXQgc3RhcnRPZmZzZXQgPSB0aGlzLm9mZnNldDtcblxuICAgIGlmIChzdGFydE9mZnNldCAhPSBudWxsKSB7XG4gICAgICBpZiAoc3RhcnRPZmZzZXQgPiBjb250ZW50Lmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc3RhcnRPZmZzZXQgPSBjb250ZW50Lmxlbmd0aCAtIDE7XG4gICAgICB9XG4gICAgICBsZXQgZW5kT2Zmc2V0ID0gc3RhcnRPZmZzZXQ7XG4gICAgICBsZXQgY3R4Q2hhcnMgPSAwO1xuICAgICAgbGV0IGN0eExpbmVzID0gMDtcblxuICAgICAgd2hpbGUgKGN0eENoYXJzIDwgbWF4Q2hhcnMgJiYgc3RhcnRPZmZzZXQgPiAwKSB7XG4gICAgICAgIHN0YXJ0T2Zmc2V0LS07XG4gICAgICAgIGN0eENoYXJzKys7XG4gICAgICAgIGlmIChjb250ZW50W3N0YXJ0T2Zmc2V0XSA9PT0gXCJcXG5cIikge1xuICAgICAgICAgIGlmICgrK2N0eExpbmVzID09PSBtYXhMaW5lcykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN0eENoYXJzID0gMDtcbiAgICAgIGN0eExpbmVzID0gMDtcbiAgICAgIHdoaWxlIChjdHhDaGFycyA8IG1heENoYXJzICYmIGVuZE9mZnNldCA8IGNvbnRlbnQubGVuZ3RoIC0gMSkge1xuICAgICAgICBlbmRPZmZzZXQrKztcbiAgICAgICAgY3R4Q2hhcnMrKztcbiAgICAgICAgaWYgKGNvbnRlbnRbZW5kT2Zmc2V0XSA9PT0gXCJcXG5cIikge1xuICAgICAgICAgIGlmICgrK2N0eExpbmVzID09PSBtYXhMaW5lcykge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJlZm9yZTogY29udGVudC5zdWJzdHJpbmcoc3RhcnRPZmZzZXQsIHRoaXMub2Zmc2V0KSxcbiAgICAgICAgYWZ0ZXI6IGNvbnRlbnQuc3Vic3RyaW5nKHRoaXMub2Zmc2V0LCBlbmRPZmZzZXQgKyAxKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VTb3VyY2VGaWxlIHtcbiAgY29uc3RydWN0b3IocHVibGljIGNvbnRlbnQ6IHN0cmluZywgcHVibGljIHVybCA9IFwiXCIpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVNvdXJjZVNwYW4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhcnQ6IFBhcnNlTG9jYXRpb24sIHB1YmxpYyBlbmQ6IFBhcnNlTG9jYXRpb24sIHB1YmxpYyBkZXRhaWxzOiBzdHJpbmcgfCBudWxsID0gbnVsbCkge31cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnN0YXJ0LmZpbGUuY29udGVudC5zdWJzdHJpbmcodGhpcy5zdGFydC5vZmZzZXQsIHRoaXMuZW5kLm9mZnNldCk7XG4gIH1cbn1cblxuZXhwb3J0IGVudW0gUGFyc2VFcnJvckxldmVsIHtcbiAgV0FSTklORyxcbiAgRVJST1Jcbn1cblxuZXhwb3J0IGNsYXNzIFBhcnNlRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHB1YmxpYyBtc2c6IHN0cmluZyxcbiAgICBwdWJsaWMgbGV2ZWw6IFBhcnNlRXJyb3JMZXZlbCA9IFBhcnNlRXJyb3JMZXZlbC5FUlJPUlxuICApIHt9XG5cbiAgY29udGV4dHVhbE1lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLnNwYW4uc3RhcnQuZ2V0Q29udGV4dCgxMDAsIDMpO1xuICAgIHJldHVybiBjdHggPyBgIChcIiR7Y3R4LmJlZm9yZX1bJHtQYXJzZUVycm9yTGV2ZWxbdGhpcy5sZXZlbF19IC0+XSR7Y3R4LmFmdGVyfVwiKWAgOiBcIlwiO1xuICB9XG5cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICBjb25zdCBkZXRhaWxzID0gdGhpcy5zcGFuLmRldGFpbHMgPyBgLCAke3RoaXMuc3Bhbi5kZXRhaWxzfWAgOiBcIlwiO1xuICAgIHJldHVybiBgJHt0aGlzLm1zZ30ke3RoaXMuY29udGV4dHVhbE1lc3NhZ2UoKX06ICR7dGhpcy5zcGFuLnN0YXJ0fSR7ZGV0YWlsc31gO1xuICB9XG59XG5cbi8qKlxuICogQW4gaTE4biBlcnJvci5cbiAqL1xuZXhwb3J0IGNsYXNzIEkxOG5FcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNvdXJjZVNwYW4sIG1zZzogc3RyaW5nKSB7XG4gICAgc3VwZXIoc3BhbiwgbXNnKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csIFwiXFxcXCQxXCIpO1xufVxuIl19