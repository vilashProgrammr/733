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
/**
 * @param {?} message
 * @return {?}
 */
export function digest(message) {
    return message.id || sha1(serializeNodes(message.nodes).join("") + ("[" + message.meaning + "]"));
}
/**
 * @param {?} message
 * @return {?}
 */
export function decimalDigest(message) {
    if (message.id) {
        return message.id;
    }
    var /** @type {?} */ visitor = new SerializerIgnoreIcuExpVisitor();
    var /** @type {?} */ parts = message.nodes.map(function (a) { return a.visit(visitor, null); });
    return computeMsgId(parts.join(""), message.meaning);
}
/**
 * Serialize the i18n html to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * \@internal
 */
var /**
 * Serialize the i18n html to something xml-like in order to generate an UID.
 *
 * The visitor is also used in the i18n parser tests
 *
 * \@internal
 */
SerializerVisitor = /** @class */ (function () {
    function SerializerVisitor() {
    }
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    function (text, context) {
        return text.value;
    };
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        return "[" + container.children.map(function (child) { return child.visit(_this); }).join(", ") + "]";
    };
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        return "{" + icu.expression + ", " + icu.type + ", " + strCases.join(", ") + "}";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    function (ph, context) {
        var _this = this;
        return ph.isVoid
            ? "<ph tag name=\"" + ph.startName + "\"/>"
            : "<ph tag name=\"" + ph.startName + "\">" + ph.children.map(function (child) { return child.visit(_this); }).join(", ") + "</ph name=\"" + ph.closeName + "\">";
    };
    /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?} context
     * @return {?}
     */
    function (ph, context) {
        return ph.value ? "<ph name=\"" + ph.name + "\">" + ph.value + "</ph>" : "<ph name=\"" + ph.name + "\"/>";
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    SerializerVisitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        return "<ph icu name=\"" + ph.name + "\">" + ph.value.visit(this) + "</ph>";
    };
    return SerializerVisitor;
}());
var /** @type {?} */ serializerVisitor = new SerializerVisitor();
/**
 * @param {?} nodes
 * @return {?}
 */
export function serializeNodes(nodes) {
    return nodes.map(function (a) { return a.visit(serializerVisitor, null); });
}
/**
 * Serialize the i18n html to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * \@internal
 */
var /**
 * Serialize the i18n html to something xml-like in order to generate an UID.
 *
 * Ignore the ICU expressions so that message IDs stays identical if only the expression changes.
 *
 * \@internal
 */
SerializerIgnoreIcuExpVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializerIgnoreIcuExpVisitor, _super);
    function SerializerIgnoreIcuExpVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    SerializerIgnoreIcuExpVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ strCases = Object.keys(icu.cases).map(function (k) { return k + " {" + icu.cases[k].visit(_this) + "}"; });
        // Do not take the expression into account
        return "{" + icu.type + ", " + strCases.join(", ") + "}";
    };
    return SerializerIgnoreIcuExpVisitor;
}(SerializerVisitor));
/**
 * Compute the SHA1 of the given string
 *
 * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 * @param {?} str
 * @return {?}
 */
