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
export class ParserError {
    /**
     * @param {?} message
     * @param {?} input
     * @param {?} errLocation
     * @param {?=} ctxLocation
     */
    constructor(message, input, errLocation, ctxLocation) {
        this.input = input;
        this.errLocation = errLocation;
        this.ctxLocation = ctxLocation;
        this.message = `Parser Error: ${message} ${errLocation} [${input}] in ${ctxLocation}`;
    }
}
function ParserError_tsickle_Closure_declarations() {
    /** @type {?} */
    ParserError.prototype.message;
    /** @type {?} */
    ParserError.prototype.input;
    /** @type {?} */
    ParserError.prototype.errLocation;
    /** @type {?} */
    ParserError.prototype.ctxLocation;
}
export class ParseSpan {
    /**
     * @param {?} start
     * @param {?} end
     */
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
function ParseSpan_tsickle_Closure_declarations() {
    /** @type {?} */
    ParseSpan.prototype.start;
    /** @type {?} */
    ParseSpan.prototype.end;
}
export class AST {
    /**
     * @param {?} span
     */
    constructor(span) {
        this.span = span;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return null;
    }
    /**
     * @return {?}
     */
    toString() {
        return "AST";
    }
}
function AST_tsickle_Closure_declarations() {
    /** @type {?} */
    AST.prototype.span;
}
/**
 * Represents a quoted expression of the form:
 *
 * quote = prefix `:` uninterpretedExpression
 * prefix = identifier
 * uninterpretedExpression = arbitrary string
 *
 * A quoted expression is meant to be pre-processed by an AST transformer that
 * converts it into another AST that no longer contains quoted expressions.
 * It is meant to allow third-party developers to extend Angular template
 * expression language. The `uninterpretedExpression` part of the quote is
 * therefore not interpreted by the Angular's own expression parser.
 */
export class Quote extends AST {
    /**
     * @param {?} span
     * @param {?} prefix
     * @param {?} uninterpretedExpression
     * @param {?} location
     */
    constructor(span, prefix, uninterpretedExpression, location) {
        super(span);
        this.prefix = prefix;
        this.uninterpretedExpression = uninterpretedExpression;
        this.location = location;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitQuote(this, context);
    }
    /**
     * @return {?}
     */
    toString() {
        return "Quote";
    }
}
function Quote_tsickle_Closure_declarations() {
    /** @type {?} */
    Quote.prototype.prefix;
    /** @type {?} */
    Quote.prototype.uninterpretedExpression;
    /** @type {?} */
    Quote.prototype.location;
}
export class EmptyExpr extends AST {
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        // do nothing
    }
}
export class ImplicitReceiver extends AST {
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitImplicitReceiver(this, context);
    }
}
/**
 * Multiple expressions separated by a semicolon.
 */
export class Chain extends AST {
    /**
     * @param {?} span
     * @param {?} expressions
     */
    constructor(span, expressions) {
        super(span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitChain(this, context);
    }
}
function Chain_tsickle_Closure_declarations() {
    /** @type {?} */
    Chain.prototype.expressions;
}
export class Conditional extends AST {
    /**
     * @param {?} span
     * @param {?} condition
     * @param {?} trueExp
     * @param {?} falseExp
     */
    constructor(span, condition, trueExp, falseExp) {
        super(span);
        this.condition = condition;
        this.trueExp = trueExp;
        this.falseExp = falseExp;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitConditional(this, context);
    }
}
function Conditional_tsickle_Closure_declarations() {
    /** @type {?} */
    Conditional.prototype.condition;
    /** @type {?} */
    Conditional.prototype.trueExp;
    /** @type {?} */
    Conditional.prototype.falseExp;
}
export class PropertyRead extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    constructor(span, receiver, name) {
        super(span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPropertyRead(this, context);
    }
}
function PropertyRead_tsickle_Closure_declarations() {
    /** @type {?} */
    PropertyRead.prototype.receiver;
    /** @type {?} */
    PropertyRead.prototype.name;
}
export class PropertyWrite extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} value
     */
    constructor(span, receiver, name, value) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPropertyWrite(this, context);
    }
}
function PropertyWrite_tsickle_Closure_declarations() {
    /** @type {?} */
    PropertyWrite.prototype.receiver;
    /** @type {?} */
    PropertyWrite.prototype.name;
    /** @type {?} */
    PropertyWrite.prototype.value;
}
export class SafePropertyRead extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     */
    constructor(span, receiver, name) {
        super(span);
        this.receiver = receiver;
        this.name = name;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitSafePropertyRead(this, context);
    }
}
function SafePropertyRead_tsickle_Closure_declarations() {
    /** @type {?} */
    SafePropertyRead.prototype.receiver;
    /** @type {?} */
    SafePropertyRead.prototype.name;
}
export class KeyedRead extends AST {
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     */
    constructor(span, obj, key) {
        super(span);
        this.obj = obj;
        this.key = key;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitKeyedRead(this, context);
    }
}
function KeyedRead_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyedRead.prototype.obj;
    /** @type {?} */
    KeyedRead.prototype.key;
}
export class KeyedWrite extends AST {
    /**
     * @param {?} span
     * @param {?} obj
     * @param {?} key
     * @param {?} value
     */
    constructor(span, obj, key, value) {
        super(span);
        this.obj = obj;
        this.key = key;
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitKeyedWrite(this, context);
    }
}
function KeyedWrite_tsickle_Closure_declarations() {
    /** @type {?} */
    KeyedWrite.prototype.obj;
    /** @type {?} */
    KeyedWrite.prototype.key;
    /** @type {?} */
    KeyedWrite.prototype.value;
}
export class BindingPipe extends AST {
    /**
     * @param {?} span
     * @param {?} exp
     * @param {?} name
     * @param {?} args
     */
    constructor(span, exp, name, args) {
        super(span);
        this.exp = exp;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPipe(this, context);
    }
}
function BindingPipe_tsickle_Closure_declarations() {
    /** @type {?} */
    BindingPipe.prototype.exp;
    /** @type {?} */
    BindingPipe.prototype.name;
    /** @type {?} */
    BindingPipe.prototype.args;
}
export class LiteralPrimitive extends AST {
    /**
     * @param {?} span
     * @param {?} value
     */
    constructor(span, value) {
        super(span);
        this.value = value;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralPrimitive(this, context);
    }
}
function LiteralPrimitive_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralPrimitive.prototype.value;
}
export class LiteralArray extends AST {
    /**
     * @param {?} span
     * @param {?} expressions
     */
    constructor(span, expressions) {
        super(span);
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralArray(this, context);
    }
}
function LiteralArray_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralArray.prototype.expressions;
}
/**
 * @record
 */
