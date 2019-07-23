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
import * as chars from "../ast/chars";
/** @enum {number} */
var TokenType = {
    Character: 0,
    Identifier: 1,
    Keyword: 2,
    String: 3,
    Operator: 4,
    Number: 5,
    Error: 6,
};
export { TokenType };
TokenType[TokenType.Character] = "Character";
TokenType[TokenType.Identifier] = "Identifier";
TokenType[TokenType.Keyword] = "Keyword";
TokenType[TokenType.String] = "String";
TokenType[TokenType.Operator] = "Operator";
TokenType[TokenType.Number] = "Number";
TokenType[TokenType.Error] = "Error";
var /** @type {?} */ KEYWORDS = ["var", "let", "as", "null", "undefined", "true", "false", "if", "else", "this"];
var Lexer = /** @class */ (function () {
    function Lexer() {
    }
    /**
     * @param {?} text
     * @return {?}
     */
    Lexer.prototype.tokenize = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        var /** @type {?} */ scanner = new Scanner(text);
        var /** @type {?} */ tokens = [];
        var /** @type {?} */ token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    return Lexer;
}());
export { Lexer };
var Token = /** @class */ (function () {
    function Token(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    /**
     * @param {?} code
     * @return {?}
     */
    Token.prototype.isCharacter = /**
     * @param {?} code
     * @return {?}
     */
    function (code) {
        return this.type === TokenType.Character && this.numValue === code;
    };
    /**
     * @return {?}
     */
    Token.prototype.isNumber = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Number;
    };
    /**
     * @return {?}
     */
    Token.prototype.isString = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.String;
    };
    /**
     * @param {?} operater
     * @return {?}
     */
    Token.prototype.isOperator = /**
     * @param {?} operater
     * @return {?}
     */
    function (operater) {
        return this.type === TokenType.Operator && this.strValue === operater;
    };
    /**
     * @return {?}
     */
    Token.prototype.isIdentifier = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Identifier;
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeyword = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword;
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordLet = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "let";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordAs = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "as";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordNull = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "null";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordUndefined = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "undefined";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordTrue = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "true";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordFalse = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "false";
    };
    /**
     * @return {?}
     */
    Token.prototype.isKeywordThis = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Keyword && this.strValue === "this";
    };
    /**
     * @return {?}
     */
    Token.prototype.isError = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Error;
    };
    /**
     * @return {?}
     */
    Token.prototype.toNumber = /**
     * @return {?}
     */
    function () {
        return this.type === TokenType.Number ? this.numValue : -1;
    };
    /**
     * @return {?}
     */
    Token.prototype.toString = /**
     * @return {?}
     */
    function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token;
}());
export { Token };
function Token_tsickle_Closure_declarations() {
    /** @type {?} */
    Token.prototype.index;
    /** @type {?} */
    Token.prototype.type;
    /** @type {?} */
    Token.prototype.numValue;
    /** @type {?} */
    Token.prototype.strValue;
}
/**
 * @param {?} index
 * @param {?} code
 * @return {?}
 */