export function sha1(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    var /** @type {?} */ len = utf8.length * 8;
    var /** @type {?} */ w = new Array(80);
    var _a = tslib_1.__read([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], 5), a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[(((len + 64) >> 9) << 4) + 15] = len;
    for (var /** @type {?} */ i = 0; i < words32.length; i += 16) {
        var _b = tslib_1.__read([a, b, c, d, e], 5), h0 = _b[0], h1 = _b[1], h2 = _b[2], h3 = _b[3], h4 = _b[4];
        for (var /** @type {?} */ j = 0; j < 80; j++) {
            /* tslint:disable-next-line */
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var _c = tslib_1.__read(fk(j, b, c, d), 2), f = _c[0], k = _c[1];
            var /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            _d = tslib_1.__read([d, c, rol32(b, 30), a, temp], 5), e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
        }
        _e = tslib_1.__read([add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], 5), a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
    var _d, _e;
}
/**
 * @param {?} index
 * @param {?} b
 * @param {?} c
 * @param {?} d
 * @return {?}
 */
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 * Compute the fingerprint of the given string
 *
 * The output is 64 bit number encoded as a decimal string
 *
 * based on:
 * https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/GoogleJsMessageIdGenerator.java
 * @param {?} str
 * @return {?}
 */
export function fingerprint(str) {
    var /** @type {?} */ utf8 = utf8Encode(str);
    var _a = tslib_1.__read([hash32(utf8, 0), hash32(utf8, 102072)], 2), hi = _a[0], lo = _a[1];
    if (hi === 0 && (lo === 0 || lo === 1)) {
        hi = hi ^ 0x130f9bef;
        lo = lo ^ -0x6b5f56d8;
    }
    return [hi, lo];
}
/**
 * @param {?} msg
 * @param {?} meaning
 * @return {?}
 */
export function computeMsgId(msg, meaning) {
    var _a = tslib_1.__read(fingerprint(msg), 2), hi = _a[0], lo = _a[1];
    if (meaning) {
        var _b = tslib_1.__read(fingerprint(meaning), 2), him = _b[0], lom = _b[1];
        _c = tslib_1.__read(add64(rol64([hi, lo], 1), [him, lom]), 2), hi = _c[0], lo = _c[1];
    }
    return byteStringToDecString(words32ToByteString([hi & 0x7fffffff, lo]));
    var _c;
}
/**
 * @param {?} str
 * @param {?} c
 * @return {?}
 */
function hash32(str, c) {
    var _a = tslib_1.__read([0x9e3779b9, 0x9e3779b9], 2), a = _a[0], b = _a[1];
    var /** @type {?} */ i;
    var /** @type {?} */ len = str.length;
    for (i = 0; i + 12 <= len; i += 12) {
        a = add32(a, wordAt(str, i, Endian.Little));
        b = add32(b, wordAt(str, i + 4, Endian.Little));
        c = add32(c, wordAt(str, i + 8, Endian.Little));
        _b = tslib_1.__read(mix([a, b, c]), 3), a = _b[0], b = _b[1], c = _b[2];
    }
    a = add32(a, wordAt(str, i, Endian.Little));
    b = add32(b, wordAt(str, i + 4, Endian.Little));
    // the first byte of c is reserved for the length
    c = add32(c, len);
    c = add32(c, wordAt(str, i + 8, Endian.Little) << 8);
    return mix([a, b, c])[2];
    var _b;
}
/**
 * @param {?} __0
 * @return {?}
 */
function mix(_a) {
    var _b = tslib_1.__read(_a, 3), a = _b[0], b = _b[1], c = _b[2];
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 13;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 8;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 13;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 12;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 16;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 5;
    a = sub32(a, b);
    a = sub32(a, c);
    a ^= c >>> 3;
    b = sub32(b, c);
    b = sub32(b, a);
    b ^= a << 10;
    c = sub32(c, a);
    c = sub32(c, b);
    c ^= b >>> 15;
    return [a, b, c];
}
/** @enum {number} */
var Endian = {
    Little: 0,
    Big: 1,
};
Endian[Endian.Little] = "Little";
Endian[Endian.Big] = "Big";
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32(a, b) {
    return add32to64(a, b)[1];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32to64(a, b) {
    var /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    var /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
/**
 * @param {?} __0
 * @param {?} __1
 * @return {?}
 */
function add64(_a, _b) {
    var _c = tslib_1.__read(_a, 2), ah = _c[0], al = _c[1];
    var _d = tslib_1.__read(_b, 2), bh = _d[0], bl = _d[1];
    var _e = tslib_1.__read(add32to64(al, bl), 2), carry = _e[0], l = _e[1];
    var /** @type {?} */ h = add32(add32(ah, bh), carry);
    return [h, l];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function sub32(a, b) {
    var /** @type {?} */ low = (a & 0xffff) - (b & 0xffff);
    var /** @type {?} */ high = (a >> 16) - (b >> 16) + (low >> 16);
    return (high << 16) | (low & 0xffff);
}
/**
 * @param {?} a
 * @param {?} count
 * @return {?}
 */
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
/**
 * @param {?} __0
 * @param {?} count
 * @return {?}
 */
function rol64(_a, count) {
    var _b = tslib_1.__read(_a, 2), hi = _b[0], lo = _b[1];
    var /** @type {?} */ h = (hi << count) | (lo >>> (32 - count));
    var /** @type {?} */ l = (lo << count) | (hi >>> (32 - count));
    return [h, l];
}
/**
 * @param {?} str
 * @param {?} endian
 * @return {?}
 */
function stringToWords32(str, endian) {
    var /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (var /** @type {?} */ i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
    }
    return words32;
}
/**
 * @param {?} str
 * @param {?} index
 * @return {?}
 */
function byteAt(str, index) {
    return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
}
/**
 * @param {?} str
 * @param {?} index
 * @param {?} endian
 * @return {?}
 */
function wordAt(str, index, endian) {
    var /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (8 * i);
        }
    }
    return word;
}
/**
 * @param {?} words32
 * @return {?}
 */
function words32ToByteString(words32) {
    return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, "");
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    var /** @type {?} */ str = "";
    for (var /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> (8 * (3 - i))) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    var /** @type {?} */ hex = "";
    for (var /** @type {?} */ i = 0; i < str.length; i++) {
        var /** @type {?} */ b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToDecString(str) {
    var /** @type {?} */ decimal = "";
    var /** @type {?} */ toThePower = "1";
    for (var /** @type {?} */ i = str.length - 1; i >= 0; i--) {
        decimal = addBigInt(decimal, numberTimesBigInt(byteAt(str, i), toThePower));
        toThePower = numberTimesBigInt(256, toThePower);
    }
    return decimal
        .split("")
        .reverse()
        .join("");
}
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function addBigInt(x, y) {
    var /** @type {?} */ sum = "";
    var /** @type {?} */ len = Math.max(x.length, y.length);
    for (var /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        var /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
            carry = 1;
            sum += tmpSum - 10;
        }
        else {
            carry = 0;
            sum += tmpSum;
        }
    }
    return sum;
}
/**
 * @param {?} num
 * @param {?} b
 * @return {?}
 */
function numberTimesBigInt(num, b) {
    var /** @type {?} */ product = "";
    var /** @type {?} */ bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1) {
            product = addBigInt(product, bToThePower);
        }
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
}
/**
 * @param {?} str
 * @return {?}
 */
function utf8Encode(str) {
    var /** @type {?} */ encoded = "";
    for (var /** @type {?} */ index = 0; index < str.length; index++) {
        var /** @type {?} */ codePoint = str.charCodeAt(index);
        // decode surrogate
        // see https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        if (codePoint >= 0xd800 && codePoint <= 0xdbff && str.length > index + 1) {
            var /** @type {?} */ low = str.charCodeAt(index + 1);
            if (low >= 0xdc00 && low <= 0xdfff) {
                index++;
                codePoint = ((codePoint - 0xd800) << 10) + low - 0xdc00 + 0x10000;
            }
        }
        if (codePoint <= 0x7f) {
            encoded += String.fromCharCode(codePoint);
        }
        else if (codePoint <= 0x7ff) {
            encoded += String.fromCharCode(((codePoint >> 6) & 0x1f) | 0xc0, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0xffff) {
            encoded += String.fromCharCode((codePoint >> 12) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
        else if (codePoint <= 0x1fffff) {
            encoded += String.fromCharCode(((codePoint >> 18) & 0x07) | 0xf0, ((codePoint >> 12) & 0x3f) | 0x80, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80);
        }
    }
    return encoded;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlnZXN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9zZXJpYWxpemVycy9kaWdlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQVVBLE1BQU0saUJBQWlCLE9BQXFCO0lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFJLE9BQU8sQ0FBQyxPQUFPLE1BQUcsQ0FBQSxDQUFDLENBQUM7Q0FDNUY7Ozs7O0FBRUQsTUFBTSx3QkFBd0IsT0FBcUI7SUFDakQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztLQUNuQjtJQUVELHFCQUFNLE9BQU8sR0FBRyxJQUFJLDZCQUE2QixFQUFFLENBQUM7SUFDcEQscUJBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0NBQ3REOzs7Ozs7OztBQVNEOzs7Ozs7O0FBQUE7Ozs7Ozs7O0lBQ0UscUNBQVM7Ozs7O0lBQVQsVUFBVSxJQUFlLEVBQUUsT0FBWTtRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7Ozs7O0lBRUQsMENBQWM7Ozs7O0lBQWQsVUFBZSxTQUF5QixFQUFFLE9BQVk7UUFBdEQsaUJBRUM7UUFEQyxN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QUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUM3RjtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMvQixPQUFPLElBQUksTUFBTSxDQUFDLFlBQVksQ0FDNUIsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUN4QixDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksRUFDaEMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUMxQixDQUFDO1NBQ0g7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsT0FBTyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQzVCLENBQUMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUNqQyxDQUFDLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksRUFDakMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQ2hDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FDMUIsQ0FBQztTQUNIO0tBQ0Y7SUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0NBQ2hCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBpMThuIGZyb20gXCIuLi9hc3QvaTE4bl9hc3RcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZ2VzdChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmcge1xuICByZXR1cm4gbWVzc2FnZS5pZCB8fCBzaGExKHNlcmlhbGl6ZU5vZGVzKG1lc3NhZ2Uubm9kZXMpLmpvaW4oXCJcIikgKyBgWyR7bWVzc2FnZS5tZWFuaW5nfV1gKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlY2ltYWxEaWdlc3QobWVzc2FnZTogaTE4bi5NZXNzYWdlKTogc3RyaW5nIHtcbiAgaWYgKG1lc3NhZ2UuaWQpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5pZDtcbiAgfVxuXG4gIGNvbnN0IHZpc2l0b3IgPSBuZXcgU2VyaWFsaXplcklnbm9yZUljdUV4cFZpc2l0b3IoKTtcbiAgY29uc3QgcGFydHMgPSBtZXNzYWdlLm5vZGVzLm1hcChhID0+IGEudmlzaXQodmlzaXRvciwgbnVsbCkpO1xuICByZXR1cm4gY29tcHV0ZU1zZ0lkKHBhcnRzLmpvaW4oXCJcIiksIG1lc3NhZ2UubWVhbmluZyk7XG59XG5cbi8qKlxuICogU2VyaWFsaXplIHRoZSBpMThuIGh0bWwgdG8gc29tZXRoaW5nIHhtbC1saWtlIGluIG9yZGVyIHRvIGdlbmVyYXRlIGFuIFVJRC5cbiAqXG4gKiBUaGUgdmlzaXRvciBpcyBhbHNvIHVzZWQgaW4gdGhlIGkxOG4gcGFyc2VyIHRlc3RzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmNsYXNzIFNlcmlhbGl6ZXJWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgdmlzaXRUZXh0KHRleHQ6IGkxOG4uVGV4dCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGV4dC52YWx1ZTtcbiAgfVxuXG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogaTE4bi5Db250YWluZXIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGBbJHtjb250YWluZXIuY2hpbGRyZW4ubWFwKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMpKS5qb2luKFwiLCBcIil9XWA7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IGkxOG4uSWN1LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHN0ckNhc2VzID0gT2JqZWN0LmtleXMoaWN1LmNhc2VzKS5tYXAoKGs6IHN0cmluZykgPT4gYCR7a30geyR7aWN1LmNhc2VzW2tdLnZpc2l0KHRoaXMpfX1gKTtcbiAgICByZXR1cm4gYHske2ljdS5leHByZXNzaW9ufSwgJHtpY3UudHlwZX0sICR7c3RyQ2FzZXMuam9pbihcIiwgXCIpfX1gO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogaTE4bi5UYWdQbGFjZWhvbGRlciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gcGguaXNWb2lkXG4gICAgICA/IGA8cGggdGFnIG5hbWU9XCIke3BoLnN0YXJ0TmFtZX1cIi8+YFxuICAgICAgOiBgPHBoIHRhZyBuYW1lPVwiJHtwaC5zdGFydE5hbWV9XCI+JHtwaC5jaGlsZHJlbi5tYXAoY2hpbGQgPT4gY2hpbGQudmlzaXQodGhpcykpLmpvaW4oXCIsIFwiKX08L3BoIG5hbWU9XCIke1xuICAgICAgICAgIHBoLmNsb3NlTmFtZVxuICAgICAgICB9XCI+YDtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHBoLnZhbHVlID8gYDxwaCBuYW1lPVwiJHtwaC5uYW1lfVwiPiR7cGgudmFsdWV9PC9waD5gIDogYDxwaCBuYW1lPVwiJHtwaC5uYW1lfVwiLz5gO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogaTE4bi5JY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIGA8cGggaWN1IG5hbWU9XCIke3BoLm5hbWV9XCI+JHtwaC52YWx1ZS52aXNpdCh0aGlzKX08L3BoPmA7XG4gIH1cbn1cblxuY29uc3Qgc2VyaWFsaXplclZpc2l0b3IgPSBuZXcgU2VyaWFsaXplclZpc2l0b3IoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcmlhbGl6ZU5vZGVzKG5vZGVzOiBpMThuLk5vZGVbXSk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIG5vZGVzLm1hcChhID0+IGEudmlzaXQoc2VyaWFsaXplclZpc2l0b3IsIG51bGwpKTtcbn1cblxuLyoqXG4gKiBTZXJpYWxpemUgdGhlIGkxOG4gaHRtbCB0byBzb21ldGhpbmcgeG1sLWxpa2UgaW4gb3JkZXIgdG8gZ2VuZXJhdGUgYW4gVUlELlxuICpcbiAqIElnbm9yZSB0aGUgSUNVIGV4cHJlc3Npb25zIHNvIHRoYXQgbWVzc2FnZSBJRHMgc3RheXMgaWRlbnRpY2FsIGlmIG9ubHkgdGhlIGV4cHJlc3Npb24gY2hhbmdlcy5cbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuY2xhc3MgU2VyaWFsaXplcklnbm9yZUljdUV4cFZpc2l0b3IgZXh0ZW5kcyBTZXJpYWxpemVyVmlzaXRvciB7XG4gIHZpc2l0SWN1KGljdTogaTE4bi5JY3UsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgc3RyQ2FzZXMgPSBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLm1hcCgoazogc3RyaW5nKSA9PiBgJHtrfSB7JHtpY3UuY2FzZXNba10udmlzaXQodGhpcyl9fWApO1xuICAgIC8vIERvIG5vdCB0YWtlIHRoZSBleHByZXNzaW9uIGludG8gYWNjb3VudFxuICAgIHJldHVybiBgeyR7aWN1LnR5cGV9LCAke3N0ckNhc2VzLmpvaW4oXCIsIFwiKX19YDtcbiAgfVxufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIFNIQTEgb2YgdGhlIGdpdmVuIHN0cmluZ1xuICpcbiAqIHNlZSBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTQvZmlwcy0xODAtNC5wZGZcbiAqXG4gKiBXQVJOSU5HOiB0aGlzIGZ1bmN0aW9uIGhhcyBub3QgYmVlbiBkZXNpZ25lZCBub3QgdGVzdGVkIHdpdGggc2VjdXJpdHkgaW4gbWluZC5cbiAqICAgICAgICAgIERPIE5PVCBVU0UgSVQgSU4gQSBTRUNVUklUWSBTRU5TSVRJVkUgQ09OVEVYVC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoYTEoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB1dGY4ID0gdXRmOEVuY29kZShzdHIpO1xuICBjb25zdCB3b3JkczMyID0gc3RyaW5nVG9Xb3JkczMyKHV0ZjgsIEVuZGlhbi5CaWcpO1xuICBjb25zdCBsZW4gPSB1dGY4Lmxlbmd0aCAqIDg7XG5cbiAgY29uc3QgdyA9IG5ldyBBcnJheSg4MCk7XG4gIGxldCBbYSwgYiwgYywgZCwgZV06IG51bWJlcltdID0gWzB4Njc0NTIzMDEsIDB4ZWZjZGFiODksIDB4OThiYWRjZmUsIDB4MTAzMjU0NzYsIDB4YzNkMmUxZjBdO1xuXG4gIHdvcmRzMzJbbGVuID4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbGVuICUgMzIpO1xuICB3b3JkczMyWygoKGxlbiArIDY0KSA+PiA5KSA8PCA0KSArIDE1XSA9IGxlbjtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzMzIubGVuZ3RoOyBpICs9IDE2KSB7XG4gICAgY29uc3QgW2gwLCBoMSwgaDIsIGgzLCBoNF06IG51bWJlcltdID0gW2EsIGIsIGMsIGQsIGVdO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCA4MDsgaisrKSB7XG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgICAgIGlmIChqIDwgMTYpIHtcbiAgICAgICAgd1tqXSA9IHdvcmRzMzJbaSArIGpdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd1tqXSA9IHJvbDMyKHdbaiAtIDNdIF4gd1tqIC0gOF0gXiB3W2ogLSAxNF0gXiB3W2ogLSAxNl0sIDEpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBbZiwga10gPSBmayhqLCBiLCBjLCBkKTtcbiAgICAgIGNvbnN0IHRlbXAgPSBbcm9sMzIoYSwgNSksIGYsIGUsIGssIHdbal1dLnJlZHVjZShhZGQzMik7XG4gICAgICBbZSwgZCwgYywgYiwgYV0gPSBbZCwgYywgcm9sMzIoYiwgMzApLCBhLCB0ZW1wXTtcbiAgICB9XG5cbiAgICBbYSwgYiwgYywgZCwgZV0gPSBbYWRkMzIoYSwgaDApLCBhZGQzMihiLCBoMSksIGFkZDMyKGMsIGgyKSwgYWRkMzIoZCwgaDMpLCBhZGQzMihlLCBoNCldO1xuICB9XG5cbiAgcmV0dXJuIGJ5dGVTdHJpbmdUb0hleFN0cmluZyh3b3JkczMyVG9CeXRlU3RyaW5nKFthLCBiLCBjLCBkLCBlXSkpO1xufVxuXG5mdW5jdGlvbiBmayhpbmRleDogbnVtYmVyLCBiOiBudW1iZXIsIGM6IG51bWJlciwgZDogbnVtYmVyKTogW251bWJlciwgbnVtYmVyXSB7XG4gIGlmIChpbmRleCA8IDIwKSB7XG4gICAgcmV0dXJuIFsoYiAmIGMpIHwgKH5iICYgZCksIDB4NWE4Mjc5OTldO1xuICB9XG5cbiAgaWYgKGluZGV4IDwgNDApIHtcbiAgICByZXR1cm4gW2IgXiBjIF4gZCwgMHg2ZWQ5ZWJhMV07XG4gIH1cblxuICBpZiAoaW5kZXggPCA2MCkge1xuICAgIHJldHVybiBbKGIgJiBjKSB8IChiICYgZCkgfCAoYyAmIGQpLCAweDhmMWJiY2RjXTtcbiAgfVxuXG4gIHJldHVybiBbYiBeIGMgXiBkLCAweGNhNjJjMWQ2XTtcbn1cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBmaW5nZXJwcmludCBvZiB0aGUgZ2l2ZW4gc3RyaW5nXG4gKlxuICogVGhlIG91dHB1dCBpcyA2NCBiaXQgbnVtYmVyIGVuY29kZWQgYXMgYSBkZWNpbWFsIHN0cmluZ1xuICpcbiAqIGJhc2VkIG9uOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWNvbXBpbGVyL2Jsb2IvbWFzdGVyL3NyYy9jb20vZ29vZ2xlL2phdmFzY3JpcHQvanNjb21wL0dvb2dsZUpzTWVzc2FnZUlkR2VuZXJhdG9yLmphdmFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmdlcnByaW50KHN0cjogc3RyaW5nKTogW251bWJlciwgbnVtYmVyXSB7XG4gIGNvbnN0IHV0ZjggPSB1dGY4RW5jb2RlKHN0cik7XG5cbiAgbGV0IFtoaSwgbG9dID0gW2hhc2gzMih1dGY4LCAwKSwgaGFzaDMyKHV0ZjgsIDEwMjA3MildO1xuXG4gIGlmIChoaSA9PT0gMCAmJiAobG8gPT09IDAgfHwgbG8gPT09IDEpKSB7XG4gICAgaGkgPSBoaSBeIDB4MTMwZjliZWY7XG4gICAgbG8gPSBsbyBeIC0weDZiNWY1NmQ4O1xuICB9XG5cbiAgcmV0dXJuIFtoaSwgbG9dO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZU1zZ0lkKG1zZzogc3RyaW5nLCBtZWFuaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgW2hpLCBsb10gPSBmaW5nZXJwcmludChtc2cpO1xuXG4gIGlmIChtZWFuaW5nKSB7XG4gICAgY29uc3QgW2hpbSwgbG9tXSA9IGZpbmdlcnByaW50KG1lYW5pbmcpO1xuICAgIFtoaSwgbG9dID0gYWRkNjQocm9sNjQoW2hpLCBsb10sIDEpLCBbaGltLCBsb21dKTtcbiAgfVxuXG4gIHJldHVybiBieXRlU3RyaW5nVG9EZWNTdHJpbmcod29yZHMzMlRvQnl0ZVN0cmluZyhbaGkgJiAweDdmZmZmZmZmLCBsb10pKTtcbn1cblxuZnVuY3Rpb24gaGFzaDMyKHN0cjogc3RyaW5nLCBjOiBudW1iZXIpOiBudW1iZXIge1xuICBsZXQgW2EsIGJdID0gWzB4OWUzNzc5YjksIDB4OWUzNzc5YjldO1xuICBsZXQgaTogbnVtYmVyO1xuXG4gIGNvbnN0IGxlbiA9IHN0ci5sZW5ndGg7XG5cbiAgZm9yIChpID0gMDsgaSArIDEyIDw9IGxlbjsgaSArPSAxMikge1xuICAgIGEgPSBhZGQzMihhLCB3b3JkQXQoc3RyLCBpLCBFbmRpYW4uTGl0dGxlKSk7XG4gICAgYiA9IGFkZDMyKGIsIHdvcmRBdChzdHIsIGkgKyA0LCBFbmRpYW4uTGl0dGxlKSk7XG4gICAgYyA9IGFkZDMyKGMsIHdvcmRBdChzdHIsIGkgKyA4LCBFbmRpYW4uTGl0dGxlKSk7XG4gICAgW2EsIGIsIGNdID0gbWl4KFthLCBiLCBjXSk7XG4gIH1cblxuICBhID0gYWRkMzIoYSwgd29yZEF0KHN0ciwgaSwgRW5kaWFuLkxpdHRsZSkpO1xuICBiID0gYWRkMzIoYiwgd29yZEF0KHN0ciwgaSArIDQsIEVuZGlhbi5MaXR0bGUpKTtcbiAgLy8gdGhlIGZpcnN0IGJ5dGUgb2YgYyBpcyByZXNlcnZlZCBmb3IgdGhlIGxlbmd0aFxuICBjID0gYWRkMzIoYywgbGVuKTtcbiAgYyA9IGFkZDMyKGMsIHdvcmRBdChzdHIsIGkgKyA4LCBFbmRpYW4uTGl0dGxlKSA8PCA4KTtcblxuICByZXR1cm4gbWl4KFthLCBiLCBjXSlbMl07XG59XG5cbi8vIGNsYW5nLWZvcm1hdCBvZmZcbmZ1bmN0aW9uIG1peChbYSwgYiwgY106IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSk6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXSB7XG4gIGEgPSBzdWIzMihhLCBiKTtcbiAgYSA9IHN1YjMyKGEsIGMpO1xuICBhIF49IGMgPj4+IDEzO1xuICBiID0gc3ViMzIoYiwgYyk7XG4gIGIgPSBzdWIzMihiLCBhKTtcbiAgYiBePSBhIDw8IDg7XG4gIGMgPSBzdWIzMihjLCBhKTtcbiAgYyA9IHN1YjMyKGMsIGIpO1xuICBjIF49IGIgPj4+IDEzO1xuICBhID0gc3ViMzIoYSwgYik7XG4gIGEgPSBzdWIzMihhLCBjKTtcbiAgYSBePSBjID4+PiAxMjtcbiAgYiA9IHN1YjMyKGIsIGMpO1xuICBiID0gc3ViMzIoYiwgYSk7XG4gIGIgXj0gYSA8PCAxNjtcbiAgYyA9IHN1YjMyKGMsIGEpO1xuICBjID0gc3ViMzIoYywgYik7XG4gIGMgXj0gYiA+Pj4gNTtcbiAgYSA9IHN1YjMyKGEsIGIpO1xuICBhID0gc3ViMzIoYSwgYyk7XG4gIGEgXj0gYyA+Pj4gMztcbiAgYiA9IHN1YjMyKGIsIGMpO1xuICBiID0gc3ViMzIoYiwgYSk7XG4gIGIgXj0gYSA8PCAxMDtcbiAgYyA9IHN1YjMyKGMsIGEpO1xuICBjID0gc3ViMzIoYywgYik7XG4gIGMgXj0gYiA+Pj4gMTU7XG4gIHJldHVybiBbYSwgYiwgY107XG59XG4vLyBjbGFuZy1mb3JtYXQgb25cblxuLy8gVXRpbHNcblxuZW51bSBFbmRpYW4ge1xuICBMaXR0bGUsXG4gIEJpZ1xufVxuXG5mdW5jdGlvbiBhZGQzMihhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBhZGQzMnRvNjQoYSwgYilbMV07XG59XG5cbmZ1bmN0aW9uIGFkZDMydG82NChhOiBudW1iZXIsIGI6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBsb3cgPSAoYSAmIDB4ZmZmZikgKyAoYiAmIDB4ZmZmZik7XG4gIGNvbnN0IGhpZ2ggPSAoYSA+Pj4gMTYpICsgKGIgPj4+IDE2KSArIChsb3cgPj4+IDE2KTtcbiAgcmV0dXJuIFtoaWdoID4+PiAxNiwgKGhpZ2ggPDwgMTYpIHwgKGxvdyAmIDB4ZmZmZildO1xufVxuXG5mdW5jdGlvbiBhZGQ2NChbYWgsIGFsXTogW251bWJlciwgbnVtYmVyXSwgW2JoLCBibF06IFtudW1iZXIsIG51bWJlcl0pOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgY29uc3QgW2NhcnJ5LCBsXSA9IGFkZDMydG82NChhbCwgYmwpO1xuICBjb25zdCBoID0gYWRkMzIoYWRkMzIoYWgsIGJoKSwgY2FycnkpO1xuICByZXR1cm4gW2gsIGxdO1xufVxuXG5mdW5jdGlvbiBzdWIzMihhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gIGNvbnN0IGxvdyA9IChhICYgMHhmZmZmKSAtIChiICYgMHhmZmZmKTtcbiAgY29uc3QgaGlnaCA9IChhID4+IDE2KSAtIChiID4+IDE2KSArIChsb3cgPj4gMTYpO1xuICByZXR1cm4gKGhpZ2ggPDwgMTYpIHwgKGxvdyAmIDB4ZmZmZik7XG59XG5cbi8vIFJvdGF0ZSBhIDMyYiBudW1iZXIgbGVmdCBgY291bnRgIHBvc2l0aW9uXG5mdW5jdGlvbiByb2wzMihhOiBudW1iZXIsIGNvdW50OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gKGEgPDwgY291bnQpIHwgKGEgPj4+ICgzMiAtIGNvdW50KSk7XG59XG5cbi8vIFJvdGF0ZSBhIDY0YiBudW1iZXIgbGVmdCBgY291bnRgIHBvc2l0aW9uXG5mdW5jdGlvbiByb2w2NChbaGksIGxvXTogW251bWJlciwgbnVtYmVyXSwgY291bnQ6IG51bWJlcik6IFtudW1iZXIsIG51bWJlcl0ge1xuICBjb25zdCBoID0gKGhpIDw8IGNvdW50KSB8IChsbyA+Pj4gKDMyIC0gY291bnQpKTtcbiAgY29uc3QgbCA9IChsbyA8PCBjb3VudCkgfCAoaGkgPj4+ICgzMiAtIGNvdW50KSk7XG4gIHJldHVybiBbaCwgbF07XG59XG5cbmZ1bmN0aW9uIHN0cmluZ1RvV29yZHMzMihzdHI6IHN0cmluZywgZW5kaWFuOiBFbmRpYW4pOiBudW1iZXJbXSB7XG4gIGNvbnN0IHdvcmRzMzIgPSBBcnJheSgoc3RyLmxlbmd0aCArIDMpID4+PiAyKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHdvcmRzMzIubGVuZ3RoOyBpKyspIHtcbiAgICB3b3JkczMyW2ldID0gd29yZEF0KHN0ciwgaSAqIDQsIGVuZGlhbik7XG4gIH1cblxuICByZXR1cm4gd29yZHMzMjtcbn1cblxuZnVuY3Rpb24gYnl0ZUF0KHN0cjogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGluZGV4ID49IHN0ci5sZW5ndGggPyAwIDogc3RyLmNoYXJDb2RlQXQoaW5kZXgpICYgMHhmZjtcbn1cblxuZnVuY3Rpb24gd29yZEF0KHN0cjogc3RyaW5nLCBpbmRleDogbnVtYmVyLCBlbmRpYW46IEVuZGlhbik6IG51bWJlciB7XG4gIGxldCB3b3JkID0gMDtcbiAgaWYgKGVuZGlhbiA9PT0gRW5kaWFuLkJpZykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICB3b3JkICs9IGJ5dGVBdChzdHIsIGluZGV4ICsgaSkgPDwgKDI0IC0gOCAqIGkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgd29yZCArPSBieXRlQXQoc3RyLCBpbmRleCArIGkpIDw8ICg4ICogaSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB3b3JkO1xufVxuXG5mdW5jdGlvbiB3b3JkczMyVG9CeXRlU3RyaW5nKHdvcmRzMzI6IG51bWJlcltdKTogc3RyaW5nIHtcbiAgcmV0dXJuIHdvcmRzMzIucmVkdWNlKChzdHIsIHdvcmQpID0+IHN0ciArIHdvcmQzMlRvQnl0ZVN0cmluZyh3b3JkKSwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIHdvcmQzMlRvQnl0ZVN0cmluZyh3b3JkOiBudW1iZXIpOiBzdHJpbmcge1xuICBsZXQgc3RyID0gXCJcIjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgod29yZCA+Pj4gKDggKiAoMyAtIGkpKSkgJiAweGZmKTtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5mdW5jdGlvbiBieXRlU3RyaW5nVG9IZXhTdHJpbmcoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaGV4ID0gXCJcIjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBiID0gYnl0ZUF0KHN0ciwgaSk7XG4gICAgaGV4ICs9IChiID4+PiA0KS50b1N0cmluZygxNikgKyAoYiAmIDB4MGYpLnRvU3RyaW5nKDE2KTtcbiAgfVxuICByZXR1cm4gaGV4LnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIGJhc2VkIG9uIGh0dHA6Ly93d3cuZGFudmsub3JnL2hleDJkZWMuaHRtbCAoSlMgY2FuIG5vdCBoYW5kbGUgbW9yZSB0aGFuIDU2YilcbmZ1bmN0aW9uIGJ5dGVTdHJpbmdUb0RlY1N0cmluZyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBkZWNpbWFsID0gXCJcIjtcbiAgbGV0IHRvVGhlUG93ZXIgPSBcIjFcIjtcblxuICBmb3IgKGxldCBpID0gc3RyLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgZGVjaW1hbCA9IGFkZEJpZ0ludChkZWNpbWFsLCBudW1iZXJUaW1lc0JpZ0ludChieXRlQXQoc3RyLCBpKSwgdG9UaGVQb3dlcikpO1xuICAgIHRvVGhlUG93ZXIgPSBudW1iZXJUaW1lc0JpZ0ludCgyNTYsIHRvVGhlUG93ZXIpO1xuICB9XG5cbiAgcmV0dXJuIGRlY2ltYWxcbiAgICAuc3BsaXQoXCJcIilcbiAgICAucmV2ZXJzZSgpXG4gICAgLmpvaW4oXCJcIik7XG59XG5cbi8vIHggYW5kIHkgZGVjaW1hbCwgbG93ZXN0IHNpZ25pZmljYW50IGRpZ2l0IGZpcnN0XG5mdW5jdGlvbiBhZGRCaWdJbnQoeDogc3RyaW5nLCB5OiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgc3VtID0gXCJcIjtcbiAgY29uc3QgbGVuID0gTWF0aC5tYXgoeC5sZW5ndGgsIHkubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDAsIGNhcnJ5ID0gMDsgaSA8IGxlbiB8fCBjYXJyeTsgaSsrKSB7XG4gICAgY29uc3QgdG1wU3VtID0gY2FycnkgKyArKHhbaV0gfHwgMCkgKyArKHlbaV0gfHwgMCk7XG4gICAgaWYgKHRtcFN1bSA+PSAxMCkge1xuICAgICAgY2FycnkgPSAxO1xuICAgICAgc3VtICs9IHRtcFN1bSAtIDEwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXJyeSA9IDA7XG4gICAgICBzdW0gKz0gdG1wU3VtO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdW07XG59XG5cbmZ1bmN0aW9uIG51bWJlclRpbWVzQmlnSW50KG51bTogbnVtYmVyLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgcHJvZHVjdCA9IFwiXCI7XG4gIGxldCBiVG9UaGVQb3dlciA9IGI7XG4gIGZvciAoOyBudW0gIT09IDA7IG51bSA9IG51bSA+Pj4gMSkge1xuICAgIGlmIChudW0gJiAxKSB7XG4gICAgICBwcm9kdWN0ID0gYWRkQmlnSW50KHByb2R1Y3QsIGJUb1RoZVBvd2VyKTtcbiAgICB9XG4gICAgYlRvVGhlUG93ZXIgPSBhZGRCaWdJbnQoYlRvVGhlUG93ZXIsIGJUb1RoZVBvd2VyKTtcbiAgfVxuICByZXR1cm4gcHJvZHVjdDtcbn1cblxuZnVuY3Rpb24gdXRmOEVuY29kZShzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGxldCBlbmNvZGVkID0gXCJcIjtcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0ci5sZW5ndGg7IGluZGV4KyspIHtcbiAgICBsZXQgY29kZVBvaW50ID0gc3RyLmNoYXJDb2RlQXQoaW5kZXgpO1xuXG4gICAgLy8gZGVjb2RlIHN1cnJvZ2F0ZVxuICAgIC8vIHNlZSBodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcbiAgICBpZiAoY29kZVBvaW50ID49IDB4ZDgwMCAmJiBjb2RlUG9pbnQgPD0gMHhkYmZmICYmIHN0ci5sZW5ndGggPiBpbmRleCArIDEpIHtcbiAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGluZGV4ICsgMSk7XG4gICAgICBpZiAobG93ID49IDB4ZGMwMCAmJiBsb3cgPD0gMHhkZmZmKSB7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICAgIGNvZGVQb2ludCA9ICgoY29kZVBvaW50IC0gMHhkODAwKSA8PCAxMCkgKyBsb3cgLSAweGRjMDAgKyAweDEwMDAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPD0gMHg3Zikge1xuICAgICAgZW5jb2RlZCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGVQb2ludCk7XG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPD0gMHg3ZmYpIHtcbiAgICAgIGVuY29kZWQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGNvZGVQb2ludCA+PiA2KSAmIDB4MWYpIHwgMHhjMCwgKGNvZGVQb2ludCAmIDB4M2YpIHwgMHg4MCk7XG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPD0gMHhmZmZmKSB7XG4gICAgICBlbmNvZGVkICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgICAgIChjb2RlUG9pbnQgPj4gMTIpIHwgMHhlMCxcbiAgICAgICAgKChjb2RlUG9pbnQgPj4gNikgJiAweDNmKSB8IDB4ODAsXG4gICAgICAgIChjb2RlUG9pbnQgJiAweDNmKSB8IDB4ODBcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPD0gMHgxZmZmZmYpIHtcbiAgICAgIGVuY29kZWQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShcbiAgICAgICAgKChjb2RlUG9pbnQgPj4gMTgpICYgMHgwNykgfCAweGYwLFxuICAgICAgICAoKGNvZGVQb2ludCA+PiAxMikgJiAweDNmKSB8IDB4ODAsXG4gICAgICAgICgoY29kZVBvaW50ID4+IDYpICYgMHgzZikgfCAweDgwLFxuICAgICAgICAoY29kZVBvaW50ICYgMHgzZikgfCAweDgwXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbmNvZGVkO1xufVxuIl19