export function LiteralMapKey() { }
function LiteralMapKey_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralMapKey.prototype.key;
    /** @type {?} */
    LiteralMapKey.prototype.quoted;
}
export class LiteralMap extends AST {
    /**
     * @param {?} span
     * @param {?} keys
     * @param {?} values
     */
    constructor(span, keys, values) {
        super(span);
        this.keys = keys;
        this.values = values;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitLiteralMap(this, context);
    }
}
function LiteralMap_tsickle_Closure_declarations() {
    /** @type {?} */
    LiteralMap.prototype.keys;
    /** @type {?} */
    LiteralMap.prototype.values;
}
export class Interpolation extends AST {
    /**
     * @param {?} span
     * @param {?} strings
     * @param {?} expressions
     */
    constructor(span, strings, expressions) {
        super(span);
        this.strings = strings;
        this.expressions = expressions;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitInterpolation(this, context);
    }
}
function Interpolation_tsickle_Closure_declarations() {
    /** @type {?} */
    Interpolation.prototype.strings;
    /** @type {?} */
    Interpolation.prototype.expressions;
}
export class Binary extends AST {
    /**
     * @param {?} span
     * @param {?} operation
     * @param {?} left
     * @param {?} right
     */
    constructor(span, operation, left, right) {
        super(span);
        this.operation = operation;
        this.left = left;
        this.right = right;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitBinary(this, context);
    }
}
function Binary_tsickle_Closure_declarations() {
    /** @type {?} */
    Binary.prototype.operation;
    /** @type {?} */
    Binary.prototype.left;
    /** @type {?} */
    Binary.prototype.right;
}
export class PrefixNot extends AST {
    /**
     * @param {?} span
     * @param {?} expression
     */
    constructor(span, expression) {
        super(span);
        this.expression = expression;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitPrefixNot(this, context);
    }
}
function PrefixNot_tsickle_Closure_declarations() {
    /** @type {?} */
    PrefixNot.prototype.expression;
}
export class NonNullAssert extends AST {
    /**
     * @param {?} span
     * @param {?} expression
     */
    constructor(span, expression) {
        super(span);
        this.expression = expression;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitNonNullAssert(this, context);
    }
}
function NonNullAssert_tsickle_Closure_declarations() {
    /** @type {?} */
    NonNullAssert.prototype.expression;
}
export class MethodCall extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    constructor(span, receiver, name, args) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitMethodCall(this, context);
    }
}
function MethodCall_tsickle_Closure_declarations() {
    /** @type {?} */
    MethodCall.prototype.receiver;
    /** @type {?} */
    MethodCall.prototype.name;
    /** @type {?} */
    MethodCall.prototype.args;
}
export class SafeMethodCall extends AST {
    /**
     * @param {?} span
     * @param {?} receiver
     * @param {?} name
     * @param {?} args
     */
    constructor(span, receiver, name, args) {
        super(span);
        this.receiver = receiver;
        this.name = name;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitSafeMethodCall(this, context);
    }
}
function SafeMethodCall_tsickle_Closure_declarations() {
    /** @type {?} */
    SafeMethodCall.prototype.receiver;
    /** @type {?} */
    SafeMethodCall.prototype.name;
    /** @type {?} */
    SafeMethodCall.prototype.args;
}
export class FunctionCall extends AST {
    /**
     * @param {?} span
     * @param {?} target
     * @param {?} args
     */
    constructor(span, target, args) {
        super(span);
        this.target = target;
        this.args = args;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return visitor.visitFunctionCall(this, context);
    }
}
function FunctionCall_tsickle_Closure_declarations() {
    /** @type {?} */
    FunctionCall.prototype.target;
    /** @type {?} */
    FunctionCall.prototype.args;
}
export class ASTWithSource extends AST {
    /**
     * @param {?} ast
     * @param {?} source
     * @param {?} location
     * @param {?} errors
     */
    constructor(ast, source, location, errors) {
        super(new ParseSpan(0, source == null ? 0 : source.length));
        this.ast = ast;
        this.source = source;
        this.location = location;
        this.errors = errors;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context = null) {
        return this.ast.visit(visitor, context);
    }
    /**
     * @return {?}
     */
    toString() {
        return `${this.source} in ${this.location}`;
    }
}
function ASTWithSource_tsickle_Closure_declarations() {
    /** @type {?} */
    ASTWithSource.prototype.ast;
    /** @type {?} */
    ASTWithSource.prototype.source;
    /** @type {?} */
    ASTWithSource.prototype.location;
    /** @type {?} */
    ASTWithSource.prototype.errors;
}
export class TemplateBinding {
    /**
     * @param {?} span
     * @param {?} key
     * @param {?} keyIsVar
     * @param {?} name
     * @param {?} expression
     */
    constructor(span, key, keyIsVar, name, expression) {
        this.span = span;
        this.key = key;
        this.keyIsVar = keyIsVar;
        this.name = name;
        this.expression = expression;
    }
}
function TemplateBinding_tsickle_Closure_declarations() {
    /** @type {?} */
    TemplateBinding.prototype.span;
    /** @type {?} */
    TemplateBinding.prototype.key;
    /** @type {?} */
    TemplateBinding.prototype.keyIsVar;
    /** @type {?} */
    TemplateBinding.prototype.name;
    /** @type {?} */
    TemplateBinding.prototype.expression;
}
/**
 * @record
 */
