"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ParseLocation {
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    toString() {
        return this.offset != null ? `${this.line}:${this.col}` : "";
    }
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    getContext(maxChars, maxLines) {
        const content = this.file.content;
        let startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            let endOffset = startOffset;
            let ctxChars = 0;
            let ctxLines = 0;
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
exports.ParseLocation = ParseLocation;
class ParseSourceFile {
    constructor(content, url = "") {
        this.content = content;
        this.url = url;
    }
}
exports.ParseSourceFile = ParseSourceFile;
class ParseSourceSpan {
    constructor(start, end, details = null) {
        this.start = start;
        this.end = end;
        this.details = details;
    }
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
exports.ParseSourceSpan = ParseSourceSpan;
var ParseErrorLevel;
(function (ParseErrorLevel) {
    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel = exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
class ParseError {
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    contextualMessage() {
        const ctx = this.span.start.getContext(100, 3);
        return ctx ? ` ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` : "";
    }
    toString() {
        const details = this.span.details ? `, ${this.span.details}` : "";
        return `${this.msg}${this.contextualMessage()}: ${this.span.start}${details}`;
    }
}
exports.ParseError = ParseError;
/**
 * An i18n error.
 */
class I18nError extends ParseError {
    constructor(span, msg) {
        super(span, msg);
    }
}
exports.I18nError = I18nError;
function escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=parse_util.js.map