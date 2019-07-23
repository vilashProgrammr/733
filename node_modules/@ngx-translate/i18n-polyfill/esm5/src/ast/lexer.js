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
import * as tslib_1 from "tslib";
import * as chars from "./chars";
import { ParseError, ParseLocation, ParseSourceFile, ParseSourceSpan } from "./parse_util";
import { DEFAULT_INTERPOLATION_CONFIG } from "./interpolation_config";
import { NAMED_ENTITIES, TagContentType } from "./tags";
/** @enum {number} */
var TokenType = {
    TAG_OPEN_START: 0,
    TAG_OPEN_END: 1,
    TAG_OPEN_END_VOID: 2,
    TAG_CLOSE: 3,
    TEXT: 4,
    ESCAPABLE_RAW_TEXT: 5,
    RAW_TEXT: 6,
    COMMENT_START: 7,
    COMMENT_END: 8,
    CDATA_START: 9,
    CDATA_END: 10,
    ATTR_NAME: 11,
    ATTR_VALUE: 12,
    DOC_TYPE: 13,
    EXPANSION_FORM_START: 14,
    EXPANSION_CASE_VALUE: 15,
    EXPANSION_CASE_EXP_START: 16,
    EXPANSION_CASE_EXP_END: 17,
    EXPANSION_FORM_END: 18,
    EOF: 19,
};
export { TokenType };
TokenType[TokenType.TAG_OPEN_START] = "TAG_OPEN_START";
TokenType[TokenType.TAG_OPEN_END] = "TAG_OPEN_END";
TokenType[TokenType.TAG_OPEN_END_VOID] = "TAG_OPEN_END_VOID";
TokenType[TokenType.TAG_CLOSE] = "TAG_CLOSE";
TokenType[TokenType.TEXT] = "TEXT";
TokenType[TokenType.ESCAPABLE_RAW_TEXT] = "ESCAPABLE_RAW_TEXT";
TokenType[TokenType.RAW_TEXT] = "RAW_TEXT";
TokenType[TokenType.COMMENT_START] = "COMMENT_START";
TokenType[TokenType.COMMENT_END] = "COMMENT_END";
TokenType[TokenType.CDATA_START] = "CDATA_START";
TokenType[TokenType.CDATA_END] = "CDATA_END";
TokenType[TokenType.ATTR_NAME] = "ATTR_NAME";
TokenType[TokenType.ATTR_VALUE] = "ATTR_VALUE";
TokenType[TokenType.DOC_TYPE] = "DOC_TYPE";
TokenType[TokenType.EXPANSION_FORM_START] = "EXPANSION_FORM_START";
TokenType[TokenType.EXPANSION_CASE_VALUE] = "EXPANSION_CASE_VALUE";
TokenType[TokenType.EXPANSION_CASE_EXP_START] = "EXPANSION_CASE_EXP_START";
TokenType[TokenType.EXPANSION_CASE_EXP_END] = "EXPANSION_CASE_EXP_END";
TokenType[TokenType.EXPANSION_FORM_END] = "EXPANSION_FORM_END";
TokenType[TokenType.EOF] = "EOF";
var Token = /** @class */ (function () {
    function Token(type, parts, sourceSpan) {
        this.type = type;
        this.parts = parts;
        this.sourceSpan = sourceSpan;
    }
    return Token;
}());
export { Token };
function Token_tsickle_Closure_declarations() {
    /** @type {?} */
    Token.prototype.type;
    /** @type {?} */
    Token.prototype.parts;
    /** @type {?} */
    Token.prototype.sourceSpan;
}
var TokenError = /** @class */ (function (_super) {
    tslib_1.__extends(TokenError, _super);
    function TokenError(errorMsg, tokenType, span) {
        var _this = _super.call(this, span, errorMsg) || this;
        _this.tokenType = tokenType;
        return _this;
    }
    return TokenError;
}(ParseError));
export { TokenError };
function TokenError_tsickle_Closure_declarations() {
    /** @type {?} */
    TokenError.prototype.tokenType;
}
var TokenizeResult = /** @class */ (function () {
    function TokenizeResult(tokens, errors) {
        this.tokens = tokens;
        this.errors = errors;
    }
    return TokenizeResult;
}());
export { TokenizeResult };
function TokenizeResult_tsickle_Closure_declarations() {
    /** @type {?} */
    TokenizeResult.prototype.tokens;
    /** @type {?} */
    TokenizeResult.prototype.errors;
}
/**
 * @param {?} source
 * @param {?} url
 * @param {?} getTagDefinition
 * @param {?=} tokenizeExpansionForms
 * @param {?=} interpolationConfig
 * @return {?}
 */