export function AstVisitor() { }
function AstVisitor_tsickle_Closure_declarations() {
    /** @type {?} */
    AstVisitor.prototype.visitBinary;
    /** @type {?} */
    AstVisitor.prototype.visitChain;
    /** @type {?} */
    AstVisitor.prototype.visitConditional;
    /** @type {?} */
    AstVisitor.prototype.visitFunctionCall;
    /** @type {?} */
    AstVisitor.prototype.visitImplicitReceiver;
    /** @type {?} */
    AstVisitor.prototype.visitInterpolation;
    /** @type {?} */
    AstVisitor.prototype.visitKeyedRead;
    /** @type {?} */
    AstVisitor.prototype.visitKeyedWrite;
    /** @type {?} */
    AstVisitor.prototype.visitLiteralArray;
    /** @type {?} */
    AstVisitor.prototype.visitLiteralMap;
    /** @type {?} */
    AstVisitor.prototype.visitLiteralPrimitive;
    /** @type {?} */
    AstVisitor.prototype.visitMethodCall;
    /** @type {?} */
    AstVisitor.prototype.visitPipe;
    /** @type {?} */
    AstVisitor.prototype.visitPrefixNot;
    /** @type {?} */
    AstVisitor.prototype.visitNonNullAssert;
    /** @type {?} */
    AstVisitor.prototype.visitPropertyRead;
    /** @type {?} */
    AstVisitor.prototype.visitPropertyWrite;
    /** @type {?} */
    AstVisitor.prototype.visitQuote;
    /** @type {?} */
    AstVisitor.prototype.visitSafeMethodCall;
    /** @type {?} */
    AstVisitor.prototype.visitSafePropertyRead;
    /** @type {?|undefined} */
    AstVisitor.prototype.visit;
}
export class RecursiveAstVisitor {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) {
        ast.left.visit(this);
        ast.right.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) {
        ast.condition.visit(this);
        ast.trueExp.visit(this);
        ast.falseExp.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        ast.exp.visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) {
        /** @type {?} */ ((ast.target)).visit(this);
        this.visitAll(ast.args, context);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) {
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) {
        ast.obj.visit(this);
        ast.key.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        return this.visitAll(ast.expressions, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        return this.visitAll(ast.values, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) {
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) {
        ast.expression.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNonNullAssert(ast, context) {
        ast.expression.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) {
        ast.receiver.visit(this);
        ast.value.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) {
        ast.receiver.visit(this);
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) {
        ast.receiver.visit(this);
        return this.visitAll(ast.args, context);
    }
    /**
     * @param {?} asts
     * @param {?} context
     * @return {?}
     */
    visitAll(asts, context) {
        asts.forEach(ast => ast.visit(this, context));
        return null;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) {
        return null;
    }
}
export class AstTransformer {
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitImplicitReceiver(ast, context) {
        return ast;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitInterpolation(ast, context) {
        return new Interpolation(ast.span, ast.strings, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralPrimitive(ast, context) {
        return new LiteralPrimitive(ast.span, ast.value);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyRead(ast, context) {
        return new PropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPropertyWrite(ast, context) {
        return new PropertyWrite(ast.span, ast.receiver.visit(this), ast.name, ast.value.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafePropertyRead(ast, context) {
        return new SafePropertyRead(ast.span, ast.receiver.visit(this), ast.name);
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitMethodCall(ast, context) {
        return new MethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitSafeMethodCall(ast, context) {
        return new SafeMethodCall(ast.span, ast.receiver.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitFunctionCall(ast, context) {
        return new FunctionCall(ast.span, /** @type {?} */ ((ast.target)).visit(this), this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(ast, context) {
        return new LiteralArray(ast.span, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(ast, context) {
        return new LiteralMap(ast.span, ast.keys, this.visitAll(ast.values));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitBinary(ast, context) {
        return new Binary(ast.span, ast.operation, ast.left.visit(this), ast.right.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPrefixNot(ast, context) {
        return new PrefixNot(ast.span, ast.expression.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitNonNullAssert(ast, context) {
        return new NonNullAssert(ast.span, ast.expression.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitConditional(ast, context) {
        return new Conditional(ast.span, ast.condition.visit(this), ast.trueExp.visit(this), ast.falseExp.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitPipe(ast, context) {
        return new BindingPipe(ast.span, ast.exp.visit(this), ast.name, this.visitAll(ast.args));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedRead(ast, context) {
        return new KeyedRead(ast.span, ast.obj.visit(this), ast.key.visit(this));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitKeyedWrite(ast, context) {
        return new KeyedWrite(ast.span, ast.obj.visit(this), ast.key.visit(this), ast.value.visit(this));
    }
    /**
     * @param {?} asts
     * @return {?}
     */
    visitAll(asts) {
        const /** @type {?} */ res = new Array(asts.length);
        for (let /** @type {?} */ i = 0; i < asts.length; ++i) {
            res[i] = asts[i].visit(this);
        }
        return res;
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitChain(ast, context) {
        return new Chain(ast.span, this.visitAll(ast.expressions));
    }
    /**
     * @param {?} ast
     * @param {?} context
     * @return {?}
     */
    visitQuote(ast, context) {
        return new Quote(ast.span, ast.prefix, ast.uninterpretedExpression, ast.location);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9wYXJzZXIvYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsTUFBTTs7Ozs7OztJQUVKLFlBQVksT0FBZSxFQUFTLEtBQWEsRUFBUyxXQUFtQixFQUFTLFdBQWlCO1FBQW5FLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFNO1FBQ3JHLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLE9BQU8sSUFBSSxXQUFXLEtBQUssS0FBSyxRQUFRLFdBQVcsRUFBRSxDQUFDO0tBQ3ZGO0NBQ0Y7Ozs7Ozs7Ozs7O0FBRUQsTUFBTTs7Ozs7SUFDSixZQUFtQixLQUFhLEVBQVMsR0FBVztRQUFqQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtLQUFJO0NBQ3pEOzs7Ozs7O0FBRUQsTUFBTTs7OztJQUNKLFlBQW1CLElBQWU7UUFBZixTQUFJLEdBQUosSUFBSSxDQUFXO0tBQUk7Ozs7OztJQUN0QyxLQUFLLENBQUMsT0FBbUIsRUFBRSxVQUFlLElBQUk7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNiOzs7O0lBQ0QsUUFBUTtRQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDZDtDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlRCxNQUFNLFlBQWEsU0FBUSxHQUFHOzs7Ozs7O0lBQzVCLFlBQVksSUFBZSxFQUFTLE1BQWMsRUFBUyx1QkFBK0IsRUFBUyxRQUFhO1FBQzlHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQURzQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsNEJBQXVCLEdBQXZCLHVCQUF1QixDQUFRO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBSztLQUUvRzs7Ozs7O0lBQ0QsS0FB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Ozs7Ozs7SUFFRCxVQUFVLENBQUMsR0FBVSxFQUFFLE9BQVk7UUFDakMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztLQUM1RDs7Ozs7O0lBRUQsVUFBVSxDQUFDLEdBQVUsRUFBRSxPQUFZO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLHVCQUF1QixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuRjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgY2xhc3MgUGFyc2VyRXJyb3Ige1xuICBwdWJsaWMgbWVzc2FnZTogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIHB1YmxpYyBpbnB1dDogc3RyaW5nLCBwdWJsaWMgZXJyTG9jYXRpb246IHN0cmluZywgcHVibGljIGN0eExvY2F0aW9uPzogYW55KSB7XG4gICAgdGhpcy5tZXNzYWdlID0gYFBhcnNlciBFcnJvcjogJHttZXNzYWdlfSAke2VyckxvY2F0aW9ufSBbJHtpbnB1dH1dIGluICR7Y3R4TG9jYXRpb259YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyc2VTcGFuIHtcbiAgY29uc3RydWN0b3IocHVibGljIHN0YXJ0OiBudW1iZXIsIHB1YmxpYyBlbmQ6IG51bWJlcikge31cbn1cblxuZXhwb3J0IGNsYXNzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzcGFuOiBQYXJzZVNwYW4pIHt9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiQVNUXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcXVvdGVkIGV4cHJlc3Npb24gb2YgdGhlIGZvcm06XG4gKlxuICogcXVvdGUgPSBwcmVmaXggYDpgIHVuaW50ZXJwcmV0ZWRFeHByZXNzaW9uXG4gKiBwcmVmaXggPSBpZGVudGlmaWVyXG4gKiB1bmludGVycHJldGVkRXhwcmVzc2lvbiA9IGFyYml0cmFyeSBzdHJpbmdcbiAqXG4gKiBBIHF1b3RlZCBleHByZXNzaW9uIGlzIG1lYW50IHRvIGJlIHByZS1wcm9jZXNzZWQgYnkgYW4gQVNUIHRyYW5zZm9ybWVyIHRoYXRcbiAqIGNvbnZlcnRzIGl0IGludG8gYW5vdGhlciBBU1QgdGhhdCBubyBsb25nZXIgY29udGFpbnMgcXVvdGVkIGV4cHJlc3Npb25zLlxuICogSXQgaXMgbWVhbnQgdG8gYWxsb3cgdGhpcmQtcGFydHkgZGV2ZWxvcGVycyB0byBleHRlbmQgQW5ndWxhciB0ZW1wbGF0ZVxuICogZXhwcmVzc2lvbiBsYW5ndWFnZS4gVGhlIGB1bmludGVycHJldGVkRXhwcmVzc2lvbmAgcGFydCBvZiB0aGUgcXVvdGUgaXNcbiAqIHRoZXJlZm9yZSBub3QgaW50ZXJwcmV0ZWQgYnkgdGhlIEFuZ3VsYXIncyBvd24gZXhwcmVzc2lvbiBwYXJzZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBRdW90ZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIHByZWZpeDogc3RyaW5nLCBwdWJsaWMgdW5pbnRlcnByZXRlZEV4cHJlc3Npb246IHN0cmluZywgcHVibGljIGxvY2F0aW9uOiBhbnkpIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFF1b3RlKHRoaXMsIGNvbnRleHQpO1xuICB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFwiUXVvdGVcIjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRW1wdHlFeHByIGV4dGVuZHMgQVNUIHtcbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCkge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1wbGljaXRSZWNlaXZlciBleHRlbmRzIEFTVCB7XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SW1wbGljaXRSZWNlaXZlcih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vKipcbiAqIE11bHRpcGxlIGV4cHJlc3Npb25zIHNlcGFyYXRlZCBieSBhIHNlbWljb2xvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENoYWluIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3Ioc3BhbjogUGFyc2VTcGFuLCBwdWJsaWMgZXhwcmVzc2lvbnM6IGFueVtdKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRDaGFpbih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uYWwgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyBjb25kaXRpb246IEFTVCwgcHVibGljIHRydWVFeHA6IEFTVCwgcHVibGljIGZhbHNlRXhwOiBBU1QpIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbmRpdGlvbmFsKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQcm9wZXJ0eVJlYWQgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyByZWNlaXZlcjogQVNULCBwdWJsaWMgbmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRQcm9wZXJ0eVJlYWQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3BlcnR5V3JpdGUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyByZWNlaXZlcjogQVNULCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgdmFsdWU6IEFTVCkge1xuICAgIHN1cGVyKHNwYW4pO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UHJvcGVydHlXcml0ZSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2FmZVByb3BlcnR5UmVhZCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFNhZmVQcm9wZXJ0eVJlYWQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEtleWVkUmVhZCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIG9iajogQVNULCBwdWJsaWMga2V5OiBBU1QpIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEtleWVkUmVhZCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgS2V5ZWRXcml0ZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIG9iajogQVNULCBwdWJsaWMga2V5OiBBU1QsIHB1YmxpYyB2YWx1ZTogQVNUKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRLZXllZFdyaXRlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCaW5kaW5nUGlwZSBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIGV4cDogQVNULCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgYXJnczogYW55W10pIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFBpcGUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpdGVyYWxQcmltaXRpdmUgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyB2YWx1ZTogYW55KSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRMaXRlcmFsUHJpbWl0aXZlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMaXRlcmFsQXJyYXkgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyBleHByZXNzaW9uczogYW55W10pIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxBcnJheSh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIExpdGVyYWxNYXBLZXkge1xuICBrZXk6IHN0cmluZztcbiAgcXVvdGVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgTGl0ZXJhbE1hcCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIGtleXM6IExpdGVyYWxNYXBLZXlbXSwgcHVibGljIHZhbHVlczogYW55W10pIHtcbiAgICBzdXBlcihzcGFuKTtcbiAgfVxuICB2aXNpdCh2aXNpdG9yOiBBc3RWaXNpdG9yLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdExpdGVyYWxNYXAodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludGVycG9sYXRpb24gZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihzcGFuOiBQYXJzZVNwYW4sIHB1YmxpYyBzdHJpbmdzOiBhbnlbXSwgcHVibGljIGV4cHJlc3Npb25zOiBhbnlbXSkge1xuICAgIHN1cGVyKHNwYW4pO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SW50ZXJwb2xhdGlvbih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluYXJ5IGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3Ioc3BhbjogUGFyc2VTcGFuLCBwdWJsaWMgb3BlcmF0aW9uOiBzdHJpbmcsIHB1YmxpYyBsZWZ0OiBBU1QsIHB1YmxpYyByaWdodDogQVNUKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRCaW5hcnkodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByZWZpeE5vdCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIGV4cHJlc3Npb246IEFTVCkge1xuICAgIHN1cGVyKHNwYW4pO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UHJlZml4Tm90KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOb25OdWxsQXNzZXJ0IGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3Ioc3BhbjogUGFyc2VTcGFuLCBwdWJsaWMgZXhwcmVzc2lvbjogQVNUKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXROb25OdWxsQXNzZXJ0KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNZXRob2RDYWxsIGV4dGVuZHMgQVNUIHtcbiAgY29uc3RydWN0b3Ioc3BhbjogUGFyc2VTcGFuLCBwdWJsaWMgcmVjZWl2ZXI6IEFTVCwgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGFyZ3M6IGFueVtdKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRNZXRob2RDYWxsKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTYWZlTWV0aG9kQ2FsbCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIHJlY2VpdmVyOiBBU1QsIHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBhcmdzOiBhbnlbXSkge1xuICAgIHN1cGVyKHNwYW4pO1xuICB9XG4gIHZpc2l0KHZpc2l0b3I6IEFzdFZpc2l0b3IsIGNvbnRleHQ6IGFueSA9IG51bGwpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0U2FmZU1ldGhvZENhbGwodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEZ1bmN0aW9uQ2FsbCBleHRlbmRzIEFTVCB7XG4gIGNvbnN0cnVjdG9yKHNwYW46IFBhcnNlU3BhbiwgcHVibGljIHRhcmdldDogQVNUIHwgbnVsbCwgcHVibGljIGFyZ3M6IGFueVtdKSB7XG4gICAgc3VwZXIoc3Bhbik7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRGdW5jdGlvbkNhbGwodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFTVFdpdGhTb3VyY2UgZXh0ZW5kcyBBU1Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgYXN0OiBBU1QsIHB1YmxpYyBzb3VyY2U6IHN0cmluZyB8IG51bGwsIHB1YmxpYyBsb2NhdGlvbjogc3RyaW5nLCBwdWJsaWMgZXJyb3JzOiBQYXJzZXJFcnJvcltdKSB7XG4gICAgc3VwZXIobmV3IFBhcnNlU3BhbigwLCBzb3VyY2UgPT0gbnVsbCA/IDAgOiBzb3VyY2UubGVuZ3RoKSk7XG4gIH1cbiAgdmlzaXQodmlzaXRvcjogQXN0VmlzaXRvciwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuYXN0LnZpc2l0KHZpc2l0b3IsIGNvbnRleHQpO1xuICB9XG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAke3RoaXMuc291cmNlfSBpbiAke3RoaXMubG9jYXRpb259YDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVtcGxhdGVCaW5kaW5nIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHNwYW46IFBhcnNlU3BhbixcbiAgICBwdWJsaWMga2V5OiBzdHJpbmcsXG4gICAgcHVibGljIGtleUlzVmFyOiBib29sZWFuLFxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXG4gICAgcHVibGljIGV4cHJlc3Npb246IEFTVFdpdGhTb3VyY2VcbiAgKSB7fVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzdFZpc2l0b3Ige1xuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdENoYWluKGFzdDogQ2hhaW4sIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RnVuY3Rpb25DYWxsKGFzdDogRnVuY3Rpb25DYWxsLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0SW1wbGljaXRSZWNlaXZlcihhc3Q6IEltcGxpY2l0UmVjZWl2ZXIsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRJbnRlcnBvbGF0aW9uKGFzdDogSW50ZXJwb2xhdGlvbiwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEtleWVkUmVhZChhc3Q6IEtleWVkUmVhZCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEtleWVkV3JpdGUoYXN0OiBLZXllZFdyaXRlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbEFycmF5KGFzdDogTGl0ZXJhbEFycmF5LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IExpdGVyYWxNYXAsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0UHJlZml4Tm90KGFzdDogUHJlZml4Tm90LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Tm9uTnVsbEFzc2VydChhc3Q6IE5vbk51bGxBc3NlcnQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFF1b3RlKGFzdDogUXVvdGUsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IFNhZmVQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IGFueTtcbiAgdmlzaXQ/KGFzdDogQVNULCBjb250ZXh0PzogYW55KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgUmVjdXJzaXZlQXN0VmlzaXRvciBpbXBsZW1lbnRzIEFzdFZpc2l0b3Ige1xuICB2aXNpdEJpbmFyeShhc3Q6IEJpbmFyeSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QubGVmdC52aXNpdCh0aGlzKTtcbiAgICBhc3QucmlnaHQudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRDaGFpbihhc3Q6IENoYWluLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucywgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRDb25kaXRpb25hbChhc3Q6IENvbmRpdGlvbmFsLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5jb25kaXRpb24udmlzaXQodGhpcyk7XG4gICAgYXN0LnRydWVFeHAudmlzaXQodGhpcyk7XG4gICAgYXN0LmZhbHNlRXhwLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0UGlwZShhc3Q6IEJpbmRpbmdQaXBlLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5leHAudmlzaXQodGhpcyk7XG4gICAgdGhpcy52aXNpdEFsbChhc3QuYXJncywgY29udGV4dCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRGdW5jdGlvbkNhbGwoYXN0OiBGdW5jdGlvbkNhbGwsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnRhcmdldCEudmlzaXQodGhpcyk7XG4gICAgdGhpcy52aXNpdEFsbChhc3QuYXJncywgY29udGV4dCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRJbXBsaWNpdFJlY2VpdmVyKGFzdDogSW1wbGljaXRSZWNlaXZlciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEludGVycG9sYXRpb24oYXN0OiBJbnRlcnBvbGF0aW9uLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucywgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0Lm9iai52aXNpdCh0aGlzKTtcbiAgICBhc3Qua2V5LnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0S2V5ZWRXcml0ZShhc3Q6IEtleWVkV3JpdGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0Lm9iai52aXNpdCh0aGlzKTtcbiAgICBhc3Qua2V5LnZpc2l0KHRoaXMpO1xuICAgIGFzdC52YWx1ZS52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdExpdGVyYWxBcnJheShhc3Q6IExpdGVyYWxBcnJheSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0TGl0ZXJhbE1hcChhc3Q6IExpdGVyYWxNYXAsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LnZhbHVlcywgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRMaXRlcmFsUHJpbWl0aXZlKGFzdDogTGl0ZXJhbFByaW1pdGl2ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy52aXNpdEFsbChhc3QuYXJncywgY29udGV4dCk7XG4gIH1cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LmV4cHJlc3Npb24udmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXROb25OdWxsQXNzZXJ0KGFzdDogTm9uTnVsbEFzc2VydCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QuZXhwcmVzc2lvbi52aXNpdCh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFByb3BlcnR5UmVhZChhc3Q6IFByb3BlcnR5UmVhZCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgYXN0LnZhbHVlLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0U2FmZVByb3BlcnR5UmVhZChhc3Q6IFNhZmVQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0U2FmZU1ldGhvZENhbGwoYXN0OiBTYWZlTWV0aG9kQ2FsbCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICBhc3QucmVjZWl2ZXIudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MsIGNvbnRleHQpO1xuICB9XG4gIHZpc2l0QWxsKGFzdHM6IEFTVFtdLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIGFzdHMuZm9yRWFjaChhc3QgPT4gYXN0LnZpc2l0KHRoaXMsIGNvbnRleHQpKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdFF1b3RlKGFzdDogUXVvdGUsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFzdFRyYW5zZm9ybWVyIGltcGxlbWVudHMgQXN0VmlzaXRvciB7XG4gIHZpc2l0SW1wbGljaXRSZWNlaXZlcihhc3Q6IEltcGxpY2l0UmVjZWl2ZXIsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIGFzdDtcbiAgfVxuXG4gIHZpc2l0SW50ZXJwb2xhdGlvbihhc3Q6IEludGVycG9sYXRpb24sIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnBvbGF0aW9uKGFzdC5zcGFuLCBhc3Quc3RyaW5ncywgdGhpcy52aXNpdEFsbChhc3QuZXhwcmVzc2lvbnMpKTtcbiAgfVxuXG4gIHZpc2l0TGl0ZXJhbFByaW1pdGl2ZShhc3Q6IExpdGVyYWxQcmltaXRpdmUsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsUHJpbWl0aXZlKGFzdC5zcGFuLCBhc3QudmFsdWUpO1xuICB9XG5cbiAgdmlzaXRQcm9wZXJ0eVJlYWQoYXN0OiBQcm9wZXJ0eVJlYWQsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBQcm9wZXJ0eVJlYWQoYXN0LnNwYW4sIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUpO1xuICB9XG5cbiAgdmlzaXRQcm9wZXJ0eVdyaXRlKGFzdDogUHJvcGVydHlXcml0ZSwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IFByb3BlcnR5V3JpdGUoYXN0LnNwYW4sIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIGFzdC52YWx1ZS52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdFNhZmVQcm9wZXJ0eVJlYWQoYXN0OiBTYWZlUHJvcGVydHlSZWFkLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgU2FmZVByb3BlcnR5UmVhZChhc3Quc3BhbiwgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpLCBhc3QubmFtZSk7XG4gIH1cblxuICB2aXNpdE1ldGhvZENhbGwoYXN0OiBNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgTWV0aG9kQ2FsbChhc3Quc3BhbiwgYXN0LnJlY2VpdmVyLnZpc2l0KHRoaXMpLCBhc3QubmFtZSwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRTYWZlTWV0aG9kQ2FsbChhc3Q6IFNhZmVNZXRob2RDYWxsLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgU2FmZU1ldGhvZENhbGwoYXN0LnNwYW4sIGFzdC5yZWNlaXZlci52aXNpdCh0aGlzKSwgYXN0Lm5hbWUsIHRoaXMudmlzaXRBbGwoYXN0LmFyZ3MpKTtcbiAgfVxuXG4gIHZpc2l0RnVuY3Rpb25DYWxsKGFzdDogRnVuY3Rpb25DYWxsLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25DYWxsKGFzdC5zcGFuLCBhc3QudGFyZ2V0IS52aXNpdCh0aGlzKSwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRMaXRlcmFsQXJyYXkoYXN0OiBMaXRlcmFsQXJyYXksIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBMaXRlcmFsQXJyYXkoYXN0LnNwYW4sIHRoaXMudmlzaXRBbGwoYXN0LmV4cHJlc3Npb25zKSk7XG4gIH1cblxuICB2aXNpdExpdGVyYWxNYXAoYXN0OiBMaXRlcmFsTWFwLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbE1hcChhc3Quc3BhbiwgYXN0LmtleXMsIHRoaXMudmlzaXRBbGwoYXN0LnZhbHVlcykpO1xuICB9XG5cbiAgdmlzaXRCaW5hcnkoYXN0OiBCaW5hcnksIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBCaW5hcnkoYXN0LnNwYW4sIGFzdC5vcGVyYXRpb24sIGFzdC5sZWZ0LnZpc2l0KHRoaXMpLCBhc3QucmlnaHQudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRQcmVmaXhOb3QoYXN0OiBQcmVmaXhOb3QsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBQcmVmaXhOb3QoYXN0LnNwYW4sIGFzdC5leHByZXNzaW9uLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0Tm9uTnVsbEFzc2VydChhc3Q6IE5vbk51bGxBc3NlcnQsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBOb25OdWxsQXNzZXJ0KGFzdC5zcGFuLCBhc3QuZXhwcmVzc2lvbi52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdENvbmRpdGlvbmFsKGFzdDogQ29uZGl0aW9uYWwsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBDb25kaXRpb25hbChhc3Quc3BhbiwgYXN0LmNvbmRpdGlvbi52aXNpdCh0aGlzKSwgYXN0LnRydWVFeHAudmlzaXQodGhpcyksIGFzdC5mYWxzZUV4cC52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdFBpcGUoYXN0OiBCaW5kaW5nUGlwZSwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEJpbmRpbmdQaXBlKGFzdC5zcGFuLCBhc3QuZXhwLnZpc2l0KHRoaXMpLCBhc3QubmFtZSwgdGhpcy52aXNpdEFsbChhc3QuYXJncykpO1xuICB9XG5cbiAgdmlzaXRLZXllZFJlYWQoYXN0OiBLZXllZFJlYWQsIGNvbnRleHQ6IGFueSk6IEFTVCB7XG4gICAgcmV0dXJuIG5ldyBLZXllZFJlYWQoYXN0LnNwYW4sIGFzdC5vYmoudmlzaXQodGhpcyksIGFzdC5rZXkudmlzaXQodGhpcykpO1xuICB9XG5cbiAgdmlzaXRLZXllZFdyaXRlKGFzdDogS2V5ZWRXcml0ZSwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IEtleWVkV3JpdGUoYXN0LnNwYW4sIGFzdC5vYmoudmlzaXQodGhpcyksIGFzdC5rZXkudmlzaXQodGhpcyksIGFzdC52YWx1ZS52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdEFsbChhc3RzOiBhbnlbXSk6IGFueVtdIHtcbiAgICBjb25zdCByZXMgPSBuZXcgQXJyYXkoYXN0cy5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0cy5sZW5ndGg7ICsraSkge1xuICAgICAgcmVzW2ldID0gYXN0c1tpXS52aXNpdCh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIHZpc2l0Q2hhaW4oYXN0OiBDaGFpbiwgY29udGV4dDogYW55KTogQVNUIHtcbiAgICByZXR1cm4gbmV3IENoYWluKGFzdC5zcGFuLCB0aGlzLnZpc2l0QWxsKGFzdC5leHByZXNzaW9ucykpO1xuICB9XG5cbiAgdmlzaXRRdW90ZShhc3Q6IFF1b3RlLCBjb250ZXh0OiBhbnkpOiBBU1Qge1xuICAgIHJldHVybiBuZXcgUXVvdGUoYXN0LnNwYW4sIGFzdC5wcmVmaXgsIGFzdC51bmludGVycHJldGVkRXhwcmVzc2lvbiwgYXN0LmxvY2F0aW9uKTtcbiAgfVxufVxuIl19