function newCharacterToken(index, code) {
    return new Token(index, TokenType.Character, code, String.fromCharCode(code));
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newIdentifierToken(index, text) {
    return new Token(index, TokenType.Identifier, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newKeywordToken(index, text) {
    return new Token(index, TokenType.Keyword, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newOperatorToken(index, text) {
    return new Token(index, TokenType.Operator, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newStringToken(index, text) {
    return new Token(index, TokenType.String, 0, text);
}
/**
 * @param {?} index
 * @param {?} n
 * @return {?}
 */
function newNumberToken(index, n) {
    return new Token(index, TokenType.Number, n, "");
}
/**
 * @param {?} index
 * @param {?} message
 * @return {?}
 */
function newErrorToken(index, message) {
    return new Token(index, TokenType.Error, 0, message);
}
export var /** @type {?} */ EOF = new Token(-1, TokenType.Character, 0, "");
var Scanner = /** @class */ (function () {
    function Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    /**
     * @return {?}
     */
    Scanner.prototype.advance = /**
     * @return {?}
     */
    function () {
        this.peek = ++this.index >= this.length ? chars.$EOF : this.input.charCodeAt(this.index);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanToken = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ input = this.input;
        var /** @type {?} */ length = this.length;
        var /** @type {?} */ peek = this.peek;
        var /** @type {?} */ index = this.index;
        // Skip whitespace.
        while (peek <= chars.$SPACE) {
            if (++index >= length) {
                peek = chars.$EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek)) {
            return this.scanIdentifier();
        }
        if (chars.isDigit(peek)) {
            return this.scanNumber(index);
        }
        var /** @type {?} */ start = index;
        switch (peek) {
            case chars.$PERIOD:
                this.advance();
                return chars.isDigit(this.peek) ? this.scanNumber(start) : newCharacterToken(start, chars.$PERIOD);
            case chars.$LPAREN:
            case chars.$RPAREN:
            case chars.$LBRACE:
            case chars.$RBRACE:
            case chars.$LBRACKET:
            case chars.$RBRACKET:
            case chars.$COMMA:
            case chars.$COLON:
            case chars.$SEMICOLON:
                return this.scanCharacter(start, peek);
            case chars.$SQ:
            case chars.$DQ:
                return this.scanString();
            case chars.$HASH:
            case chars.$PLUS:
            case chars.$MINUS:
            case chars.$STAR:
            case chars.$SLASH:
            case chars.$PERCENT:
            case chars.$CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case chars.$QUESTION:
                return this.scanComplexOperator(start, "?", chars.$PERIOD, ".");
            case chars.$LT:
            case chars.$GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, "=");
            case chars.$BANG:
            case chars.$EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), chars.$EQ, "=", chars.$EQ, "=");
            case chars.$AMPERSAND:
                return this.scanComplexOperator(start, "&", chars.$AMPERSAND, "&");
            case chars.$BAR:
                return this.scanComplexOperator(start, "|", chars.$BAR, "|");
            case chars.$NBSP:
                while (chars.isWhitespace(this.peek)) {
                    this.advance();
                }
                return this.scanToken();
        }
        this.advance();
        return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
    };
    /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    Scanner.prototype.scanCharacter = /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    Scanner.prototype.scanOperator = /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param start start index in the expression
     * @param one first symbol (always part of the operator)
     * @param twoCode code point for the second symbol
     * @param two second symbol (part of the operator when the second code point matches)
     * @param threeCode code point for the third symbol
     * @param three third symbol (part of the operator when provided and matches source expression)
     */
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param {?} start start index in the expression
     * @param {?} one first symbol (always part of the operator)
     * @param {?} twoCode code point for the second symbol
     * @param {?} two second symbol (part of the operator when the second code point matches)
     * @param {?=} threeCode code point for the third symbol
     * @param {?=} three third symbol (part of the operator when provided and matches source expression)
     * @return {?}
     */
    Scanner.prototype.scanComplexOperator = /**
     * Tokenize a 2/3 char long operator
     *
     * @param {?} start start index in the expression
     * @param {?} one first symbol (always part of the operator)
     * @param {?} twoCode code point for the second symbol
     * @param {?} two second symbol (part of the operator when the second code point matches)
     * @param {?=} threeCode code point for the third symbol
     * @param {?=} three third symbol (part of the operator when provided and matches source expression)
     * @return {?}
     */
    function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var /** @type {?} */ str = one;
        if (this.peek === twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek === threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanIdentifier = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek)) {
            this.advance();
        }
        var /** @type {?} */ str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) : newIdentifierToken(start, str);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Scanner.prototype.scanNumber = /**
     * @param {?} start
     * @return {?}
     */
    function (start) {
        var /** @type {?} */ simple = this.index === start;
        this.advance(); // Skip initial digit.
        while (true) {
            if (chars.isDigit(this.peek)) {
                // Do nothing.
            }
            else if (this.peek === chars.$PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek)) {
                    this.advance();
                }
                if (!chars.isDigit(this.peek)) {
                    return this.error("Invalid exponent", -1);
                }
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var /** @type {?} */ str = this.input.substring(start, this.index);
        var /** @type {?} */ value = simple ? parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanString = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ start = this.index;
        var /** @type {?} */ quote = this.peek;
        this.advance(); // Skip initial quote.
        var /** @type {?} */ buffer = "";
        var /** @type {?} */ marker = this.index;
        var /** @type {?} */ input = this.input;
        while (this.peek !== quote) {
            if (this.peek === chars.$BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                var /** @type {?} */ unescapedCode = void 0;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek === chars.$u) {
                    // 4 character hex code for unicode character.
                    var /** @type {?} */ hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var /** @type {?} */ i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek === chars.$EOF) {
                return this.error("Unterminated quote", 0);
            }
            else {
                this.advance();
            }
        }
        var /** @type {?} */ last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, buffer + last);
    };
    /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    Scanner.prototype.error = /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    function (message, offset) {
        var /** @type {?} */ position = this.index + offset;
        return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return Scanner;
}());
function Scanner_tsickle_Closure_declarations() {
    /** @type {?} */
    Scanner.prototype.length;
    /** @type {?} */
    Scanner.prototype.peek;
    /** @type {?} */
    Scanner.prototype.index;
    /** @type {?} */
    Scanner.prototype.input;
}
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierStart(code) {
    return ((chars.$a <= code && code <= chars.$z) ||
        (chars.$A <= code && code <= chars.$Z) ||
        code === chars.$_ ||
        code === chars.$$);
}
/**
 * @param {?} input
 * @return {?}
 */
export function isIdentifier(input) {
    if (input.length === 0) {
        return false;
    }
    var /** @type {?} */ scanner = new Scanner(input);
    if (!isIdentifierStart(scanner.peek)) {
        return false;
    }
    scanner.advance();
    while (scanner.peek !== chars.$EOF) {
        if (!isIdentifierPart(scanner.peek)) {
            return false;
        }
        scanner.advance();
    }
    return true;
}
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierPart(code) {
    return chars.isAsciiLetter(code) || chars.isDigit(code) || code === chars.$_ || code === chars.$$;
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentStart(code) {
    return code === chars.$e || code === chars.$E;
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentSign(code) {
    return code === chars.$MINUS || code === chars.$PLUS;
}
/**
 * @param {?} code
 * @return {?}
 */
export function isQuote(code) {
    return code === chars.$SQ || code === chars.$DQ || code === chars.$BT;
}
/**
 * @param {?} code
 * @return {?}
 */
function unescape(code) {
    switch (code) {
        case chars.$n:
            return chars.$LF;
        case chars.$f:
            return chars.$FF;
        case chars.$r:
            return chars.$CR;
        case chars.$t:
            return chars.$TAB;
        case chars.$v:
            return chars.$VTAB;
        default:
            return code;
    }
}
/**
 * @param {?} text
 * @return {?}
 */
function parseIntAutoRadix(text) {
    var /** @type {?} */ result = parseInt(text, 10);
    if (isNaN(result)) {
        throw new Error("Invalid integer literal when parsing " + text);
    }
    return result;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4ZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL3BhcnNlci9sZXhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVVBLE9BQU8sS0FBSyxLQUFLLE1BQU0sY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWXRDLHFCQUFNLFFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBRWxHLElBQUE7Ozs7Ozs7SUFDRSx3QkFBUTs7OztJQUFSLFVBQVMsSUFBWTtRQUNuQixxQkFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEMscUJBQU0sTUFBTSxHQUFZLEVBQUUsQ0FBQztRQUMzQixxQkFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUM3QjtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDZjtnQkFsQ0g7SUFtQ0MsQ0FBQTtBQVhELGlCQVdDO0FBRUQsSUFBQTtJQUNFLGVBQW1CLEtBQWEsRUFBUyxJQUFlLEVBQVMsUUFBZ0IsRUFBUyxRQUFnQjtRQUF2RixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBVztRQUFTLGFBQVEsR0FBUixRQUFRLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO0tBQUk7Ozs7O0lBRTlHLDJCQUFXOzs7O0lBQVgsVUFBWSxJQUFZO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7S0FDcEU7Ozs7SUFFRCx3QkFBUTs7O0lBQVI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsTUFBTSxDQUFDO0tBQ3ZDOzs7O0lBRUQsd0JBQVE7OztJQUFSO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQztLQUN2Qzs7Ozs7SUFFRCwwQkFBVTs7OztJQUFWLFVBQVcsUUFBZ0I7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQztLQUN2RTs7OztJQUVELDRCQUFZOzs7SUFBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUM7S0FDM0M7Ozs7SUFFRCx5QkFBUzs7O0lBQVQ7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsT0FBTyxDQUFDO0tBQ3hDOzs7O0lBRUQsNEJBQVk7OztJQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQztLQUNuRTs7OztJQUVELDJCQUFXOzs7SUFBWDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7S0FDbEU7Ozs7SUFFRCw2QkFBYTs7O0lBQWI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDO0tBQ3BFOzs7O0lBRUQsa0NBQWtCOzs7SUFBbEI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO0tBQ3pFOzs7O0lBRUQsNkJBQWE7OztJQUFiO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQztLQUNwRTs7OztJQUVELDhCQUFjOzs7SUFBZDtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7S0FDckU7Ozs7SUFFRCw2QkFBYTs7O0lBQWI7UUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDO0tBQ3BFOzs7O0lBRUQsdUJBQU87OztJQUFQO1FBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEtBQUssQ0FBQztLQUN0Qzs7OztJQUVELHdCQUFROzs7SUFBUjtRQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7O0lBRUQsd0JBQVE7OztJQUFSO1FBQ0UsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEIsS0FBSyxTQUFTLENBQUMsU0FBUyxDQUFDO1lBQ3pCLEtBQUssU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUMxQixLQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUM7WUFDdkIsS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDO1lBQ3hCLEtBQUssU0FBUyxDQUFDLE1BQU0sQ0FBQztZQUN0QixLQUFLLFNBQVMsQ0FBQyxLQUFLO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2QixLQUFLLFNBQVMsQ0FBQyxNQUFNO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNsQztnQkFDRSxNQUFNLENBQUMsSUFBSSxDQUFDO1NBQ2Y7S0FDRjtnQkFsSEg7SUFtSEMsQ0FBQTtBQTlFRCxpQkE4RUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCwyQkFBMkIsS0FBYSxFQUFFLElBQVk7SUFDcEQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Q0FDL0U7Ozs7OztBQUVELDRCQUE0QixLQUFhLEVBQUUsSUFBWTtJQUNyRCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3hEOzs7Ozs7QUFFRCx5QkFBeUIsS0FBYSxFQUFFLElBQVk7SUFDbEQsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUNyRDs7Ozs7O0FBRUQsMEJBQTBCLEtBQWEsRUFBRSxJQUFZO0lBQ25ELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDdEQ7Ozs7OztBQUVELHdCQUF3QixLQUFhLEVBQUUsSUFBWTtJQUNqRCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQ3BEOzs7Ozs7QUFFRCx3QkFBd0IsS0FBYSxFQUFFLENBQVM7SUFDOUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNsRDs7Ozs7O0FBRUQsdUJBQXVCLEtBQWEsRUFBRSxPQUFlO0lBQ25ELE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Q0FDdEQ7QUFFRCxNQUFNLENBQUMscUJBQU0sR0FBRyxHQUFVLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRXBFLElBQUE7SUFLRSxpQkFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7b0JBSHpCLENBQUM7cUJBQ0EsQ0FBQyxDQUFDO1FBR1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQjs7OztJQUVELHlCQUFPOzs7SUFBUDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxRjs7OztJQUVELDJCQUFTOzs7SUFBVDtRQUNFLHFCQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLHFCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLHFCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLHFCQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDOztRQUd2QixPQUFPLElBQUksSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ2xCLEtBQUssQ0FBQzthQUNQO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDaEM7U0FDRjtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDYjs7UUFHRCxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUM5QjtRQUNELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBRUQscUJBQU0sS0FBSyxHQUFXLEtBQUssQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxLQUFLLENBQUMsT0FBTztnQkFDaEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNyRyxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDbkIsS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQ25CLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNuQixLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUM7WUFDbkIsS0FBSyxLQUFLLENBQUMsU0FBUyxDQUFDO1lBQ3JCLEtBQUssS0FBSyxDQUFDLFNBQVMsQ0FBQztZQUNyQixLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbEIsS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ2xCLEtBQUssS0FBSyxDQUFDLFVBQVU7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN6QyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDZixLQUFLLEtBQUssQ0FBQyxHQUFHO2dCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDM0IsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2pCLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNqQixLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDbEIsS0FBSyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2pCLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNsQixLQUFLLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDcEIsS0FBSyxLQUFLLENBQUMsTUFBTTtnQkFDZixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzdELEtBQUssS0FBSyxDQUFDLFNBQVM7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xFLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztZQUNmLEtBQUssS0FBSyxDQUFDLEdBQUc7Z0JBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3BGLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNqQixLQUFLLEtBQUssQ0FBQyxHQUFHO2dCQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNwRyxLQUFLLEtBQUssQ0FBQyxVQUFVO2dCQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyRSxLQUFLLEtBQUssQ0FBQyxJQUFJO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELEtBQUssS0FBSyxDQUFDLEtBQUs7Z0JBQ2QsT0FBTyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUNyQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2hCO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywyQkFBeUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzdFOzs7Ozs7SUFFRCwrQkFBYTs7Ozs7SUFBYixVQUFjLEtBQWEsRUFBRSxJQUFZO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDdkM7Ozs7OztJQUVELDhCQUFZOzs7OztJQUFaLFVBQWEsS0FBYSxFQUFFLEdBQVc7UUFDckMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyQztJQUVEOzs7Ozs7Ozs7T0FTRzs7Ozs7Ozs7Ozs7O0lBQ0gscUNBQW1COzs7Ozs7Ozs7OztJQUFuQixVQUNFLEtBQWEsRUFDYixHQUFXLEVBQ1gsT0FBZSxFQUNmLEdBQVcsRUFDWCxTQUFrQixFQUNsQixLQUFjO1FBRWQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YscUJBQUksR0FBRyxHQUFXLEdBQUcsQ0FBQztRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsR0FBRyxJQUFJLEdBQUcsQ0FBQztTQUNaO1FBQ0QsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsR0FBRyxJQUFJLEtBQUssQ0FBQztTQUNkO1FBQ0QsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyQzs7OztJQUVELGdDQUFjOzs7SUFBZDtRQUNFLHFCQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO1FBQ0QscUJBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNsRzs7Ozs7SUFFRCw0QkFBVTs7OztJQUFWLFVBQVcsS0FBYTtRQUN0QixxQkFBSSxNQUFNLEdBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7UUFDM0MsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7YUFFOUI7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxHQUFHLEtBQUssQ0FBQzthQUNoQjtZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2hCO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUMzQztnQkFDRCxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ2hCO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sS0FBSyxDQUFDO2FBQ1A7WUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDaEI7UUFDRCxxQkFBTSxHQUFHLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RCxxQkFBTSxLQUFLLEdBQVcsTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3JDOzs7O0lBRUQsNEJBQVU7OztJQUFWO1FBQ0UscUJBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDakMscUJBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWYscUJBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixxQkFBSSxNQUFNLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxxQkFBTSxLQUFLLEdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUVqQyxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNmLHFCQUFJLGFBQWEsU0FBUSxDQUFDOztnQkFFMUIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztvQkFFM0IscUJBQU0sR0FBRyxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDcEUsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLGFBQWEsR0FBRyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNuQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQ0FBOEIsR0FBRyxNQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7cUJBQzVEO29CQUNELEdBQUcsQ0FBQyxDQUFDLHFCQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUMzQixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7cUJBQ2hCO2lCQUNGO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7aUJBQ2hCO2dCQUNELE1BQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUM3QyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNyQjtZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1QztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNoQjtTQUNGO1FBRUQscUJBQU0sSUFBSSxHQUFXLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFZixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7S0FDN0M7Ozs7OztJQUVELHVCQUFLOzs7OztJQUFMLFVBQU0sT0FBZSxFQUFFLE1BQWM7UUFDbkMscUJBQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLGtCQUFnQixPQUFPLG1CQUFjLFFBQVEsd0JBQW1CLElBQUksQ0FBQyxLQUFLLE1BQUcsQ0FBQyxDQUFDO0tBQy9HO2tCQWhYSDtJQWlYQyxDQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFFRCwyQkFBMkIsSUFBWTtJQUNyQyxNQUFNLENBQUMsQ0FDTCxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3RDLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdEMsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQ2pCLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxDQUNsQixDQUFDO0NBQ0g7Ozs7O0FBRUQsTUFBTSx1QkFBdUIsS0FBYTtJQUN4QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNkO0lBQ0QscUJBQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2Q7SUFDRCxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbEIsT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ25CO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztDQUNiOzs7OztBQUVELDBCQUEwQixJQUFZO0lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLElBQUksSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUM7Q0FDbkc7Ozs7O0FBRUQseUJBQXlCLElBQVk7SUFDbkMsTUFBTSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO0NBQy9DOzs7OztBQUVELHdCQUF3QixJQUFZO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEtBQUssQ0FBQztDQUN0RDs7Ozs7QUFFRCxNQUFNLGtCQUFrQixJQUFZO0lBQ2xDLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztDQUN2RTs7Ozs7QUFFRCxrQkFBa0IsSUFBWTtJQUM1QixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2IsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1FBQ25CLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztRQUNuQixLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDbkIsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQ3BCLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUNyQjtZQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDZjtDQUNGOzs7OztBQUVELDJCQUEyQixJQUFZO0lBQ3JDLHFCQUFNLE1BQU0sR0FBVyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNqRTtJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7Q0FDZiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGUgKi9cblxuaW1wb3J0ICogYXMgY2hhcnMgZnJvbSBcIi4uL2FzdC9jaGFyc1wiO1xuXG5leHBvcnQgZW51bSBUb2tlblR5cGUge1xuICBDaGFyYWN0ZXIsXG4gIElkZW50aWZpZXIsXG4gIEtleXdvcmQsXG4gIFN0cmluZyxcbiAgT3BlcmF0b3IsXG4gIE51bWJlcixcbiAgRXJyb3Jcbn1cblxuY29uc3QgS0VZV09SRFMgPSBbXCJ2YXJcIiwgXCJsZXRcIiwgXCJhc1wiLCBcIm51bGxcIiwgXCJ1bmRlZmluZWRcIiwgXCJ0cnVlXCIsIFwiZmFsc2VcIiwgXCJpZlwiLCBcImVsc2VcIiwgXCJ0aGlzXCJdO1xuXG5leHBvcnQgY2xhc3MgTGV4ZXIge1xuICB0b2tlbml6ZSh0ZXh0OiBzdHJpbmcpOiBUb2tlbltdIHtcbiAgICBjb25zdCBzY2FubmVyID0gbmV3IFNjYW5uZXIodGV4dCk7XG4gICAgY29uc3QgdG9rZW5zOiBUb2tlbltdID0gW107XG4gICAgbGV0IHRva2VuID0gc2Nhbm5lci5zY2FuVG9rZW4oKTtcbiAgICB3aGlsZSAodG9rZW4gIT0gbnVsbCkge1xuICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgdG9rZW4gPSBzY2FubmVyLnNjYW5Ub2tlbigpO1xuICAgIH1cbiAgICByZXR1cm4gdG9rZW5zO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyLCBwdWJsaWMgdHlwZTogVG9rZW5UeXBlLCBwdWJsaWMgbnVtVmFsdWU6IG51bWJlciwgcHVibGljIHN0clZhbHVlOiBzdHJpbmcpIHt9XG5cbiAgaXNDaGFyYWN0ZXIoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLkNoYXJhY3RlciAmJiB0aGlzLm51bVZhbHVlID09PSBjb2RlO1xuICB9XG5cbiAgaXNOdW1iZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLk51bWJlcjtcbiAgfVxuXG4gIGlzU3RyaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFRva2VuVHlwZS5TdHJpbmc7XG4gIH1cblxuICBpc09wZXJhdG9yKG9wZXJhdGVyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSBUb2tlblR5cGUuT3BlcmF0b3IgJiYgdGhpcy5zdHJWYWx1ZSA9PT0gb3BlcmF0ZXI7XG4gIH1cblxuICBpc0lkZW50aWZpZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLklkZW50aWZpZXI7XG4gIH1cblxuICBpc0tleXdvcmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLktleXdvcmQ7XG4gIH1cblxuICBpc0tleXdvcmRMZXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PT0gXCJsZXRcIjtcbiAgfVxuXG4gIGlzS2V5d29yZEFzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT09IFwiYXNcIjtcbiAgfVxuXG4gIGlzS2V5d29yZE51bGwoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PT0gXCJudWxsXCI7XG4gIH1cblxuICBpc0tleXdvcmRVbmRlZmluZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PT0gXCJ1bmRlZmluZWRcIjtcbiAgfVxuXG4gIGlzS2V5d29yZFRydWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gVG9rZW5UeXBlLktleXdvcmQgJiYgdGhpcy5zdHJWYWx1ZSA9PT0gXCJ0cnVlXCI7XG4gIH1cblxuICBpc0tleXdvcmRGYWxzZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSBUb2tlblR5cGUuS2V5d29yZCAmJiB0aGlzLnN0clZhbHVlID09PSBcImZhbHNlXCI7XG4gIH1cblxuICBpc0tleXdvcmRUaGlzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFRva2VuVHlwZS5LZXl3b3JkICYmIHRoaXMuc3RyVmFsdWUgPT09IFwidGhpc1wiO1xuICB9XG5cbiAgaXNFcnJvcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSBUb2tlblR5cGUuRXJyb3I7XG4gIH1cblxuICB0b051bWJlcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09IFRva2VuVHlwZS5OdW1iZXIgPyB0aGlzLm51bVZhbHVlIDogLTE7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSBUb2tlblR5cGUuQ2hhcmFjdGVyOlxuICAgICAgY2FzZSBUb2tlblR5cGUuSWRlbnRpZmllcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLktleXdvcmQ6XG4gICAgICBjYXNlIFRva2VuVHlwZS5PcGVyYXRvcjpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLlN0cmluZzpcbiAgICAgIGNhc2UgVG9rZW5UeXBlLkVycm9yOlxuICAgICAgICByZXR1cm4gdGhpcy5zdHJWYWx1ZTtcbiAgICAgIGNhc2UgVG9rZW5UeXBlLk51bWJlcjpcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBuZXdDaGFyYWN0ZXJUb2tlbihpbmRleDogbnVtYmVyLCBjb2RlOiBudW1iZXIpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5DaGFyYWN0ZXIsIGNvZGUsIFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSkpO1xufVxuXG5mdW5jdGlvbiBuZXdJZGVudGlmaWVyVG9rZW4oaW5kZXg6IG51bWJlciwgdGV4dDogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuSWRlbnRpZmllciwgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld0tleXdvcmRUb2tlbihpbmRleDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5LZXl3b3JkLCAwLCB0ZXh0KTtcbn1cblxuZnVuY3Rpb24gbmV3T3BlcmF0b3JUb2tlbihpbmRleDogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpOiBUb2tlbiB7XG4gIHJldHVybiBuZXcgVG9rZW4oaW5kZXgsIFRva2VuVHlwZS5PcGVyYXRvciwgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld1N0cmluZ1Rva2VuKGluZGV4OiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgVG9rZW5UeXBlLlN0cmluZywgMCwgdGV4dCk7XG59XG5cbmZ1bmN0aW9uIG5ld051bWJlclRva2VuKGluZGV4OiBudW1iZXIsIG46IG51bWJlcik6IFRva2VuIHtcbiAgcmV0dXJuIG5ldyBUb2tlbihpbmRleCwgVG9rZW5UeXBlLk51bWJlciwgbiwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIG5ld0Vycm9yVG9rZW4oaW5kZXg6IG51bWJlciwgbWVzc2FnZTogc3RyaW5nKTogVG9rZW4ge1xuICByZXR1cm4gbmV3IFRva2VuKGluZGV4LCBUb2tlblR5cGUuRXJyb3IsIDAsIG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgY29uc3QgRU9GOiBUb2tlbiA9IG5ldyBUb2tlbigtMSwgVG9rZW5UeXBlLkNoYXJhY3RlciwgMCwgXCJcIik7XG5cbmNsYXNzIFNjYW5uZXIge1xuICBsZW5ndGg6IG51bWJlcjtcbiAgcGVlayA9IDA7XG4gIGluZGV4ID0gLTE7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGlucHV0OiBzdHJpbmcpIHtcbiAgICB0aGlzLmxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICB0aGlzLmFkdmFuY2UoKTtcbiAgfVxuXG4gIGFkdmFuY2UoKSB7XG4gICAgdGhpcy5wZWVrID0gKyt0aGlzLmluZGV4ID49IHRoaXMubGVuZ3RoID8gY2hhcnMuJEVPRiA6IHRoaXMuaW5wdXQuY2hhckNvZGVBdCh0aGlzLmluZGV4KTtcbiAgfVxuXG4gIHNjYW5Ub2tlbigpOiBUb2tlbiB8IG51bGwge1xuICAgIGNvbnN0IGlucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICBsZXQgcGVlayA9IHRoaXMucGVlaztcbiAgICBsZXQgaW5kZXggPSB0aGlzLmluZGV4O1xuXG4gICAgLy8gU2tpcCB3aGl0ZXNwYWNlLlxuICAgIHdoaWxlIChwZWVrIDw9IGNoYXJzLiRTUEFDRSkge1xuICAgICAgaWYgKCsraW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgIHBlZWsgPSBjaGFycy4kRU9GO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlZWsgPSBpbnB1dC5jaGFyQ29kZUF0KGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnBlZWsgPSBwZWVrO1xuICAgIHRoaXMuaW5kZXggPSBpbmRleDtcblxuICAgIGlmIChpbmRleCA+PSBsZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBpZGVudGlmaWVycyBhbmQgbnVtYmVycy5cbiAgICBpZiAoaXNJZGVudGlmaWVyU3RhcnQocGVlaykpIHtcbiAgICAgIHJldHVybiB0aGlzLnNjYW5JZGVudGlmaWVyKCk7XG4gICAgfVxuICAgIGlmIChjaGFycy5pc0RpZ2l0KHBlZWspKSB7XG4gICAgICByZXR1cm4gdGhpcy5zY2FuTnVtYmVyKGluZGV4KTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydDogbnVtYmVyID0gaW5kZXg7XG4gICAgc3dpdGNoIChwZWVrKSB7XG4gICAgICBjYXNlIGNoYXJzLiRQRVJJT0Q6XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICByZXR1cm4gY2hhcnMuaXNEaWdpdCh0aGlzLnBlZWspID8gdGhpcy5zY2FuTnVtYmVyKHN0YXJ0KSA6IG5ld0NoYXJhY3RlclRva2VuKHN0YXJ0LCBjaGFycy4kUEVSSU9EKTtcbiAgICAgIGNhc2UgY2hhcnMuJExQQVJFTjpcbiAgICAgIGNhc2UgY2hhcnMuJFJQQVJFTjpcbiAgICAgIGNhc2UgY2hhcnMuJExCUkFDRTpcbiAgICAgIGNhc2UgY2hhcnMuJFJCUkFDRTpcbiAgICAgIGNhc2UgY2hhcnMuJExCUkFDS0VUOlxuICAgICAgY2FzZSBjaGFycy4kUkJSQUNLRVQ6XG4gICAgICBjYXNlIGNoYXJzLiRDT01NQTpcbiAgICAgIGNhc2UgY2hhcnMuJENPTE9OOlxuICAgICAgY2FzZSBjaGFycy4kU0VNSUNPTE9OOlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuQ2hhcmFjdGVyKHN0YXJ0LCBwZWVrKTtcbiAgICAgIGNhc2UgY2hhcnMuJFNROlxuICAgICAgY2FzZSBjaGFycy4kRFE6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5TdHJpbmcoKTtcbiAgICAgIGNhc2UgY2hhcnMuJEhBU0g6XG4gICAgICBjYXNlIGNoYXJzLiRQTFVTOlxuICAgICAgY2FzZSBjaGFycy4kTUlOVVM6XG4gICAgICBjYXNlIGNoYXJzLiRTVEFSOlxuICAgICAgY2FzZSBjaGFycy4kU0xBU0g6XG4gICAgICBjYXNlIGNoYXJzLiRQRVJDRU5UOlxuICAgICAgY2FzZSBjaGFycy4kQ0FSRVQ6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5PcGVyYXRvcihzdGFydCwgU3RyaW5nLmZyb21DaGFyQ29kZShwZWVrKSk7XG4gICAgICBjYXNlIGNoYXJzLiRRVUVTVElPTjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgXCI/XCIsIGNoYXJzLiRQRVJJT0QsIFwiLlwiKTtcbiAgICAgIGNhc2UgY2hhcnMuJExUOlxuICAgICAgY2FzZSBjaGFycy4kR1Q6XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Db21wbGV4T3BlcmF0b3Ioc3RhcnQsIFN0cmluZy5mcm9tQ2hhckNvZGUocGVlayksIGNoYXJzLiRFUSwgXCI9XCIpO1xuICAgICAgY2FzZSBjaGFycy4kQkFORzpcbiAgICAgIGNhc2UgY2hhcnMuJEVROlxuICAgICAgICByZXR1cm4gdGhpcy5zY2FuQ29tcGxleE9wZXJhdG9yKHN0YXJ0LCBTdHJpbmcuZnJvbUNoYXJDb2RlKHBlZWspLCBjaGFycy4kRVEsIFwiPVwiLCBjaGFycy4kRVEsIFwiPVwiKTtcbiAgICAgIGNhc2UgY2hhcnMuJEFNUEVSU0FORDpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgXCImXCIsIGNoYXJzLiRBTVBFUlNBTkQsIFwiJlwiKTtcbiAgICAgIGNhc2UgY2hhcnMuJEJBUjpcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbkNvbXBsZXhPcGVyYXRvcihzdGFydCwgXCJ8XCIsIGNoYXJzLiRCQVIsIFwifFwiKTtcbiAgICAgIGNhc2UgY2hhcnMuJE5CU1A6XG4gICAgICAgIHdoaWxlIChjaGFycy5pc1doaXRlc3BhY2UodGhpcy5wZWVrKSkge1xuICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnNjYW5Ub2tlbigpO1xuICAgIH1cblxuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiB0aGlzLmVycm9yKGBVbmV4cGVjdGVkIGNoYXJhY3RlciBbJHtTdHJpbmcuZnJvbUNoYXJDb2RlKHBlZWspfV1gLCAwKTtcbiAgfVxuXG4gIHNjYW5DaGFyYWN0ZXIoc3RhcnQ6IG51bWJlciwgY29kZTogbnVtYmVyKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHJldHVybiBuZXdDaGFyYWN0ZXJUb2tlbihzdGFydCwgY29kZSk7XG4gIH1cblxuICBzY2FuT3BlcmF0b3Ioc3RhcnQ6IG51bWJlciwgc3RyOiBzdHJpbmcpOiBUb2tlbiB7XG4gICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgcmV0dXJuIG5ld09wZXJhdG9yVG9rZW4oc3RhcnQsIHN0cik7XG4gIH1cblxuICAvKipcbiAgICogVG9rZW5pemUgYSAyLzMgY2hhciBsb25nIG9wZXJhdG9yXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydCBzdGFydCBpbmRleCBpbiB0aGUgZXhwcmVzc2lvblxuICAgKiBAcGFyYW0gb25lIGZpcnN0IHN5bWJvbCAoYWx3YXlzIHBhcnQgb2YgdGhlIG9wZXJhdG9yKVxuICAgKiBAcGFyYW0gdHdvQ29kZSBjb2RlIHBvaW50IGZvciB0aGUgc2Vjb25kIHN5bWJvbFxuICAgKiBAcGFyYW0gdHdvIHNlY29uZCBzeW1ib2wgKHBhcnQgb2YgdGhlIG9wZXJhdG9yIHdoZW4gdGhlIHNlY29uZCBjb2RlIHBvaW50IG1hdGNoZXMpXG4gICAqIEBwYXJhbSB0aHJlZUNvZGUgY29kZSBwb2ludCBmb3IgdGhlIHRoaXJkIHN5bWJvbFxuICAgKiBAcGFyYW0gdGhyZWUgdGhpcmQgc3ltYm9sIChwYXJ0IG9mIHRoZSBvcGVyYXRvciB3aGVuIHByb3ZpZGVkIGFuZCBtYXRjaGVzIHNvdXJjZSBleHByZXNzaW9uKVxuICAgKi9cbiAgc2NhbkNvbXBsZXhPcGVyYXRvcihcbiAgICBzdGFydDogbnVtYmVyLFxuICAgIG9uZTogc3RyaW5nLFxuICAgIHR3b0NvZGU6IG51bWJlcixcbiAgICB0d286IHN0cmluZyxcbiAgICB0aHJlZUNvZGU/OiBudW1iZXIsXG4gICAgdGhyZWU/OiBzdHJpbmdcbiAgKTogVG9rZW4ge1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIGxldCBzdHI6IHN0cmluZyA9IG9uZTtcbiAgICBpZiAodGhpcy5wZWVrID09PSB0d29Db2RlKSB7XG4gICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgIHN0ciArPSB0d287XG4gICAgfVxuICAgIGlmICh0aHJlZUNvZGUgIT0gbnVsbCAmJiB0aGlzLnBlZWsgPT09IHRocmVlQ29kZSkge1xuICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICBzdHIgKz0gdGhyZWU7XG4gICAgfVxuICAgIHJldHVybiBuZXdPcGVyYXRvclRva2VuKHN0YXJ0LCBzdHIpO1xuICB9XG5cbiAgc2NhbklkZW50aWZpZXIoKTogVG9rZW4ge1xuICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIHdoaWxlIChpc0lkZW50aWZpZXJQYXJ0KHRoaXMucGVlaykpIHtcbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCBzdHI6IHN0cmluZyA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICByZXR1cm4gS0VZV09SRFMuaW5kZXhPZihzdHIpID4gLTEgPyBuZXdLZXl3b3JkVG9rZW4oc3RhcnQsIHN0cikgOiBuZXdJZGVudGlmaWVyVG9rZW4oc3RhcnQsIHN0cik7XG4gIH1cblxuICBzY2FuTnVtYmVyKHN0YXJ0OiBudW1iZXIpOiBUb2tlbiB7XG4gICAgbGV0IHNpbXBsZTogYm9vbGVhbiA9IHRoaXMuaW5kZXggPT09IHN0YXJ0O1xuICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBTa2lwIGluaXRpYWwgZGlnaXQuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChjaGFycy5pc0RpZ2l0KHRoaXMucGVlaykpIHtcbiAgICAgICAgLy8gRG8gbm90aGluZy5cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wZWVrID09PSBjaGFycy4kUEVSSU9EKSB7XG4gICAgICAgIHNpbXBsZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChpc0V4cG9uZW50U3RhcnQodGhpcy5wZWVrKSkge1xuICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgaWYgKGlzRXhwb25lbnRTaWduKHRoaXMucGVlaykpIHtcbiAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoYXJzLmlzRGlnaXQodGhpcy5wZWVrKSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVycm9yKFwiSW52YWxpZCBleHBvbmVudFwiLCAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgc2ltcGxlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgIH1cbiAgICBjb25zdCBzdHI6IHN0cmluZyA9IHRoaXMuaW5wdXQuc3Vic3RyaW5nKHN0YXJ0LCB0aGlzLmluZGV4KTtcbiAgICBjb25zdCB2YWx1ZTogbnVtYmVyID0gc2ltcGxlID8gcGFyc2VJbnRBdXRvUmFkaXgoc3RyKSA6IHBhcnNlRmxvYXQoc3RyKTtcbiAgICByZXR1cm4gbmV3TnVtYmVyVG9rZW4oc3RhcnQsIHZhbHVlKTtcbiAgfVxuXG4gIHNjYW5TdHJpbmcoKTogVG9rZW4ge1xuICAgIGNvbnN0IHN0YXJ0OiBudW1iZXIgPSB0aGlzLmluZGV4O1xuICAgIGNvbnN0IHF1b3RlOiBudW1iZXIgPSB0aGlzLnBlZWs7XG4gICAgdGhpcy5hZHZhbmNlKCk7IC8vIFNraXAgaW5pdGlhbCBxdW90ZS5cblxuICAgIGxldCBidWZmZXIgPSBcIlwiO1xuICAgIGxldCBtYXJrZXI6IG51bWJlciA9IHRoaXMuaW5kZXg7XG4gICAgY29uc3QgaW5wdXQ6IHN0cmluZyA9IHRoaXMuaW5wdXQ7XG5cbiAgICB3aGlsZSAodGhpcy5wZWVrICE9PSBxdW90ZSkge1xuICAgICAgaWYgKHRoaXMucGVlayA9PT0gY2hhcnMuJEJBQ0tTTEFTSCkge1xuICAgICAgICBidWZmZXIgKz0gaW5wdXQuc3Vic3RyaW5nKG1hcmtlciwgdGhpcy5pbmRleCk7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgICBsZXQgdW5lc2NhcGVkQ29kZTogbnVtYmVyO1xuICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBUUzIuMS1pbnRyb2R1Y2VkIHR5cGUgc3RyaWN0bmVzc1xuICAgICAgICB0aGlzLnBlZWsgPSB0aGlzLnBlZWs7XG4gICAgICAgIGlmICh0aGlzLnBlZWsgPT09IGNoYXJzLiR1KSB7XG4gICAgICAgICAgLy8gNCBjaGFyYWN0ZXIgaGV4IGNvZGUgZm9yIHVuaWNvZGUgY2hhcmFjdGVyLlxuICAgICAgICAgIGNvbnN0IGhleDogc3RyaW5nID0gaW5wdXQuc3Vic3RyaW5nKHRoaXMuaW5kZXggKyAxLCB0aGlzLmluZGV4ICsgNSk7XG4gICAgICAgICAgaWYgKC9eWzAtOWEtZl0rJC9pLnRlc3QoaGV4KSkge1xuICAgICAgICAgICAgdW5lc2NhcGVkQ29kZSA9IHBhcnNlSW50KGhleCwgMTYpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihgSW52YWxpZCB1bmljb2RlIGVzY2FwZSBbXFxcXHUke2hleH1dYCwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdW5lc2NhcGVkQ29kZSA9IHVuZXNjYXBlKHRoaXMucGVlayk7XG4gICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodW5lc2NhcGVkQ29kZSk7XG4gICAgICAgIG1hcmtlciA9IHRoaXMuaW5kZXg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucGVlayA9PT0gY2hhcnMuJEVPRikge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBxdW90ZVwiLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxhc3Q6IHN0cmluZyA9IGlucHV0LnN1YnN0cmluZyhtYXJrZXIsIHRoaXMuaW5kZXgpO1xuICAgIHRoaXMuYWR2YW5jZSgpOyAvLyBTa2lwIHRlcm1pbmF0aW5nIHF1b3RlLlxuXG4gICAgcmV0dXJuIG5ld1N0cmluZ1Rva2VuKHN0YXJ0LCBidWZmZXIgKyBsYXN0KTtcbiAgfVxuXG4gIGVycm9yKG1lc3NhZ2U6IHN0cmluZywgb2Zmc2V0OiBudW1iZXIpOiBUb2tlbiB7XG4gICAgY29uc3QgcG9zaXRpb246IG51bWJlciA9IHRoaXMuaW5kZXggKyBvZmZzZXQ7XG4gICAgcmV0dXJuIG5ld0Vycm9yVG9rZW4ocG9zaXRpb24sIGBMZXhlciBFcnJvcjogJHttZXNzYWdlfSBhdCBjb2x1bW4gJHtwb3NpdGlvbn0gaW4gZXhwcmVzc2lvbiBbJHt0aGlzLmlucHV0fV1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0lkZW50aWZpZXJTdGFydChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAoY2hhcnMuJGEgPD0gY29kZSAmJiBjb2RlIDw9IGNoYXJzLiR6KSB8fFxuICAgIChjaGFycy4kQSA8PSBjb2RlICYmIGNvZGUgPD0gY2hhcnMuJFopIHx8XG4gICAgY29kZSA9PT0gY2hhcnMuJF8gfHxcbiAgICBjb2RlID09PSBjaGFycy4kJFxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJZGVudGlmaWVyKGlucHV0OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgaWYgKGlucHV0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBzY2FubmVyID0gbmV3IFNjYW5uZXIoaW5wdXQpO1xuICBpZiAoIWlzSWRlbnRpZmllclN0YXJ0KHNjYW5uZXIucGVlaykpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc2Nhbm5lci5hZHZhbmNlKCk7XG4gIHdoaWxlIChzY2FubmVyLnBlZWsgIT09IGNoYXJzLiRFT0YpIHtcbiAgICBpZiAoIWlzSWRlbnRpZmllclBhcnQoc2Nhbm5lci5wZWVrKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzY2FubmVyLmFkdmFuY2UoKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNJZGVudGlmaWVyUGFydChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNoYXJzLmlzQXNjaWlMZXR0ZXIoY29kZSkgfHwgY2hhcnMuaXNEaWdpdChjb2RlKSB8fCBjb2RlID09PSBjaGFycy4kXyB8fCBjb2RlID09PSBjaGFycy4kJDtcbn1cblxuZnVuY3Rpb24gaXNFeHBvbmVudFN0YXJ0KGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA9PT0gY2hhcnMuJGUgfHwgY29kZSA9PT0gY2hhcnMuJEU7XG59XG5cbmZ1bmN0aW9uIGlzRXhwb25lbnRTaWduKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gY29kZSA9PT0gY2hhcnMuJE1JTlVTIHx8IGNvZGUgPT09IGNoYXJzLiRQTFVTO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNRdW90ZShjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNvZGUgPT09IGNoYXJzLiRTUSB8fCBjb2RlID09PSBjaGFycy4kRFEgfHwgY29kZSA9PT0gY2hhcnMuJEJUO1xufVxuXG5mdW5jdGlvbiB1bmVzY2FwZShjb2RlOiBudW1iZXIpOiBudW1iZXIge1xuICBzd2l0Y2ggKGNvZGUpIHtcbiAgICBjYXNlIGNoYXJzLiRuOlxuICAgICAgcmV0dXJuIGNoYXJzLiRMRjtcbiAgICBjYXNlIGNoYXJzLiRmOlxuICAgICAgcmV0dXJuIGNoYXJzLiRGRjtcbiAgICBjYXNlIGNoYXJzLiRyOlxuICAgICAgcmV0dXJuIGNoYXJzLiRDUjtcbiAgICBjYXNlIGNoYXJzLiR0OlxuICAgICAgcmV0dXJuIGNoYXJzLiRUQUI7XG4gICAgY2FzZSBjaGFycy4kdjpcbiAgICAgIHJldHVybiBjaGFycy4kVlRBQjtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGNvZGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VJbnRBdXRvUmFkaXgodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgcmVzdWx0OiBudW1iZXIgPSBwYXJzZUludCh0ZXh0LCAxMCk7XG4gIGlmIChpc05hTihyZXN1bHQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBpbnRlZ2VyIGxpdGVyYWwgd2hlbiBwYXJzaW5nIFwiICsgdGV4dCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==