export function tokenize(source, url, getTagDefinition, tokenizeExpansionForms, interpolationConfig) {
    if (tokenizeExpansionForms === void 0) { tokenizeExpansionForms = false; }
    if (interpolationConfig === void 0) { interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
    return new Tokenizer(new ParseSourceFile(source, url), getTagDefinition, tokenizeExpansionForms, interpolationConfig).tokenize();
}
var /** @type {?} */ _CR_OR_CRLF_REGEXP = /\r\n?/g;
/**
 * @param {?} charCode
 * @return {?}
 */
function _unexpectedCharacterErrorMsg(charCode) {
    var /** @type {?} */ char = charCode === chars.$EOF ? "EOF" : String.fromCharCode(charCode);
    return "Unexpected character \"" + char + "\"";
}
/**
 * @param {?} entitySrc
 * @return {?}
 */
function _unknownEntityErrorMsg(entitySrc) {
    return "Unknown entity \"" + entitySrc + "\" - use the \"&#<decimal>;\" or  \"&#x<hex>;\" syntax";
}
var ControlFlowError = /** @class */ (function () {
    function ControlFlowError(error) {
        this.error = error;
    }
    return ControlFlowError;
}());
function ControlFlowError_tsickle_Closure_declarations() {
    /** @type {?} */
    ControlFlowError.prototype.error;
}
var Tokenizer = /** @class */ (function () {
    /**
     * @param _file The html source
     * @param _getTagDefinition
     * @param _tokenizeIcu Whether to tokenize ICU messages (considered as text nodes when false)
     * @param _interpolationConfig
     */
    function Tokenizer(_file, _getTagDefinition, _tokenizeIcu, _interpolationConfig) {
        if (_interpolationConfig === void 0) { _interpolationConfig = DEFAULT_INTERPOLATION_CONFIG; }
        this._file = _file;
        this._getTagDefinition = _getTagDefinition;
        this._tokenizeIcu = _tokenizeIcu;
        this._interpolationConfig = _interpolationConfig;
        this._peek = -1;
        this._nextPeek = -1;
        this._index = -1;
        this._line = 0;
        this._column = -1;
        this._expansionCaseStack = [];
        this._inInterpolation = false;
        this.tokens = [];
        this.errors = [];
        this._input = _file.content;
        this._length = _file.content.length;
        this._advance();
    }
    /**
     * @param {?} content
     * @return {?}
     */
    Tokenizer.prototype._processCarriageReturns = /**
     * @param {?} content
     * @return {?}
     */
    function (content) {
        // http://www.w3.org/TR/html5/syntax.html#preprocessing-the-input-stream
        // In order to keep the original position in the source, we can not
        // pre-process it.
        // Instead CRs are processed right before instantiating the tokens.
        return content.replace(_CR_OR_CRLF_REGEXP, "\n");
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype.tokenize = /**
     * @return {?}
     */
    function () {
        while (this._peek !== chars.$EOF) {
            var /** @type {?} */ start = this._getLocation();
            try {
                if (this._attemptCharCode(chars.$LT)) {
                    if (this._attemptCharCode(chars.$BANG)) {
                        if (this._attemptCharCode(chars.$LBRACKET)) {
                            this._consumeCdata(start);
                        }
                        else if (this._attemptCharCode(chars.$MINUS)) {
                            this._consumeComment(start);
                        }
                        else {
                            this._consumeDocType(start);
                        }
                    }
                    else if (this._attemptCharCode(chars.$SLASH)) {
                        this._consumeTagClose(start);
                    }
                    else {
                        this._consumeTagOpen(start);
                    }
                }
                else if (!(this._tokenizeIcu && this._tokenizeExpansionForm())) {
                    this._consumeText();
                }
            }
            catch (/** @type {?} */ e) {
                if (e instanceof ControlFlowError) {
                    this.errors.push(e.error);
                }
                else {
                    throw e;
                }
            }
        }
        this._beginToken(TokenType.EOF);
        this._endToken([]);
        return new TokenizeResult(mergeTextTokens(this.tokens), this.errors);
    };
    /**
     * \@internal
     * @return {?} whether an ICU token has been created
     */
    Tokenizer.prototype._tokenizeExpansionForm = /**
     * \@internal
     * @return {?} whether an ICU token has been created
     */
    function () {
        if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
            this._consumeExpansionFormStart();
            return true;
        }
        if (isExpansionCaseStart(this._peek) && this._isInExpansionForm()) {
            this._consumeExpansionCaseStart();
            return true;
        }
        if (this._peek === chars.$RBRACE) {
            if (this._isInExpansionCase()) {
                this._consumeExpansionCaseEnd();
                return true;
            }
            if (this._isInExpansionForm()) {
                this._consumeExpansionFormEnd();
                return true;
            }
        }
        return false;
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._getLocation = /**
     * @return {?}
     */
    function () {
        return new ParseLocation(this._file, this._index, this._line, this._column);
    };
    /**
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    Tokenizer.prototype._getSpan = /**
     * @param {?=} start
     * @param {?=} end
     * @return {?}
     */
    function (start, end) {
        if (start === void 0) { start = this._getLocation(); }
        if (end === void 0) { end = this._getLocation(); }
        return new ParseSourceSpan(start, end);
    };
    /**
     * @param {?} type
     * @param {?=} start
     * @return {?}
     */
    Tokenizer.prototype._beginToken = /**
     * @param {?} type
     * @param {?=} start
     * @return {?}
     */
    function (type, start) {
        if (start === void 0) { start = this._getLocation(); }
        this._currentTokenStart = start;
        this._currentTokenType = type;
    };
    /**
     * @param {?} parts
     * @param {?=} end
     * @return {?}
     */
    Tokenizer.prototype._endToken = /**
     * @param {?} parts
     * @param {?=} end
     * @return {?}
     */
    function (parts, end) {
        if (end === void 0) { end = this._getLocation(); }
        var /** @type {?} */ token = new Token(this._currentTokenType, parts, new ParseSourceSpan(this._currentTokenStart, end));
        this.tokens.push(token);
        this._currentTokenStart = /** @type {?} */ ((null));
        this._currentTokenType = /** @type {?} */ ((null));
        return token;
    };
    /**
     * @param {?} msg
     * @param {?} span
     * @return {?}
     */
    Tokenizer.prototype._createError = /**
     * @param {?} msg
     * @param {?} span
     * @return {?}
     */
    function (msg, span) {
        if (this._isInExpansionForm()) {
            msg += " (Do you have an unescaped \"{\" in your template? Use \"{{ '{' }}\") to escape it.)";
        }
        var /** @type {?} */ error = new TokenError(msg, this._currentTokenType, span);
        this._currentTokenStart = /** @type {?} */ ((null));
        this._currentTokenType = /** @type {?} */ ((null));
        return new ControlFlowError(error);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._advance = /**
     * @return {?}
     */
    function () {
        if (this._index >= this._length) {
            throw this._createError(_unexpectedCharacterErrorMsg(chars.$EOF), this._getSpan());
        }
        if (this._peek === chars.$LF) {
            this._line++;
            this._column = 0;
        }
        else if (this._peek !== chars.$LF && this._peek !== chars.$CR) {
            this._column++;
        }
        this._index++;
        this._peek = this._index >= this._length ? chars.$EOF : this._input.charCodeAt(this._index);
        this._nextPeek = this._index + 1 >= this._length ? chars.$EOF : this._input.charCodeAt(this._index + 1);
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    Tokenizer.prototype._attemptCharCode = /**
     * @param {?} charCode
     * @return {?}
     */
    function (charCode) {
        if (this._peek === charCode) {
            this._advance();
            return true;
        }
        return false;
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    Tokenizer.prototype._attemptCharCodeCaseInsensitive = /**
     * @param {?} charCode
     * @return {?}
     */
    function (charCode) {
        if (compareCharCodeCaseInsensitive(this._peek, charCode)) {
            this._advance();
            return true;
        }
        return false;
    };
    /**
     * @param {?} charCode
     * @return {?}
     */
    Tokenizer.prototype._requireCharCode = /**
     * @param {?} charCode
     * @return {?}
     */
    function (charCode) {
        var /** @type {?} */ location = this._getLocation();
        if (!this._attemptCharCode(charCode)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location, location));
        }
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    Tokenizer.prototype._attemptStr = /**
     * @param {?} chars
     * @return {?}
     */
    function (chars) {
        var /** @type {?} */ len = chars.length;
        if (this._index + len > this._length) {
            return false;
        }
        var /** @type {?} */ initialPosition = this._savePosition();
        for (var /** @type {?} */ i = 0; i < len; i++) {
            if (!this._attemptCharCode(chars.charCodeAt(i))) {
                // If attempting to parse the string fails, we want to reset the parser
                // to where it was before the attempt
                this._restorePosition(initialPosition);
                return false;
            }
        }
        return true;
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    Tokenizer.prototype._attemptStrCaseInsensitive = /**
     * @param {?} chars
     * @return {?}
     */
    function (chars) {
        for (var /** @type {?} */ i = 0; i < chars.length; i++) {
            if (!this._attemptCharCodeCaseInsensitive(chars.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    };
    /**
     * @param {?} chars
     * @return {?}
     */
    Tokenizer.prototype._requireStr = /**
     * @param {?} chars
     * @return {?}
     */
    function (chars) {
        var /** @type {?} */ location = this._getLocation();
        if (!this._attemptStr(chars)) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(location));
        }
    };
    /**
     * @param {?} predicate
     * @return {?}
     */
    Tokenizer.prototype._attemptCharCodeUntilFn = /**
     * @param {?} predicate
     * @return {?}
     */
    function (predicate) {
        while (!predicate(this._peek)) {
            this._advance();
        }
    };
    /**
     * @param {?} predicate
     * @param {?} len
     * @return {?}
     */
    Tokenizer.prototype._requireCharCodeUntilFn = /**
     * @param {?} predicate
     * @param {?} len
     * @return {?}
     */
    function (predicate, len) {
        var /** @type {?} */ start = this._getLocation();
        this._attemptCharCodeUntilFn(predicate);
        if (this._index - start.offset < len) {
            throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan(start, start));
        }
    };
    /**
     * @param {?} char
     * @return {?}
     */
    Tokenizer.prototype._attemptUntilChar = /**
     * @param {?} char
     * @return {?}
     */
    function (char) {
        while (this._peek !== char) {
            this._advance();
        }
    };
    /**
     * @param {?} decodeEntities
     * @return {?}
     */
    Tokenizer.prototype._readChar = /**
     * @param {?} decodeEntities
     * @return {?}
     */
    function (decodeEntities) {
        if (decodeEntities && this._peek === chars.$AMPERSAND) {
            return this._decodeEntity();
        }
        else {
            var /** @type {?} */ index = this._index;
            this._advance();
            return this._input[index];
        }
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._decodeEntity = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ start = this._getLocation();
        this._advance();
        if (this._attemptCharCode(chars.$HASH)) {
            var /** @type {?} */ isHex = this._attemptCharCode(chars.$x) || this._attemptCharCode(chars.$X);
            var /** @type {?} */ numberStart = this._getLocation().offset;
            this._attemptCharCodeUntilFn(isDigitEntityEnd);
            if (this._peek !== chars.$SEMICOLON) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            this._advance();
            var /** @type {?} */ strNum = this._input.substring(numberStart, this._index - 1);
            try {
                var /** @type {?} */ charCode = parseInt(strNum, isHex ? 16 : 10);
                return String.fromCharCode(charCode);
            }
            catch (/** @type {?} */ e) {
                var /** @type {?} */ entity = this._input.substring(start.offset + 1, this._index - 1);
                throw this._createError(_unknownEntityErrorMsg(entity), this._getSpan(start));
            }
        }
        else {
            var /** @type {?} */ startPosition = this._savePosition();
            this._attemptCharCodeUntilFn(isNamedEntityEnd);
            if (this._peek !== chars.$SEMICOLON) {
                this._restorePosition(startPosition);
                return "&";
            }
            this._advance();
            var /** @type {?} */ name_1 = this._input.substring(start.offset + 1, this._index - 1);
            var /** @type {?} */ char = NAMED_ENTITIES[name_1];
            if (!char) {
                throw this._createError(_unknownEntityErrorMsg(name_1), this._getSpan(start));
            }
            return char;
        }
    };
    /**
     * @param {?} decodeEntities
     * @param {?} firstCharOfEnd
     * @param {?} attemptEndRest
     * @return {?}
     */
    Tokenizer.prototype._consumeRawText = /**
     * @param {?} decodeEntities
     * @param {?} firstCharOfEnd
     * @param {?} attemptEndRest
     * @return {?}
     */
    function (decodeEntities, firstCharOfEnd, attemptEndRest) {
        var /** @type {?} */ tagCloseStart;
        var /** @type {?} */ textStart = this._getLocation();
        this._beginToken(decodeEntities ? TokenType.ESCAPABLE_RAW_TEXT : TokenType.RAW_TEXT, textStart);
        var /** @type {?} */ parts = [];
        while (true) {
            tagCloseStart = this._getLocation();
            if (this._attemptCharCode(firstCharOfEnd) && attemptEndRest()) {
                break;
            }
            if (this._index > tagCloseStart.offset) {
                // add the characters consumed by the previous if statement to the output
                parts.push(this._input.substring(tagCloseStart.offset, this._index));
            }
            while (this._peek !== firstCharOfEnd) {
                parts.push(this._readChar(decodeEntities));
            }
        }
        return this._endToken([this._processCarriageReturns(parts.join(""))], tagCloseStart);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeComment = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var _this = this;
        this._beginToken(TokenType.COMMENT_START, start);
        this._requireCharCode(chars.$MINUS);
        this._endToken([]);
        var /** @type {?} */ textToken = this._consumeRawText(false, chars.$MINUS, function () { return _this._attemptStr("->"); });
        this._beginToken(TokenType.COMMENT_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeCdata = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var _this = this;
        this._beginToken(TokenType.CDATA_START, start);
        this._requireStr("CDATA[");
        this._endToken([]);
        var /** @type {?} */ textToken = this._consumeRawText(false, chars.$RBRACKET, function () { return _this._attemptStr("]>"); });
        this._beginToken(TokenType.CDATA_END, textToken.sourceSpan.end);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeDocType = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        this._beginToken(TokenType.DOC_TYPE, start);
        this._attemptUntilChar(chars.$GT);
        this._advance();
        this._endToken([this._input.substring(start.offset + 2, this._index - 1)]);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumePrefixAndName = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ nameOrPrefixStart = this._index;
        var /** @type {?} */ prefix = /** @type {?} */ ((null));
        while (this._peek !== chars.$COLON && !isPrefixEnd(this._peek)) {
            this._advance();
        }
        var /** @type {?} */ nameStart;
        if (this._peek === chars.$COLON) {
            this._advance();
            prefix = this._input.substring(nameOrPrefixStart, this._index - 1);
            nameStart = this._index;
        }
        else {
            nameStart = nameOrPrefixStart;
        }
        this._requireCharCodeUntilFn(isNameEnd, this._index === nameStart ? 1 : 0);
        var /** @type {?} */ name = this._input.substring(nameStart, this._index);
        return [prefix, name];
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeTagOpen = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var /** @type {?} */ savedPos = this._savePosition();
        var /** @type {?} */ tagName;
        var /** @type {?} */ lowercaseTagName;
        try {
            if (!chars.isAsciiLetter(this._peek)) {
                throw this._createError(_unexpectedCharacterErrorMsg(this._peek), this._getSpan());
            }
            var /** @type {?} */ nameStart = this._index;
            this._consumeTagOpenStart(start);
            tagName = this._input.substring(nameStart, this._index);
            lowercaseTagName = tagName.toLowerCase();
            this._attemptCharCodeUntilFn(isNotWhitespace);
            while (this._peek !== chars.$SLASH && this._peek !== chars.$GT) {
                this._consumeAttributeName();
                this._attemptCharCodeUntilFn(isNotWhitespace);
                if (this._attemptCharCode(chars.$EQ)) {
                    this._attemptCharCodeUntilFn(isNotWhitespace);
                    this._consumeAttributeValue();
                }
                this._attemptCharCodeUntilFn(isNotWhitespace);
            }
            this._consumeTagOpenEnd();
        }
        catch (/** @type {?} */ e) {
            if (e instanceof ControlFlowError) {
                // When the start tag is invalid, assume we want a "<"
                this._restorePosition(savedPos);
                // Back to back text tokens are merged at the end
                this._beginToken(TokenType.TEXT, start);
                this._endToken(["<"]);
                return;
            }
            throw e;
        }
        var /** @type {?} */ contentTokenType = this._getTagDefinition(tagName).contentType;
        if (contentTokenType === TagContentType.RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, false);
        }
        else if (contentTokenType === TagContentType.ESCAPABLE_RAW_TEXT) {
            this._consumeRawTextWithTagClose(lowercaseTagName, true);
        }
    };
    /**
     * @param {?} lowercaseTagName
     * @param {?} decodeEntities
     * @return {?}
     */
    Tokenizer.prototype._consumeRawTextWithTagClose = /**
     * @param {?} lowercaseTagName
     * @param {?} decodeEntities
     * @return {?}
     */
    function (lowercaseTagName, decodeEntities) {
        var _this = this;
        var /** @type {?} */ textToken = this._consumeRawText(decodeEntities, chars.$LT, function () {
            if (!_this._attemptCharCode(chars.$SLASH))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            if (!_this._attemptStrCaseInsensitive(lowercaseTagName))
                return false;
            _this._attemptCharCodeUntilFn(isNotWhitespace);
            return _this._attemptCharCode(chars.$GT);
        });
        this._beginToken(TokenType.TAG_CLOSE, textToken.sourceSpan.end);
        this._endToken([/** @type {?} */ ((null)), lowercaseTagName]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeTagOpenStart = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        this._beginToken(TokenType.TAG_OPEN_START, start);
        var /** @type {?} */ parts = this._consumePrefixAndName();
        this._endToken(parts);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeAttributeName = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.ATTR_NAME);
        var /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._endToken(prefixAndName);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeAttributeValue = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.ATTR_VALUE);
        var /** @type {?} */ value;
        if (this._peek === chars.$SQ || this._peek === chars.$DQ) {
            var /** @type {?} */ quoteChar = this._peek;
            this._advance();
            var /** @type {?} */ parts = [];
            while (this._peek !== quoteChar) {
                parts.push(this._readChar(true));
            }
            value = parts.join("");
            this._advance();
        }
        else {
            var /** @type {?} */ valueStart = this._index;
            this._requireCharCodeUntilFn(isNameEnd, 1);
            value = this._input.substring(valueStart, this._index);
        }
        this._endToken([this._processCarriageReturns(value)]);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeTagOpenEnd = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ tokenType = this._attemptCharCode(chars.$SLASH) ? TokenType.TAG_OPEN_END_VOID : TokenType.TAG_OPEN_END;
        this._beginToken(tokenType);
        this._requireCharCode(chars.$GT);
        this._endToken([]);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Tokenizer.prototype._consumeTagClose = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        this._beginToken(TokenType.TAG_CLOSE, start);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        var /** @type {?} */ prefixAndName = this._consumePrefixAndName();
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._requireCharCode(chars.$GT);
        this._endToken(prefixAndName);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeExpansionFormStart = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.EXPANSION_FORM_START, this._getLocation());
        this._requireCharCode(chars.$LBRACE);
        this._endToken([]);
        this._expansionCaseStack.push(TokenType.EXPANSION_FORM_START);
        this._beginToken(TokenType.RAW_TEXT, this._getLocation());
        var /** @type {?} */ condition = this._readUntil(chars.$COMMA);
        this._endToken([condition], this._getLocation());
        this._requireCharCode(chars.$COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType.RAW_TEXT, this._getLocation());
        var /** @type {?} */ type = this._readUntil(chars.$COMMA);
        this._endToken([type], this._getLocation());
        this._requireCharCode(chars.$COMMA);
        this._attemptCharCodeUntilFn(isNotWhitespace);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeExpansionCaseStart = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.EXPANSION_CASE_VALUE, this._getLocation());
        var /** @type {?} */ value = this._readUntil(chars.$LBRACE).trim();
        this._endToken([value], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._beginToken(TokenType.EXPANSION_CASE_EXP_START, this._getLocation());
        this._requireCharCode(chars.$LBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.push(TokenType.EXPANSION_CASE_EXP_START);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeExpansionCaseEnd = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.EXPANSION_CASE_EXP_END, this._getLocation());
        this._requireCharCode(chars.$RBRACE);
        this._endToken([], this._getLocation());
        this._attemptCharCodeUntilFn(isNotWhitespace);
        this._expansionCaseStack.pop();
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeExpansionFormEnd = /**
     * @return {?}
     */
    function () {
        this._beginToken(TokenType.EXPANSION_FORM_END, this._getLocation());
        this._requireCharCode(chars.$RBRACE);
        this._endToken([]);
        this._expansionCaseStack.pop();
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._consumeText = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ start = this._getLocation();
        this._beginToken(TokenType.TEXT, start);
        var /** @type {?} */ parts = [];
        do {
            if (this._interpolationConfig && this._attemptStr(this._interpolationConfig.start)) {
                parts.push(this._interpolationConfig.start);
                this._inInterpolation = true;
            }
            else if (this._interpolationConfig &&
                this._inInterpolation &&
                this._attemptStr(this._interpolationConfig.end)) {
                parts.push(this._interpolationConfig.end);
                this._inInterpolation = false;
            }
            else {
                parts.push(this._readChar(true));
            }
        } while (!this._isTextEnd());
        this._endToken([this._processCarriageReturns(parts.join(""))]);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._isTextEnd = /**
     * @return {?}
     */
    function () {
        if (this._peek === chars.$LT || this._peek === chars.$EOF) {
            return true;
        }
        if (this._tokenizeIcu && !this._inInterpolation) {
            if (isExpansionFormStart(this._input, this._index, this._interpolationConfig)) {
                // start of an expansion form
                return true;
            }
            if (this._peek === chars.$RBRACE && this._isInExpansionCase()) {
                // end of and expansion case
                return true;
            }
        }
        return false;
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._savePosition = /**
     * @return {?}
     */
    function () {
        return [this._peek, this._index, this._column, this._line, this.tokens.length];
    };
    /**
     * @param {?} char
     * @return {?}
     */
    Tokenizer.prototype._readUntil = /**
     * @param {?} char
     * @return {?}
     */
    function (char) {
        var /** @type {?} */ start = this._index;
        this._attemptUntilChar(char);
        return this._input.substring(start, this._index);
    };
    /**
     * @param {?} position
     * @return {?}
     */
    Tokenizer.prototype._restorePosition = /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
        this._peek = position[0];
        this._index = position[1];
        this._column = position[2];
        this._line = position[3];
        var /** @type {?} */ nbTokens = position[4];
        if (nbTokens < this.tokens.length) {
            // remove any extra tokens
            this.tokens = this.tokens.slice(0, nbTokens);
        }
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._isInExpansionCase = /**
     * @return {?}
     */
    function () {
        return (this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] === TokenType.EXPANSION_CASE_EXP_START);
    };
    /**
     * @return {?}
     */
    Tokenizer.prototype._isInExpansionForm = /**
     * @return {?}
     */
    function () {
        return (this._expansionCaseStack.length > 0 &&
            this._expansionCaseStack[this._expansionCaseStack.length - 1] === TokenType.EXPANSION_FORM_START);
    };
    return Tokenizer;
}());
function Tokenizer_tsickle_Closure_declarations() {
    /** @type {?} */
    Tokenizer.prototype._input;
    /** @type {?} */
    Tokenizer.prototype._length;
    /** @type {?} */
    Tokenizer.prototype._peek;
    /** @type {?} */
    Tokenizer.prototype._nextPeek;
    /** @type {?} */
    Tokenizer.prototype._index;
    /** @type {?} */
    Tokenizer.prototype._line;
    /** @type {?} */
    Tokenizer.prototype._column;
    /** @type {?} */
    Tokenizer.prototype._currentTokenStart;
    /** @type {?} */
    Tokenizer.prototype._currentTokenType;
    /** @type {?} */
    Tokenizer.prototype._expansionCaseStack;
    /** @type {?} */
    Tokenizer.prototype._inInterpolation;
    /** @type {?} */
    Tokenizer.prototype.tokens;
    /** @type {?} */
    Tokenizer.prototype.errors;
    /** @type {?} */
    Tokenizer.prototype._file;
    /** @type {?} */
    Tokenizer.prototype._getTagDefinition;
    /** @type {?} */
    Tokenizer.prototype._tokenizeIcu;
    /** @type {?} */
    Tokenizer.prototype._interpolationConfig;
}
/**
 * @param {?} code
 * @return {?}
 */
function isNotWhitespace(code) {
    return !chars.isWhitespace(code) || code === chars.$EOF;
}
/**
 * @param {?} code
 * @return {?}
 */
function isNameEnd(code) {
    return (chars.isWhitespace(code) ||
        code === chars.$GT ||
        code === chars.$SLASH ||
        code === chars.$SQ ||
        code === chars.$DQ ||
        code === chars.$EQ);
}
/**
 * @param {?} code
 * @return {?}
 */
function isPrefixEnd(code) {
    return ((code < chars.$a || chars.$z < code) && (code < chars.$A || chars.$Z < code) && (code < chars.$0 || code > chars.$9));
}
/**
 * @param {?} code
 * @return {?}
 */
function isDigitEntityEnd(code) {
    return code === chars.$SEMICOLON || code === chars.$EOF || !chars.isAsciiHexDigit(code);
}
/**
 * @param {?} code
 * @return {?}
 */
function isNamedEntityEnd(code) {
    return code === chars.$SEMICOLON || code === chars.$EOF || !chars.isAsciiLetter(code);
}
/**
 * @param {?} input
 * @param {?} offset
 * @param {?} interpolationConfig
 * @return {?}
 */
function isExpansionFormStart(input, offset, interpolationConfig) {
    var /** @type {?} */ isInterpolationStart = interpolationConfig
        ? input.indexOf(interpolationConfig.start, offset) === offset
        : false;
    return input.charCodeAt(offset) === chars.$LBRACE && !isInterpolationStart;
}
/**
 * @param {?} peek
 * @return {?}
 */
function isExpansionCaseStart(peek) {
    return peek === chars.$EQ || chars.isAsciiLetter(peek) || chars.isDigit(peek);
}
/**
 * @param {?} code1
 * @param {?} code2
 * @return {?}
 */
function compareCharCodeCaseInsensitive(code1, code2) {
    return toUpperCaseCharCode(code1) === toUpperCaseCharCode(code2);
}
/**
 * @param {?} code
 * @return {?}
 */
function toUpperCaseCharCode(code) {
    return code >= chars.$a && code <= chars.$z ? code - chars.$a + chars.$A : code;
}
/**
 * @param {?} srcTokens
 * @return {?}
 */
function mergeTextTokens(srcTokens) {
    var /** @type {?} */ dstTokens = [];
    var /** @type {?} */ lastDstToken = undefined;
    for (var /** @type {?} */ i = 0; i < srcTokens.length; i++) {
        var /** @type {?} */ token = srcTokens[i];
        if (lastDstToken && lastDstToken.type === TokenType.TEXT && token.type === TokenType.TEXT) {
            lastDstToken.parts[0] += token.parts[0];
            lastDstToken.sourceSpan.end = token.sourceSpan.end;
        }
        else {
            lastDstToken = token;
            dstTokens.push(lastDstToken);
        }
    }
    return dstTokens;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL2FzdC9sZXhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFTQSxPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUNqQyxPQUFPLEVBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXpGLE9BQU8sRUFBQyw0QkFBNEIsRUFBc0IsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RixPQUFPLEVBQUMsY0FBYyxFQUFFLGNBQWMsRUFBZ0IsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCckUsSUFBQTtJQUNFLGVBQW1CLElBQWUsRUFBUyxLQUFlLEVBQVMsVUFBMkI7UUFBM0UsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFTLFVBQUssR0FBTCxLQUFLLENBQVU7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtLQUFJO2dCQXZDcEc7SUF3Q0MsQ0FBQTtBQUZELGlCQUVDOzs7Ozs7Ozs7QUFFRCxJQUFBO0lBQWdDLHNDQUFVO0lBQ3hDLG9CQUFZLFFBQWdCLEVBQVMsU0FBb0IsRUFBRSxJQUFxQjtRQUFoRixZQUNFLGtCQUFNLElBQUksRUFBRSxRQUFRLENBQUMsU0FDdEI7UUFGb0MsZUFBUyxHQUFULFNBQVMsQ0FBVzs7S0FFeEQ7cUJBN0NIO0VBMENnQyxVQUFVLEVBSXpDLENBQUE7QUFKRCxzQkFJQzs7Ozs7QUFFRCxJQUFBO0lBQ0Usd0JBQW1CLE1BQWUsRUFBUyxNQUFvQjtRQUE1QyxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBYztLQUFJO3lCQWpEckU7SUFrREMsQ0FBQTtBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7Ozs7QUFFRCxNQUFNLG1CQUNK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InNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGUgKi9cbmltcG9ydCAqIGFzIGNoYXJzIGZyb20gXCIuL2NoYXJzXCI7XG5pbXBvcnQge1BhcnNlRXJyb3IsIFBhcnNlTG9jYXRpb24sIFBhcnNlU291cmNlRmlsZSwgUGFyc2VTb3VyY2VTcGFufSBmcm9tIFwiLi9wYXJzZV91dGlsXCI7XG5cbmltcG9ydCB7REVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJRywgSW50ZXJwb2xhdGlvbkNvbmZpZ30gZnJvbSBcIi4vaW50ZXJwb2xhdGlvbl9jb25maWdcIjtcbmltcG9ydCB7TkFNRURfRU5USVRJRVMsIFRhZ0NvbnRlbnRUeXBlLCBUYWdEZWZpbml0aW9ufSBmcm9tIFwiLi90YWdzXCI7XG5cbmV4cG9ydCBlbnVtIFRva2VuVHlwZSB7XG4gIFRBR19PUEVOX1NUQVJULFxuICBUQUdfT1BFTl9FTkQsXG4gIFRBR19PUEVOX0VORF9WT0lELFxuICBUQUdfQ0xPU0UsXG4gIFRFWFQsXG4gIEVTQ0FQQUJMRV9SQVdfVEVYVCxcbiAgUkFXX1RFWFQsXG4gIENPTU1FTlRfU1RBUlQsXG4gIENPTU1FTlRfRU5ELFxuICBDREFUQV9TVEFSVCxcbiAgQ0RBVEFfRU5ELFxuICBBVFRSX05BTUUsXG4gIEFUVFJfVkFMVUUsXG4gIERPQ19UWVBFLFxuICBFWFBBTlNJT05fRk9STV9TVEFSVCxcbiAgRVhQQU5TSU9OX0NBU0VfVkFMVUUsXG4gIEVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCxcbiAgRVhQQU5TSU9OX0NBU0VfRVhQX0VORCxcbiAgRVhQQU5TSU9OX0ZPUk1fRU5ELFxuICBFT0Zcbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuIHtcbiAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IFRva2VuVHlwZSwgcHVibGljIHBhcnRzOiBzdHJpbmdbXSwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgY29uc3RydWN0b3IoZXJyb3JNc2c6IHN0cmluZywgcHVibGljIHRva2VuVHlwZTogVG9rZW5UeXBlLCBzcGFuOiBQYXJzZVNvdXJjZVNwYW4pIHtcbiAgICBzdXBlcihzcGFuLCBlcnJvck1zZyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRva2VuaXplUmVzdWx0IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRva2VuczogVG9rZW5bXSwgcHVibGljIGVycm9yczogVG9rZW5FcnJvcltdKSB7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9rZW5pemUoXG4gIHNvdXJjZTogc3RyaW5nLFxuICB1cmw6IHN0cmluZyxcbiAgZ2V0VGFnRGVmaW5pdGlvbjogKHRhZ05hbWU6IHN0cmluZykgPT4gVGFnRGVmaW5pdGlvbixcbiAgdG9rZW5pemVFeHBhbnNpb25Gb3JtcyA9IGZhbHNlLFxuICBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnID0gREVGQVVMVF9JTlRFUlBPTEFUSU9OX0NPTkZJR1xuKTogVG9rZW5pemVSZXN1bHQge1xuICByZXR1cm4gbmV3IFRva2VuaXplcihcbiAgICBuZXcgUGFyc2VTb3VyY2VGaWxlKHNvdXJjZSwgdXJsKSxcbiAgICBnZXRUYWdEZWZpbml0aW9uLFxuICAgIHRva2VuaXplRXhwYW5zaW9uRm9ybXMsXG4gICAgaW50ZXJwb2xhdGlvbkNvbmZpZ1xuICApLnRva2VuaXplKCk7XG59XG5cbmNvbnN0IF9DUl9PUl9DUkxGX1JFR0VYUCA9IC9cXHJcXG4/L2c7XG5cbmZ1bmN0aW9uIF91bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2coY2hhckNvZGU6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGNoYXIgPSBjaGFyQ29kZSA9PT0gY2hhcnMuJEVPRiA/IFwiRU9GXCIgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGNoYXJDb2RlKTtcbiAgcmV0dXJuIGBVbmV4cGVjdGVkIGNoYXJhY3RlciBcIiR7Y2hhcn1cImA7XG59XG5cbmZ1bmN0aW9uIF91bmtub3duRW50aXR5RXJyb3JNc2coZW50aXR5U3JjOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gYFVua25vd24gZW50aXR5IFwiJHtlbnRpdHlTcmN9XCIgLSB1c2UgdGhlIFwiJiM8ZGVjaW1hbD47XCIgb3IgIFwiJiN4PGhleD47XCIgc3ludGF4YDtcbn1cblxuY2xhc3MgQ29udHJvbEZsb3dFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlcnJvcjogVG9rZW5FcnJvcikge31cbn1cblxuLy8gU2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1MS9zeW50YXguaHRtbCN3cml0aW5nXG5jbGFzcyBUb2tlbml6ZXIge1xuICBwcml2YXRlIF9pbnB1dDogc3RyaW5nO1xuICBwcml2YXRlIF9sZW5ndGg6IG51bWJlcjtcbiAgLy8gTm90ZTogdGhpcyBpcyBhbHdheXMgbG93ZXJjYXNlIVxuICBwcml2YXRlIF9wZWVrID0gLTE7XG4gIHByaXZhdGUgX25leHRQZWVrID0gLTE7XG4gIHByaXZhdGUgX2luZGV4ID0gLTE7XG4gIHByaXZhdGUgX2xpbmUgPSAwO1xuICBwcml2YXRlIF9jb2x1bW4gPSAtMTtcbiAgcHJpdmF0ZSBfY3VycmVudFRva2VuU3RhcnQ6IFBhcnNlTG9jYXRpb247XG4gIHByaXZhdGUgX2N1cnJlbnRUb2tlblR5cGU6IFRva2VuVHlwZTtcbiAgcHJpdmF0ZSBfZXhwYW5zaW9uQ2FzZVN0YWNrOiBUb2tlblR5cGVbXSA9IFtdO1xuICBwcml2YXRlIF9pbkludGVycG9sYXRpb24gPSBmYWxzZTtcblxuICB0b2tlbnM6IFRva2VuW10gPSBbXTtcbiAgZXJyb3JzOiBUb2tlbkVycm9yW10gPSBbXTtcblxuICAvKipcbiAgICogQHBhcmFtIF9maWxlIFRoZSBodG1sIHNvdXJjZVxuICAgKiBAcGFyYW0gX2dldFRhZ0RlZmluaXRpb25cbiAgICogQHBhcmFtIF90b2tlbml6ZUljdSBXaGV0aGVyIHRvIHRva2VuaXplIElDVSBtZXNzYWdlcyAoY29uc2lkZXJlZCBhcyB0ZXh0IG5vZGVzIHdoZW4gZmFsc2UpXG4gICAqIEBwYXJhbSBfaW50ZXJwb2xhdGlvbkNvbmZpZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfZmlsZTogUGFyc2VTb3VyY2VGaWxlLFxuICAgIHByaXZhdGUgX2dldFRhZ0RlZmluaXRpb246ICh0YWdOYW1lOiBzdHJpbmcpID0+IFRhZ0RlZmluaXRpb24sXG4gICAgcHJpdmF0ZSBfdG9rZW5pemVJY3U6IGJvb2xlYW4sXG4gICAgcHJpdmF0ZSBfaW50ZXJwb2xhdGlvbkNvbmZpZzogSW50ZXJwb2xhdGlvbkNvbmZpZyA9IERFRkFVTFRfSU5URVJQT0xBVElPTl9DT05GSUdcbiAgKSB7XG4gICAgdGhpcy5faW5wdXQgPSBfZmlsZS5jb250ZW50O1xuICAgIHRoaXMuX2xlbmd0aCA9IF9maWxlLmNvbnRlbnQubGVuZ3RoO1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Byb2Nlc3NDYXJyaWFnZVJldHVybnMoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNS9zeW50YXguaHRtbCNwcmVwcm9jZXNzaW5nLXRoZS1pbnB1dC1zdHJlYW1cbiAgICAvLyBJbiBvcmRlciB0byBrZWVwIHRoZSBvcmlnaW5hbCBwb3NpdGlvbiBpbiB0aGUgc291cmNlLCB3ZSBjYW4gbm90XG4gICAgLy8gcHJlLXByb2Nlc3MgaXQuXG4gICAgLy8gSW5zdGVhZCBDUnMgYXJlIHByb2Nlc3NlZCByaWdodCBiZWZvcmUgaW5zdGFudGlhdGluZyB0aGUgdG9rZW5zLlxuICAgIHJldHVybiBjb250ZW50LnJlcGxhY2UoX0NSX09SX0NSTEZfUkVHRVhQLCBcIlxcblwiKTtcbiAgfVxuXG4gIHRva2VuaXplKCk6IFRva2VuaXplUmVzdWx0IHtcbiAgICB3aGlsZSAodGhpcy5fcGVlayAhPT0gY2hhcnMuJEVPRikge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRoaXMuX2F0dGVtcHRDaGFyQ29kZShjaGFycy4kTFQpKSB7XG4gICAgICAgICAgaWYgKHRoaXMuX2F0dGVtcHRDaGFyQ29kZShjaGFycy4kQkFORykpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJExCUkFDS0VUKSkge1xuICAgICAgICAgICAgICB0aGlzLl9jb25zdW1lQ2RhdGEoc3RhcnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJE1JTlVTKSkge1xuICAgICAgICAgICAgICB0aGlzLl9jb25zdW1lQ29tbWVudChzdGFydCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLl9jb25zdW1lRG9jVHlwZShzdGFydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJFNMQVNIKSkge1xuICAgICAgICAgICAgdGhpcy5fY29uc3VtZVRhZ0Nsb3NlKHN0YXJ0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY29uc3VtZVRhZ09wZW4oc3RhcnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICghKHRoaXMuX3Rva2VuaXplSWN1ICYmIHRoaXMuX3Rva2VuaXplRXhwYW5zaW9uRm9ybSgpKSkge1xuICAgICAgICAgIHRoaXMuX2NvbnN1bWVUZXh0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBDb250cm9sRmxvd0Vycm9yKSB7XG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkVPRik7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuICAgIHJldHVybiBuZXcgVG9rZW5pemVSZXN1bHQobWVyZ2VUZXh0VG9rZW5zKHRoaXMudG9rZW5zKSwgdGhpcy5lcnJvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgYW4gSUNVIHRva2VuIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF90b2tlbml6ZUV4cGFuc2lvbkZvcm0oKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzRXhwYW5zaW9uRm9ybVN0YXJ0KHRoaXMuX2lucHV0LCB0aGlzLl9pbmRleCwgdGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZykpIHtcbiAgICAgIHRoaXMuX2NvbnN1bWVFeHBhbnNpb25Gb3JtU3RhcnQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChpc0V4cGFuc2lvbkNhc2VTdGFydCh0aGlzLl9wZWVrKSAmJiB0aGlzLl9pc0luRXhwYW5zaW9uRm9ybSgpKSB7XG4gICAgICB0aGlzLl9jb25zdW1lRXhwYW5zaW9uQ2FzZVN0YXJ0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGVlayA9PT0gY2hhcnMuJFJCUkFDRSkge1xuICAgICAgaWYgKHRoaXMuX2lzSW5FeHBhbnNpb25DYXNlKCkpIHtcbiAgICAgICAgdGhpcy5fY29uc3VtZUV4cGFuc2lvbkNhc2VFbmQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9pc0luRXhwYW5zaW9uRm9ybSgpKSB7XG4gICAgICAgIHRoaXMuX2NvbnN1bWVFeHBhbnNpb25Gb3JtRW5kKCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExvY2F0aW9uKCk6IFBhcnNlTG9jYXRpb24ge1xuICAgIHJldHVybiBuZXcgUGFyc2VMb2NhdGlvbih0aGlzLl9maWxlLCB0aGlzLl9pbmRleCwgdGhpcy5fbGluZSwgdGhpcy5fY29sdW1uKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNwYW4oXG4gICAgc3RhcnQ6IFBhcnNlTG9jYXRpb24gPSB0aGlzLl9nZXRMb2NhdGlvbigpLFxuICAgIGVuZDogUGFyc2VMb2NhdGlvbiA9IHRoaXMuX2dldExvY2F0aW9uKClcbiAgKTogUGFyc2VTb3VyY2VTcGFuIHtcbiAgICByZXR1cm4gbmV3IFBhcnNlU291cmNlU3BhbihzdGFydCwgZW5kKTtcbiAgfVxuXG4gIHByaXZhdGUgX2JlZ2luVG9rZW4odHlwZTogVG9rZW5UeXBlLCBzdGFydDogUGFyc2VMb2NhdGlvbiA9IHRoaXMuX2dldExvY2F0aW9uKCkpIHtcbiAgICB0aGlzLl9jdXJyZW50VG9rZW5TdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuX2N1cnJlbnRUb2tlblR5cGUgPSB0eXBlO1xuICB9XG5cbiAgcHJpdmF0ZSBfZW5kVG9rZW4ocGFydHM6IHN0cmluZ1tdLCBlbmQ6IFBhcnNlTG9jYXRpb24gPSB0aGlzLl9nZXRMb2NhdGlvbigpKTogVG9rZW4ge1xuICAgIGNvbnN0IHRva2VuID0gbmV3IFRva2VuKHRoaXMuX2N1cnJlbnRUb2tlblR5cGUsIHBhcnRzLCBuZXcgUGFyc2VTb3VyY2VTcGFuKHRoaXMuX2N1cnJlbnRUb2tlblN0YXJ0LCBlbmQpKTtcbiAgICB0aGlzLnRva2Vucy5wdXNoKHRva2VuKTtcbiAgICB0aGlzLl9jdXJyZW50VG9rZW5TdGFydCA9IG51bGwhO1xuICAgIHRoaXMuX2N1cnJlbnRUb2tlblR5cGUgPSBudWxsITtcbiAgICByZXR1cm4gdG9rZW47XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVFcnJvcihtc2c6IHN0cmluZywgc3BhbjogUGFyc2VTb3VyY2VTcGFuKTogQ29udHJvbEZsb3dFcnJvciB7XG4gICAgaWYgKHRoaXMuX2lzSW5FeHBhbnNpb25Gb3JtKCkpIHtcbiAgICAgIG1zZyArPSBgIChEbyB5b3UgaGF2ZSBhbiB1bmVzY2FwZWQgXCJ7XCIgaW4geW91ciB0ZW1wbGF0ZT8gVXNlIFwie3sgJ3snIH19XCIpIHRvIGVzY2FwZSBpdC4pYDtcbiAgICB9XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgVG9rZW5FcnJvcihtc2csIHRoaXMuX2N1cnJlbnRUb2tlblR5cGUsIHNwYW4pO1xuICAgIHRoaXMuX2N1cnJlbnRUb2tlblN0YXJ0ID0gbnVsbCE7XG4gICAgdGhpcy5fY3VycmVudFRva2VuVHlwZSA9IG51bGwhO1xuICAgIHJldHVybiBuZXcgQ29udHJvbEZsb3dFcnJvcihlcnJvcik7XG4gIH1cblxuICBwcml2YXRlIF9hZHZhbmNlKCkge1xuICAgIGlmICh0aGlzLl9pbmRleCA+PSB0aGlzLl9sZW5ndGgpIHtcbiAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKF91bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2coY2hhcnMuJEVPRiksIHRoaXMuX2dldFNwYW4oKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9wZWVrID09PSBjaGFycy4kTEYpIHtcbiAgICAgIHRoaXMuX2xpbmUrKztcbiAgICAgIHRoaXMuX2NvbHVtbiA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9wZWVrICE9PSBjaGFycy4kTEYgJiYgdGhpcy5fcGVlayAhPT0gY2hhcnMuJENSKSB7XG4gICAgICB0aGlzLl9jb2x1bW4rKztcbiAgICB9XG4gICAgdGhpcy5faW5kZXgrKztcbiAgICB0aGlzLl9wZWVrID0gdGhpcy5faW5kZXggPj0gdGhpcy5fbGVuZ3RoID8gY2hhcnMuJEVPRiA6IHRoaXMuX2lucHV0LmNoYXJDb2RlQXQodGhpcy5faW5kZXgpO1xuICAgIHRoaXMuX25leHRQZWVrID0gdGhpcy5faW5kZXggKyAxID49IHRoaXMuX2xlbmd0aCA/IGNoYXJzLiRFT0YgOiB0aGlzLl9pbnB1dC5jaGFyQ29kZUF0KHRoaXMuX2luZGV4ICsgMSk7XG4gIH1cblxuICBwcml2YXRlIF9hdHRlbXB0Q2hhckNvZGUoY2hhckNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9wZWVrID09PSBjaGFyQ29kZSkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2F0dGVtcHRDaGFyQ29kZUNhc2VJbnNlbnNpdGl2ZShjaGFyQ29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKGNvbXBhcmVDaGFyQ29kZUNhc2VJbnNlbnNpdGl2ZSh0aGlzLl9wZWVrLCBjaGFyQ29kZSkpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9yZXF1aXJlQ2hhckNvZGUoY2hhckNvZGU6IG51bWJlcikge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICBpZiAoIXRoaXMuX2F0dGVtcHRDaGFyQ29kZShjaGFyQ29kZSkpIHtcbiAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKF91bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2codGhpcy5fcGVlayksIHRoaXMuX2dldFNwYW4obG9jYXRpb24sIGxvY2F0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdFN0cihjaGFyczogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3QgbGVuID0gY2hhcnMubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9pbmRleCArIGxlbiA+IHRoaXMuX2xlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpbml0aWFsUG9zaXRpb24gPSB0aGlzLl9zYXZlUG9zaXRpb24oKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuX2F0dGVtcHRDaGFyQ29kZShjaGFycy5jaGFyQ29kZUF0KGkpKSkge1xuICAgICAgICAvLyBJZiBhdHRlbXB0aW5nIHRvIHBhcnNlIHRoZSBzdHJpbmcgZmFpbHMsIHdlIHdhbnQgdG8gcmVzZXQgdGhlIHBhcnNlclxuICAgICAgICAvLyB0byB3aGVyZSBpdCB3YXMgYmVmb3JlIHRoZSBhdHRlbXB0XG4gICAgICAgIHRoaXMuX3Jlc3RvcmVQb3NpdGlvbihpbml0aWFsUG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdFN0ckNhc2VJbnNlbnNpdGl2ZShjaGFyczogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0Q2hhckNvZGVDYXNlSW5zZW5zaXRpdmUoY2hhcnMuY2hhckNvZGVBdChpKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcXVpcmVTdHIoY2hhcnM6IHN0cmluZykge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICBpZiAoIXRoaXMuX2F0dGVtcHRTdHIoY2hhcnMpKSB7XG4gICAgICB0aHJvdyB0aGlzLl9jcmVhdGVFcnJvcihfdW5leHBlY3RlZENoYXJhY3RlckVycm9yTXNnKHRoaXMuX3BlZWspLCB0aGlzLl9nZXRTcGFuKGxvY2F0aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXR0ZW1wdENoYXJDb2RlVW50aWxGbihwcmVkaWNhdGU6IChjb2RlOiBudW1iZXIpID0+IGJvb2xlYW4pIHtcbiAgICB3aGlsZSAoIXByZWRpY2F0ZSh0aGlzLl9wZWVrKSkge1xuICAgICAgdGhpcy5fYWR2YW5jZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3JlcXVpcmVDaGFyQ29kZVVudGlsRm4ocHJlZGljYXRlOiAoY29kZTogbnVtYmVyKSA9PiBib29sZWFuLCBsZW46IG51bWJlcikge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKHByZWRpY2F0ZSk7XG4gICAgaWYgKHRoaXMuX2luZGV4IC0gc3RhcnQub2Zmc2V0IDwgbGVuKSB7XG4gICAgICB0aHJvdyB0aGlzLl9jcmVhdGVFcnJvcihfdW5leHBlY3RlZENoYXJhY3RlckVycm9yTXNnKHRoaXMuX3BlZWspLCB0aGlzLl9nZXRTcGFuKHN0YXJ0LCBzdGFydCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2F0dGVtcHRVbnRpbENoYXIoY2hhcjogbnVtYmVyKSB7XG4gICAgd2hpbGUgKHRoaXMuX3BlZWsgIT09IGNoYXIpIHtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZWFkQ2hhcihkZWNvZGVFbnRpdGllczogYm9vbGVhbik6IHN0cmluZyB7XG4gICAgaWYgKGRlY29kZUVudGl0aWVzICYmIHRoaXMuX3BlZWsgPT09IGNoYXJzLiRBTVBFUlNBTkQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWNvZGVFbnRpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9pbmRleDtcbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIHJldHVybiB0aGlzLl9pbnB1dFtpbmRleF07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGVjb2RlRW50aXR5KCk6IHN0cmluZyB7XG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9nZXRMb2NhdGlvbigpO1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKGNoYXJzLiRIQVNIKSkge1xuICAgICAgY29uc3QgaXNIZXggPSB0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJHgpIHx8IHRoaXMuX2F0dGVtcHRDaGFyQ29kZShjaGFycy4kWCk7XG4gICAgICBjb25zdCBudW1iZXJTdGFydCA9IHRoaXMuX2dldExvY2F0aW9uKCkub2Zmc2V0O1xuICAgICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc0RpZ2l0RW50aXR5RW5kKTtcbiAgICAgIGlmICh0aGlzLl9wZWVrICE9PSBjaGFycy4kU0VNSUNPTE9OKSB7XG4gICAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKF91bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2codGhpcy5fcGVlayksIHRoaXMuX2dldFNwYW4oKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBjb25zdCBzdHJOdW0gPSB0aGlzLl9pbnB1dC5zdWJzdHJpbmcobnVtYmVyU3RhcnQsIHRoaXMuX2luZGV4IC0gMSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjaGFyQ29kZSA9IHBhcnNlSW50KHN0ck51bSwgaXNIZXggPyAxNiA6IDEwKTtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoY2hhckNvZGUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zdCBlbnRpdHkgPSB0aGlzLl9pbnB1dC5zdWJzdHJpbmcoc3RhcnQub2Zmc2V0ICsgMSwgdGhpcy5faW5kZXggLSAxKTtcbiAgICAgICAgdGhyb3cgdGhpcy5fY3JlYXRlRXJyb3IoX3Vua25vd25FbnRpdHlFcnJvck1zZyhlbnRpdHkpLCB0aGlzLl9nZXRTcGFuKHN0YXJ0KSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHN0YXJ0UG9zaXRpb24gPSB0aGlzLl9zYXZlUG9zaXRpb24oKTtcbiAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOYW1lZEVudGl0eUVuZCk7XG4gICAgICBpZiAodGhpcy5fcGVlayAhPT0gY2hhcnMuJFNFTUlDT0xPTikge1xuICAgICAgICB0aGlzLl9yZXN0b3JlUG9zaXRpb24oc3RhcnRQb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9pbnB1dC5zdWJzdHJpbmcoc3RhcnQub2Zmc2V0ICsgMSwgdGhpcy5faW5kZXggLSAxKTtcbiAgICAgIGNvbnN0IGNoYXIgPSBOQU1FRF9FTlRJVElFU1tuYW1lXTtcbiAgICAgIGlmICghY2hhcikge1xuICAgICAgICB0aHJvdyB0aGlzLl9jcmVhdGVFcnJvcihfdW5rbm93bkVudGl0eUVycm9yTXNnKG5hbWUpLCB0aGlzLl9nZXRTcGFuKHN0YXJ0KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhcjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lUmF3VGV4dChkZWNvZGVFbnRpdGllczogYm9vbGVhbiwgZmlyc3RDaGFyT2ZFbmQ6IG51bWJlciwgYXR0ZW1wdEVuZFJlc3Q6ICgpID0+IGJvb2xlYW4pOiBUb2tlbiB7XG4gICAgbGV0IHRhZ0Nsb3NlU3RhcnQ6IFBhcnNlTG9jYXRpb247XG4gICAgY29uc3QgdGV4dFN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICB0aGlzLl9iZWdpblRva2VuKGRlY29kZUVudGl0aWVzID8gVG9rZW5UeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVCA6IFRva2VuVHlwZS5SQVdfVEVYVCwgdGV4dFN0YXJ0KTtcbiAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdGFnQ2xvc2VTdGFydCA9IHRoaXMuX2dldExvY2F0aW9uKCk7XG4gICAgICBpZiAodGhpcy5fYXR0ZW1wdENoYXJDb2RlKGZpcnN0Q2hhck9mRW5kKSAmJiBhdHRlbXB0RW5kUmVzdCgpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX2luZGV4ID4gdGFnQ2xvc2VTdGFydC5vZmZzZXQpIHtcbiAgICAgICAgLy8gYWRkIHRoZSBjaGFyYWN0ZXJzIGNvbnN1bWVkIGJ5IHRoZSBwcmV2aW91cyBpZiBzdGF0ZW1lbnQgdG8gdGhlIG91dHB1dFxuICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuX2lucHV0LnN1YnN0cmluZyh0YWdDbG9zZVN0YXJ0Lm9mZnNldCwgdGhpcy5faW5kZXgpKTtcbiAgICAgIH1cbiAgICAgIHdoaWxlICh0aGlzLl9wZWVrICE9PSBmaXJzdENoYXJPZkVuZCkge1xuICAgICAgICBwYXJ0cy5wdXNoKHRoaXMuX3JlYWRDaGFyKGRlY29kZUVudGl0aWVzKSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbmRUb2tlbihbdGhpcy5fcHJvY2Vzc0NhcnJpYWdlUmV0dXJucyhwYXJ0cy5qb2luKFwiXCIpKV0sIHRhZ0Nsb3NlU3RhcnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUNvbW1lbnQoc3RhcnQ6IFBhcnNlTG9jYXRpb24pIHtcbiAgICB0aGlzLl9iZWdpblRva2VuKFRva2VuVHlwZS5DT01NRU5UX1NUQVJULCBzdGFydCk7XG4gICAgdGhpcy5fcmVxdWlyZUNoYXJDb2RlKGNoYXJzLiRNSU5VUyk7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuICAgIGNvbnN0IHRleHRUb2tlbiA9IHRoaXMuX2NvbnN1bWVSYXdUZXh0KGZhbHNlLCBjaGFycy4kTUlOVVMsICgpID0+IHRoaXMuX2F0dGVtcHRTdHIoXCItPlwiKSk7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuQ09NTUVOVF9FTkQsIHRleHRUb2tlbi5zb3VyY2VTcGFuLmVuZCk7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZUNkYXRhKHN0YXJ0OiBQYXJzZUxvY2F0aW9uKSB7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuQ0RBVEFfU1RBUlQsIHN0YXJ0KTtcbiAgICB0aGlzLl9yZXF1aXJlU3RyKFwiQ0RBVEFbXCIpO1xuICAgIHRoaXMuX2VuZFRva2VuKFtdKTtcbiAgICBjb25zdCB0ZXh0VG9rZW4gPSB0aGlzLl9jb25zdW1lUmF3VGV4dChmYWxzZSwgY2hhcnMuJFJCUkFDS0VULCAoKSA9PiB0aGlzLl9hdHRlbXB0U3RyKFwiXT5cIikpO1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkNEQVRBX0VORCwgdGV4dFRva2VuLnNvdXJjZVNwYW4uZW5kKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lRG9jVHlwZShzdGFydDogUGFyc2VMb2NhdGlvbikge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkRPQ19UWVBFLCBzdGFydCk7XG4gICAgdGhpcy5fYXR0ZW1wdFVudGlsQ2hhcihjaGFycy4kR1QpO1xuICAgIHRoaXMuX2FkdmFuY2UoKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbdGhpcy5faW5wdXQuc3Vic3RyaW5nKHN0YXJ0Lm9mZnNldCArIDIsIHRoaXMuX2luZGV4IC0gMSldKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVQcmVmaXhBbmROYW1lKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBuYW1lT3JQcmVmaXhTdGFydCA9IHRoaXMuX2luZGV4O1xuICAgIGxldCBwcmVmaXg6IHN0cmluZyA9IG51bGwhO1xuICAgIHdoaWxlICh0aGlzLl9wZWVrICE9PSBjaGFycy4kQ09MT04gJiYgIWlzUHJlZml4RW5kKHRoaXMuX3BlZWspKSB7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfVxuICAgIGxldCBuYW1lU3RhcnQ6IG51bWJlcjtcbiAgICBpZiAodGhpcy5fcGVlayA9PT0gY2hhcnMuJENPTE9OKSB7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBwcmVmaXggPSB0aGlzLl9pbnB1dC5zdWJzdHJpbmcobmFtZU9yUHJlZml4U3RhcnQsIHRoaXMuX2luZGV4IC0gMSk7XG4gICAgICBuYW1lU3RhcnQgPSB0aGlzLl9pbmRleDtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZVN0YXJ0ID0gbmFtZU9yUHJlZml4U3RhcnQ7XG4gICAgfVxuICAgIHRoaXMuX3JlcXVpcmVDaGFyQ29kZVVudGlsRm4oaXNOYW1lRW5kLCB0aGlzLl9pbmRleCA9PT0gbmFtZVN0YXJ0ID8gMSA6IDApO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9pbnB1dC5zdWJzdHJpbmcobmFtZVN0YXJ0LCB0aGlzLl9pbmRleCk7XG4gICAgcmV0dXJuIFtwcmVmaXgsIG5hbWVdO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVRhZ09wZW4oc3RhcnQ6IFBhcnNlTG9jYXRpb24pIHtcbiAgICBjb25zdCBzYXZlZFBvcyA9IHRoaXMuX3NhdmVQb3NpdGlvbigpO1xuICAgIGxldCB0YWdOYW1lOiBzdHJpbmc7XG4gICAgbGV0IGxvd2VyY2FzZVRhZ05hbWU6IHN0cmluZztcbiAgICB0cnkge1xuICAgICAgaWYgKCFjaGFycy5pc0FzY2lpTGV0dGVyKHRoaXMuX3BlZWspKSB7XG4gICAgICAgIHRocm93IHRoaXMuX2NyZWF0ZUVycm9yKF91bmV4cGVjdGVkQ2hhcmFjdGVyRXJyb3JNc2codGhpcy5fcGVlayksIHRoaXMuX2dldFNwYW4oKSk7XG4gICAgICB9XG4gICAgICBjb25zdCBuYW1lU3RhcnQgPSB0aGlzLl9pbmRleDtcbiAgICAgIHRoaXMuX2NvbnN1bWVUYWdPcGVuU3RhcnQoc3RhcnQpO1xuICAgICAgdGFnTmFtZSA9IHRoaXMuX2lucHV0LnN1YnN0cmluZyhuYW1lU3RhcnQsIHRoaXMuX2luZGV4KTtcbiAgICAgIGxvd2VyY2FzZVRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG4gICAgICB3aGlsZSAodGhpcy5fcGVlayAhPT0gY2hhcnMuJFNMQVNIICYmIHRoaXMuX3BlZWsgIT09IGNoYXJzLiRHVCkge1xuICAgICAgICB0aGlzLl9jb25zdW1lQXR0cmlidXRlTmFtZSgpO1xuICAgICAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG4gICAgICAgIGlmICh0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJEVRKSkge1xuICAgICAgICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICAgICAgICB0aGlzLl9jb25zdW1lQXR0cmlidXRlVmFsdWUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9jb25zdW1lVGFnT3BlbkVuZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlIGluc3RhbmNlb2YgQ29udHJvbEZsb3dFcnJvcikge1xuICAgICAgICAvLyBXaGVuIHRoZSBzdGFydCB0YWcgaXMgaW52YWxpZCwgYXNzdW1lIHdlIHdhbnQgYSBcIjxcIlxuICAgICAgICB0aGlzLl9yZXN0b3JlUG9zaXRpb24oc2F2ZWRQb3MpO1xuICAgICAgICAvLyBCYWNrIHRvIGJhY2sgdGV4dCB0b2tlbnMgYXJlIG1lcmdlZCBhdCB0aGUgZW5kXG4gICAgICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLlRFWFQsIHN0YXJ0KTtcbiAgICAgICAgdGhpcy5fZW5kVG9rZW4oW1wiPFwiXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb250ZW50VG9rZW5UeXBlID0gdGhpcy5fZ2V0VGFnRGVmaW5pdGlvbih0YWdOYW1lKS5jb250ZW50VHlwZTtcblxuICAgIGlmIChjb250ZW50VG9rZW5UeXBlID09PSBUYWdDb250ZW50VHlwZS5SQVdfVEVYVCkge1xuICAgICAgdGhpcy5fY29uc3VtZVJhd1RleHRXaXRoVGFnQ2xvc2UobG93ZXJjYXNlVGFnTmFtZSwgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoY29udGVudFRva2VuVHlwZSA9PT0gVGFnQ29udGVudFR5cGUuRVNDQVBBQkxFX1JBV19URVhUKSB7XG4gICAgICB0aGlzLl9jb25zdW1lUmF3VGV4dFdpdGhUYWdDbG9zZShsb3dlcmNhc2VUYWdOYW1lLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lUmF3VGV4dFdpdGhUYWdDbG9zZShsb3dlcmNhc2VUYWdOYW1lOiBzdHJpbmcsIGRlY29kZUVudGl0aWVzOiBib29sZWFuKSB7XG4gICAgY29uc3QgdGV4dFRva2VuID0gdGhpcy5fY29uc3VtZVJhd1RleHQoZGVjb2RlRW50aXRpZXMsIGNoYXJzLiRMVCwgKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJFNMQVNIKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuICAgICAgaWYgKCF0aGlzLl9hdHRlbXB0U3RyQ2FzZUluc2Vuc2l0aXZlKGxvd2VyY2FzZVRhZ05hbWUpKSByZXR1cm4gZmFsc2U7XG4gICAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXR0ZW1wdENoYXJDb2RlKGNoYXJzLiRHVCk7XG4gICAgfSk7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuVEFHX0NMT1NFLCB0ZXh0VG9rZW4uc291cmNlU3Bhbi5lbmQpO1xuICAgIHRoaXMuX2VuZFRva2VuKFtudWxsISwgbG93ZXJjYXNlVGFnTmFtZV0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29uc3VtZVRhZ09wZW5TdGFydChzdGFydDogUGFyc2VMb2NhdGlvbikge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLlRBR19PUEVOX1NUQVJULCBzdGFydCk7XG4gICAgY29uc3QgcGFydHMgPSB0aGlzLl9jb25zdW1lUHJlZml4QW5kTmFtZSgpO1xuICAgIHRoaXMuX2VuZFRva2VuKHBhcnRzKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVBdHRyaWJ1dGVOYW1lKCkge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkFUVFJfTkFNRSk7XG4gICAgY29uc3QgcHJlZml4QW5kTmFtZSA9IHRoaXMuX2NvbnN1bWVQcmVmaXhBbmROYW1lKCk7XG4gICAgdGhpcy5fZW5kVG9rZW4ocHJlZml4QW5kTmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lQXR0cmlidXRlVmFsdWUoKSB7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuQVRUUl9WQUxVRSk7XG4gICAgbGV0IHZhbHVlOiBzdHJpbmc7XG4gICAgaWYgKHRoaXMuX3BlZWsgPT09IGNoYXJzLiRTUSB8fCB0aGlzLl9wZWVrID09PSBjaGFycy4kRFEpIHtcbiAgICAgIGNvbnN0IHF1b3RlQ2hhciA9IHRoaXMuX3BlZWs7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgICBjb25zdCBwYXJ0czogc3RyaW5nW10gPSBbXTtcbiAgICAgIHdoaWxlICh0aGlzLl9wZWVrICE9PSBxdW90ZUNoYXIpIHtcbiAgICAgICAgcGFydHMucHVzaCh0aGlzLl9yZWFkQ2hhcih0cnVlKSk7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHBhcnRzLmpvaW4oXCJcIik7XG4gICAgICB0aGlzLl9hZHZhbmNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlU3RhcnQgPSB0aGlzLl9pbmRleDtcbiAgICAgIHRoaXMuX3JlcXVpcmVDaGFyQ29kZVVudGlsRm4oaXNOYW1lRW5kLCAxKTtcbiAgICAgIHZhbHVlID0gdGhpcy5faW5wdXQuc3Vic3RyaW5nKHZhbHVlU3RhcnQsIHRoaXMuX2luZGV4KTtcbiAgICB9XG4gICAgdGhpcy5fZW5kVG9rZW4oW3RoaXMuX3Byb2Nlc3NDYXJyaWFnZVJldHVybnModmFsdWUpXSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lVGFnT3BlbkVuZCgpIHtcbiAgICBjb25zdCB0b2tlblR5cGUgPSB0aGlzLl9hdHRlbXB0Q2hhckNvZGUoY2hhcnMuJFNMQVNIKSA/IFRva2VuVHlwZS5UQUdfT1BFTl9FTkRfVk9JRCA6IFRva2VuVHlwZS5UQUdfT1BFTl9FTkQ7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbih0b2tlblR5cGUpO1xuICAgIHRoaXMuX3JlcXVpcmVDaGFyQ29kZShjaGFycy4kR1QpO1xuICAgIHRoaXMuX2VuZFRva2VuKFtdKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVUYWdDbG9zZShzdGFydDogUGFyc2VMb2NhdGlvbikge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLlRBR19DTE9TRSwgc3RhcnQpO1xuICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgICBjb25zdCBwcmVmaXhBbmROYW1lID0gdGhpcy5fY29uc3VtZVByZWZpeEFuZE5hbWUoKTtcbiAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG4gICAgdGhpcy5fcmVxdWlyZUNoYXJDb2RlKGNoYXJzLiRHVCk7XG4gICAgdGhpcy5fZW5kVG9rZW4ocHJlZml4QW5kTmFtZSk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lRXhwYW5zaW9uRm9ybVN0YXJ0KCkge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJULCB0aGlzLl9nZXRMb2NhdGlvbigpKTtcbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGUoY2hhcnMuJExCUkFDRSk7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10pO1xuXG4gICAgdGhpcy5fZXhwYW5zaW9uQ2FzZVN0YWNrLnB1c2goVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX1NUQVJUKTtcblxuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLlJBV19URVhULCB0aGlzLl9nZXRMb2NhdGlvbigpKTtcbiAgICBjb25zdCBjb25kaXRpb24gPSB0aGlzLl9yZWFkVW50aWwoY2hhcnMuJENPTU1BKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbY29uZGl0aW9uXSwgdGhpcy5fZ2V0TG9jYXRpb24oKSk7XG4gICAgdGhpcy5fcmVxdWlyZUNoYXJDb2RlKGNoYXJzLiRDT01NQSk7XG4gICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuXG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuUkFXX1RFWFQsIHRoaXMuX2dldExvY2F0aW9uKCkpO1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLl9yZWFkVW50aWwoY2hhcnMuJENPTU1BKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbdHlwZV0sIHRoaXMuX2dldExvY2F0aW9uKCkpO1xuICAgIHRoaXMuX3JlcXVpcmVDaGFyQ29kZShjaGFycy4kQ09NTUEpO1xuICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVFeHBhbnNpb25DYXNlU3RhcnQoKSB7XG4gICAgdGhpcy5fYmVnaW5Ub2tlbihUb2tlblR5cGUuRVhQQU5TSU9OX0NBU0VfVkFMVUUsIHRoaXMuX2dldExvY2F0aW9uKCkpO1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fcmVhZFVudGlsKGNoYXJzLiRMQlJBQ0UpLnRyaW0oKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbdmFsdWVdLCB0aGlzLl9nZXRMb2NhdGlvbigpKTtcbiAgICB0aGlzLl9hdHRlbXB0Q2hhckNvZGVVbnRpbEZuKGlzTm90V2hpdGVzcGFjZSk7XG5cbiAgICB0aGlzLl9iZWdpblRva2VuKFRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlQsIHRoaXMuX2dldExvY2F0aW9uKCkpO1xuICAgIHRoaXMuX3JlcXVpcmVDaGFyQ29kZShjaGFycy4kTEJSQUNFKTtcbiAgICB0aGlzLl9lbmRUb2tlbihbXSwgdGhpcy5fZ2V0TG9jYXRpb24oKSk7XG4gICAgdGhpcy5fYXR0ZW1wdENoYXJDb2RlVW50aWxGbihpc05vdFdoaXRlc3BhY2UpO1xuXG4gICAgdGhpcy5fZXhwYW5zaW9uQ2FzZVN0YWNrLnB1c2goVG9rZW5UeXBlLkVYUEFOU0lPTl9DQVNFX0VYUF9TVEFSVCk7XG4gIH1cblxuICBwcml2YXRlIF9jb25zdW1lRXhwYW5zaW9uQ2FzZUVuZCgpIHtcbiAgICB0aGlzLl9iZWdpblRva2VuKFRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfRU5ELCB0aGlzLl9nZXRMb2NhdGlvbigpKTtcbiAgICB0aGlzLl9yZXF1aXJlQ2hhckNvZGUoY2hhcnMuJFJCUkFDRSk7XG4gICAgdGhpcy5fZW5kVG9rZW4oW10sIHRoaXMuX2dldExvY2F0aW9uKCkpO1xuICAgIHRoaXMuX2F0dGVtcHRDaGFyQ29kZVVudGlsRm4oaXNOb3RXaGl0ZXNwYWNlKTtcblxuICAgIHRoaXMuX2V4cGFuc2lvbkNhc2VTdGFjay5wb3AoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVFeHBhbnNpb25Gb3JtRW5kKCkge1xuICAgIHRoaXMuX2JlZ2luVG9rZW4oVG9rZW5UeXBlLkVYUEFOU0lPTl9GT1JNX0VORCwgdGhpcy5fZ2V0TG9jYXRpb24oKSk7XG4gICAgdGhpcy5fcmVxdWlyZUNoYXJDb2RlKGNoYXJzLiRSQlJBQ0UpO1xuICAgIHRoaXMuX2VuZFRva2VuKFtdKTtcblxuICAgIHRoaXMuX2V4cGFuc2lvbkNhc2VTdGFjay5wb3AoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbnN1bWVUZXh0KCkge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5fZ2V0TG9jYXRpb24oKTtcbiAgICB0aGlzLl9iZWdpblRva2VuKFRva2VuVHlwZS5URVhULCBzdGFydCk7XG4gICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gW107XG5cbiAgICBkbyB7XG4gICAgICBpZiAodGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZyAmJiB0aGlzLl9hdHRlbXB0U3RyKHRoaXMuX2ludGVycG9sYXRpb25Db25maWcuc3RhcnQpKSB7XG4gICAgICAgIHBhcnRzLnB1c2godGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZy5zdGFydCk7XG4gICAgICAgIHRoaXMuX2luSW50ZXJwb2xhdGlvbiA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICB0aGlzLl9pbnRlcnBvbGF0aW9uQ29uZmlnICYmXG4gICAgICAgIHRoaXMuX2luSW50ZXJwb2xhdGlvbiAmJlxuICAgICAgICB0aGlzLl9hdHRlbXB0U3RyKHRoaXMuX2ludGVycG9sYXRpb25Db25maWcuZW5kKVxuICAgICAgKSB7XG4gICAgICAgIHBhcnRzLnB1c2godGhpcy5faW50ZXJwb2xhdGlvbkNvbmZpZy5lbmQpO1xuICAgICAgICB0aGlzLl9pbkludGVycG9sYXRpb24gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRzLnB1c2godGhpcy5fcmVhZENoYXIodHJ1ZSkpO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKCF0aGlzLl9pc1RleHRFbmQoKSk7XG5cbiAgICB0aGlzLl9lbmRUb2tlbihbdGhpcy5fcHJvY2Vzc0NhcnJpYWdlUmV0dXJucyhwYXJ0cy5qb2luKFwiXCIpKV0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNUZXh0RW5kKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9wZWVrID09PSBjaGFycy4kTFQgfHwgdGhpcy5fcGVlayA9PT0gY2hhcnMuJEVPRikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Rva2VuaXplSWN1ICYmICF0aGlzLl9pbkludGVycG9sYXRpb24pIHtcbiAgICAgIGlmIChpc0V4cGFuc2lvbkZvcm1TdGFydCh0aGlzLl9pbnB1dCwgdGhpcy5faW5kZXgsIHRoaXMuX2ludGVycG9sYXRpb25Db25maWcpKSB7XG4gICAgICAgIC8vIHN0YXJ0IG9mIGFuIGV4cGFuc2lvbiBmb3JtXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcGVlayA9PT0gY2hhcnMuJFJCUkFDRSAmJiB0aGlzLl9pc0luRXhwYW5zaW9uQ2FzZSgpKSB7XG4gICAgICAgIC8vIGVuZCBvZiBhbmQgZXhwYW5zaW9uIGNhc2VcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2F2ZVBvc2l0aW9uKCk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0ge1xuICAgIHJldHVybiBbdGhpcy5fcGVlaywgdGhpcy5faW5kZXgsIHRoaXMuX2NvbHVtbiwgdGhpcy5fbGluZSwgdGhpcy50b2tlbnMubGVuZ3RoXTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlYWRVbnRpbChjaGFyOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5faW5kZXg7XG4gICAgdGhpcy5fYXR0ZW1wdFVudGlsQ2hhcihjaGFyKTtcbiAgICByZXR1cm4gdGhpcy5faW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLl9pbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9yZXN0b3JlUG9zaXRpb24ocG9zaXRpb246IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXIsIG51bWJlcl0pOiB2b2lkIHtcbiAgICB0aGlzLl9wZWVrID0gcG9zaXRpb25bMF07XG4gICAgdGhpcy5faW5kZXggPSBwb3NpdGlvblsxXTtcbiAgICB0aGlzLl9jb2x1bW4gPSBwb3NpdGlvblsyXTtcbiAgICB0aGlzLl9saW5lID0gcG9zaXRpb25bM107XG4gICAgY29uc3QgbmJUb2tlbnMgPSBwb3NpdGlvbls0XTtcbiAgICBpZiAobmJUb2tlbnMgPCB0aGlzLnRva2Vucy5sZW5ndGgpIHtcbiAgICAgIC8vIHJlbW92ZSBhbnkgZXh0cmEgdG9rZW5zXG4gICAgICB0aGlzLnRva2VucyA9IHRoaXMudG9rZW5zLnNsaWNlKDAsIG5iVG9rZW5zKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pc0luRXhwYW5zaW9uQ2FzZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fZXhwYW5zaW9uQ2FzZVN0YWNrLmxlbmd0aCA+IDAgJiZcbiAgICAgIHRoaXMuX2V4cGFuc2lvbkNhc2VTdGFja1t0aGlzLl9leHBhbnNpb25DYXNlU3RhY2subGVuZ3RoIC0gMV0gPT09IFRva2VuVHlwZS5FWFBBTlNJT05fQ0FTRV9FWFBfU1RBUlRcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNJbkV4cGFuc2lvbkZvcm0oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2V4cGFuc2lvbkNhc2VTdGFjay5sZW5ndGggPiAwICYmXG4gICAgICB0aGlzLl9leHBhbnNpb25DYXNlU3RhY2tbdGhpcy5fZXhwYW5zaW9uQ2FzZVN0YWNrLmxlbmd0aCAtIDFdID09PSBUb2tlblR5cGUuRVhQQU5TSU9OX0ZPUk1fU1RBUlRcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzTm90V2hpdGVzcGFjZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuICFjaGFycy5pc1doaXRlc3BhY2UoY29kZSkgfHwgY29kZSA9PT0gY2hhcnMuJEVPRjtcbn1cblxuZnVuY3Rpb24gaXNOYW1lRW5kKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGNoYXJzLmlzV2hpdGVzcGFjZShjb2RlKSB8fFxuICAgIGNvZGUgPT09IGNoYXJzLiRHVCB8fFxuICAgIGNvZGUgPT09IGNoYXJzLiRTTEFTSCB8fFxuICAgIGNvZGUgPT09IGNoYXJzLiRTUSB8fFxuICAgIGNvZGUgPT09IGNoYXJzLiREUSB8fFxuICAgIGNvZGUgPT09IGNoYXJzLiRFUVxuICApO1xufVxuXG5mdW5jdGlvbiBpc1ByZWZpeEVuZChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoY29kZSA8IGNoYXJzLiRhIHx8IGNoYXJzLiR6IDwgY29kZSkgJiYgKGNvZGUgPCBjaGFycy4kQSB8fCBjaGFycy4kWiA8IGNvZGUpICYmIChjb2RlIDwgY2hhcnMuJDAgfHwgY29kZSA+IGNoYXJzLiQ5KVxuICApO1xufVxuXG5mdW5jdGlvbiBpc0RpZ2l0RW50aXR5RW5kKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA9PT0gY2hhcnMuJFNFTUlDT0xPTiB8fCBjb2RlID09PSBjaGFycy4kRU9GIHx8ICFjaGFycy5pc0FzY2lpSGV4RGlnaXQoY29kZSk7XG59XG5cbmZ1bmN0aW9uIGlzTmFtZWRFbnRpdHlFbmQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBjb2RlID09PSBjaGFycy4kU0VNSUNPTE9OIHx8IGNvZGUgPT09IGNoYXJzLiRFT0YgfHwgIWNoYXJzLmlzQXNjaWlMZXR0ZXIoY29kZSk7XG59XG5cbmZ1bmN0aW9uIGlzRXhwYW5zaW9uRm9ybVN0YXJ0KGlucHV0OiBzdHJpbmcsIG9mZnNldDogbnVtYmVyLCBpbnRlcnBvbGF0aW9uQ29uZmlnOiBJbnRlcnBvbGF0aW9uQ29uZmlnKTogYm9vbGVhbiB7XG4gIGNvbnN0IGlzSW50ZXJwb2xhdGlvblN0YXJ0ID0gaW50ZXJwb2xhdGlvbkNvbmZpZ1xuICAgID8gaW5wdXQuaW5kZXhPZihpbnRlcnBvbGF0aW9uQ29uZmlnLnN0YXJ0LCBvZmZzZXQpID09PSBvZmZzZXRcbiAgICA6IGZhbHNlO1xuXG4gIHJldHVybiBpbnB1dC5jaGFyQ29kZUF0KG9mZnNldCkgPT09IGNoYXJzLiRMQlJBQ0UgJiYgIWlzSW50ZXJwb2xhdGlvblN0YXJ0O1xufVxuXG5mdW5jdGlvbiBpc0V4cGFuc2lvbkNhc2VTdGFydChwZWVrOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIHBlZWsgPT09IGNoYXJzLiRFUSB8fCBjaGFycy5pc0FzY2lpTGV0dGVyKHBlZWspIHx8IGNoYXJzLmlzRGlnaXQocGVlayk7XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVDaGFyQ29kZUNhc2VJbnNlbnNpdGl2ZShjb2RlMTogbnVtYmVyLCBjb2RlMjogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiB0b1VwcGVyQ2FzZUNoYXJDb2RlKGNvZGUxKSA9PT0gdG9VcHBlckNhc2VDaGFyQ29kZShjb2RlMik7XG59XG5cbmZ1bmN0aW9uIHRvVXBwZXJDYXNlQ2hhckNvZGUoY29kZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGNvZGUgPj0gY2hhcnMuJGEgJiYgY29kZSA8PSBjaGFycy4keiA/IGNvZGUgLSBjaGFycy4kYSArIGNoYXJzLiRBIDogY29kZTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VUZXh0VG9rZW5zKHNyY1Rva2VuczogVG9rZW5bXSk6IFRva2VuW10ge1xuICBjb25zdCBkc3RUb2tlbnM6IFRva2VuW10gPSBbXTtcbiAgbGV0IGxhc3REc3RUb2tlbjogVG9rZW4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjVG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdG9rZW4gPSBzcmNUb2tlbnNbaV07XG4gICAgaWYgKGxhc3REc3RUb2tlbiAmJiBsYXN0RHN0VG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLlRFWFQgJiYgdG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLlRFWFQpIHtcbiAgICAgIGxhc3REc3RUb2tlbi5wYXJ0c1swXSArPSB0b2tlbi5wYXJ0c1swXTtcbiAgICAgIGxhc3REc3RUb2tlbi5zb3VyY2VTcGFuLmVuZCA9IHRva2VuLnNvdXJjZVNwYW4uZW5kO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0RHN0VG9rZW4gPSB0b2tlbjtcbiAgICAgIGRzdFRva2Vucy5wdXNoKGxhc3REc3RUb2tlbik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRzdFRva2Vucztcbn1cbiJdfQ==