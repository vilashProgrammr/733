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
/**
 * @record
 */
export function Node() { }
function Node_tsickle_Closure_declarations() {
    /** @type {?} */
    Node.prototype.sourceSpan;
    /** @type {?} */
    Node.prototype.visit;
}
var Text = /** @class */ (function () {
    function Text(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Text.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitText(this, context);
    };
    return Text;
}());
export { Text };
function Text_tsickle_Closure_declarations() {
    /** @type {?} */
    Text.prototype.value;
    /** @type {?} */
    Text.prototype.sourceSpan;
}
var Expansion = /** @class */ (function () {
    function Expansion(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
        this.switchValue = switchValue;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
        this.switchValueSourceSpan = switchValueSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Expansion.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitExpansion(this, context);
    };
    return Expansion;
}());
export { Expansion };
function Expansion_tsickle_Closure_declarations() {
    /** @type {?} */
    Expansion.prototype.switchValue;
    /** @type {?} */
    Expansion.prototype.type;
    /** @type {?} */
    Expansion.prototype.cases;
    /** @type {?} */
    Expansion.prototype.sourceSpan;
    /** @type {?} */
    Expansion.prototype.switchValueSourceSpan;
}
var ExpansionCase = /** @class */ (function () {
    function ExpansionCase(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
        this.value = value;
        this.expression = expression;
        this.sourceSpan = sourceSpan;
        this.valueSourceSpan = valueSourceSpan;
        this.expSourceSpan = expSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    ExpansionCase.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitExpansionCase(this, context);
    };
    return ExpansionCase;
}());
export { ExpansionCase };
function ExpansionCase_tsickle_Closure_declarations() {
    /** @type {?} */
    ExpansionCase.prototype.value;
    /** @type {?} */
    ExpansionCase.prototype.expression;
    /** @type {?} */
    ExpansionCase.prototype.sourceSpan;
    /** @type {?} */
    ExpansionCase.prototype.valueSourceSpan;
    /** @type {?} */
    ExpansionCase.prototype.expSourceSpan;
}
var Attribute = /** @class */ (function () {
    function Attribute(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Attribute.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitAttribute(this, context);
    };
    return Attribute;
}());
export { Attribute };
function Attribute_tsickle_Closure_declarations() {
    /** @type {?} */
    Attribute.prototype.name;
    /** @type {?} */
    Attribute.prototype.value;
    /** @type {?} */
    Attribute.prototype.sourceSpan;
    /** @type {?} */
    Attribute.prototype.valueSpan;
}
var Element = /** @class */ (function () {
    function Element(name, attrs, children, sourceSpan, startSourceSpan, endSourceSpan) {
        if (startSourceSpan === void 0) { startSourceSpan = null; }
        if (endSourceSpan === void 0) { endSourceSpan = null; }
        this.name = name;
        this.attrs = attrs;
        this.children = children;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Element.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitElement(this, context);
    };
    return Element;
}());
export { Element };
function Element_tsickle_Closure_declarations() {
    /** @type {?} */
    Element.prototype.name;
    /** @type {?} */
    Element.prototype.attrs;
    /** @type {?} */
    Element.prototype.children;
    /** @type {?} */
    Element.prototype.sourceSpan;
    /** @type {?} */
    Element.prototype.startSourceSpan;
    /** @type {?} */
    Element.prototype.endSourceSpan;
}
var Comment = /** @class */ (function () {
    function Comment(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    Comment.prototype.visit = /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitComment(this, context);
    };
    return Comment;
}());
export { Comment };
function Comment_tsickle_Closure_declarations() {
    /** @type {?} */
    Comment.prototype.value;
    /** @type {?} */
    Comment.prototype.sourceSpan;
}
/**
 * @record
 */
export function Visitor() { }
function Visitor_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    Visitor.prototype.visit;
    /** @type {?} */
    Visitor.prototype.visitElement;
    /** @type {?} */
    Visitor.prototype.visitAttribute;
    /** @type {?} */
    Visitor.prototype.visitText;
    /** @type {?} */
    Visitor.prototype.visitComment;
    /** @type {?} */
    Visitor.prototype.visitExpansion;
    /** @type {?} */
    Visitor.prototype.visitExpansionCase;
}
/**
 * @param {?} visitor
 * @param {?} nodes
 * @param {?=} context
 * @return {?}
 */
export function visitAll(visitor, nodes, context) {
    if (context === void 0) { context = null; }
    var /** @type {?} */ result = [];
    var /** @type {?} */ visit = visitor.visit
        ? function (ast) { return ((visitor.visit))(ast, context) || ast.visit(visitor, context); }
        : function (ast) { return ast.visit(visitor, context); };
    nodes.forEach(function (ast) {
        var /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9hc3QvYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxJQUFBO0lBQ0UsY0FBbUIsS0FBYSxFQUFTLFVBQTJCO1FBQWpELFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxlQUFVLEdBQVYsVUFBVSxDQUFpQjtLQUFJOzs7Ozs7SUFDeEUsb0JBQUs7Ozs7O0lBQUwsVUFBTSxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pDO2VBcEJIO0lBcUJDLENBQUE7QUFMRCxnQkFLQzs7Ozs7OztBQUVELElBQUE7SUFDRSxtQkFDUyxhQUNBLE1BQ0EsT0FDQSxZQUNBO1FBSkEsZ0JBQVcsR0FBWCxXQUFXO1FBQ1gsU0FBSSxHQUFKLElBQUk7UUFDSixVQUFLLEdBQUwsS0FBSztRQUNMLGVBQVUsR0FBVixVQUFVO1FBQ1YsMEJBQXFCLEdBQXJCLHFCQUFxQjtLQUMxQjs7Ozs7O0lBQ0oseUJBQUs7Ozs7O0lBQUwsVUFBTSxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzlDO29CQWpDSDtJQWtDQyxDQUFBO0FBWEQscUJBV0M7Ozs7Ozs7Ozs7Ozs7QUFFRCxJQUFBO0lBQ0UsdUJBQ1MsT0FDQSxZQUNBLFlBQ0EsaUJBQ0E7UUFKQSxVQUFLLEdBQUwsS0FBSztRQUNMLGVBQVUsR0FBVixVQUFVO1FBQ1YsZUFBVSxHQUFWLFVBQVU7UUFDVixvQkFBZSxHQUFmLGVBQWU7UUFDZixrQkFBYSxHQUFiLGFBQWE7S0FDbEI7Ozs7OztJQUVKLDZCQUFLOzs7OztJQUFMLFVBQU0sT0FBZ0IsRUFBRSxPQUFZO1FBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2xEO3dCQS9DSDtJQWdEQyxDQUFBO0FBWkQseUJBWUM7Ozs7Ozs7Ozs7Ozs7QUFFRCxJQUFBO0lBQ0UsbUJBQ1MsTUFDQSxPQUNBLFlBQ0E7UUFIQSxTQUFJLEdBQUosSUFBSTtRQUNKLFVBQUssR0FBTCxLQUFLO1FBQ0wsZUFBVSxHQUFWLFVBQVU7UUFDVixjQUFTLEdBQVQsU0FBUztLQUNkOzs7Ozs7SUFDSix5QkFBSzs7Ozs7SUFBTCxVQUFNLE9BQWdCLEVBQUUsT0FBWTtRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7b0JBM0RIO0lBNERDLENBQUE7QUFWRCxxQkFVQzs7Ozs7Ozs7Ozs7QUFFRCxJQUFBO0lBQ0UsaUJBQ1MsTUFDQSxPQUNBLFVBQ0EsWUFDQSxpQkFDQTs7O1FBTEEsU0FBSSxHQUFKLElBQUk7UUFDSixVQUFLLEdBQUwsS0FBSztRQUNMLGFBQVEsR0FBUixRQUFRO1FBQ1IsZUFBVSxHQUFWLFVBQVU7UUFDVixvQkFBZSxHQUFmLGVBQWU7UUFDZixrQkFBYSxHQUFiLGFBQWE7S0FDbEI7Ozs7OztJQUNKLHVCQUFLOzs7OztJQUFMLFVBQU0sT0FBZ0IsRUFBRSxPQUFZO1FBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM1QztrQkF6RUg7SUEwRUMsQ0FBQTtBQVpELG1CQVlDOzs7Ozs7Ozs7Ozs7Ozs7QUFFRCxJQUFBO0lBQ0UsaUJBQW1CLEtBQW9CLEVBQVMsVUFBMkI7UUFBeEQsVUFBSyxHQUFMLEtBQUssQ0FBZTtRQUFTLGVBQVUsR0FBVixVQUFVLENBQWlCO0tBQUk7Ozs7OztJQUMvRSx1QkFBSzs7Ozs7SUFBTCxVQUFNLE9BQWdCLEVBQUUsT0FBWTtRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDNUM7a0JBaEZIO0lBaUZDLENBQUE7QUFMRCxtQkFLQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUQsTUFBTSxtQkFBbUIsT0FBZ0IsRUFBRSxLQUFhLEVBQUUsT0FBbUI7SUFBbkIsd0JBQUEsRUFBQSxjQUFtQjtJQUMzRSxxQkFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO0lBRXpCLHFCQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSztRQUN6QixDQUFDLENBQUMsVUFBQyxHQUFTLGFBQUssT0FBTyxDQUFDLEtBQUssR0FBRSxHQUFHLEVBQUUsT0FBTyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFBO1FBQzVFLENBQUMsQ0FBQyxVQUFDLEdBQVMsSUFBSyxPQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUEzQixDQUEyQixDQUFDO0lBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHO1FBQ2YscUJBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4QjtLQUNGLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQUM7Q0FDZiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyogdHNsaW50OmRpc2FibGUgKi9cbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tIFwiLi9wYXJzZV91dGlsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTm9kZSB7XG4gIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbjtcbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55O1xufVxuXG5leHBvcnQgY2xhc3MgVGV4dCBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IHN0cmluZywgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdFRleHQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cGFuc2lvbiBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgc3dpdGNoVmFsdWU6IHN0cmluZyxcbiAgICBwdWJsaWMgdHlwZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjYXNlczogRXhwYW5zaW9uQ2FzZVtdLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIHN3aXRjaFZhbHVlU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuXG4gICkge31cbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEV4cGFuc2lvbih0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwYW5zaW9uQ2FzZSBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZyxcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogTm9kZVtdLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIHZhbHVlU291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHB1YmxpYyBleHBTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFeHBhbnNpb25DYXNlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyaWJ1dGUgaW1wbGVtZW50cyBOb2RlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgdmFsdWU6IHN0cmluZyxcbiAgICBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHB1YmxpYyB2YWx1ZVNwYW4/OiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0QXR0cmlidXRlKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFbGVtZW50IGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcsXG4gICAgcHVibGljIGF0dHJzOiBBdHRyaWJ1dGVbXSxcbiAgICBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXSxcbiAgICBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuLFxuICAgIHB1YmxpYyBzdGFydFNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiB8IG51bGwgPSBudWxsLFxuICAgIHB1YmxpYyBlbmRTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4gfCBudWxsID0gbnVsbFxuICApIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRFbGVtZW50KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDb21tZW50IGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nIHwgbnVsbCwgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3Bhbikge31cbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdENvbW1lbnQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBWaXNpdG9yIHtcbiAgLy8gUmV0dXJuaW5nIGEgdHJ1dGh5IHZhbHVlIGZyb20gYHZpc2l0KClgIHdpbGwgcHJldmVudCBgdmlzaXRBbGwoKWAgZnJvbSB0aGUgY2FsbCB0byB0aGUgdHlwZWRcbiAgLy8gbWV0aG9kIGFuZCByZXN1bHQgcmV0dXJuZWQgd2lsbCBiZWNvbWUgdGhlIHJlc3VsdCBpbmNsdWRlZCBpbiBgdmlzaXRBbGwoKWBzIHJlc3VsdCBhcnJheS5cbiAgdmlzaXQ/KG5vZGU6IE5vZGUsIGNvbnRleHQ6IGFueSk6IGFueTtcblxuICB2aXNpdEVsZW1lbnQoZWxlbWVudDogRWxlbWVudCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEF0dHJpYnV0ZShhdHRyaWJ1dGU6IEF0dHJpYnV0ZSwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdFRleHQodGV4dDogVGV4dCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdENvbW1lbnQoY29tbWVudDogQ29tbWVudCwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEV4cGFuc2lvbihleHBhbnNpb246IEV4cGFuc2lvbiwgY29udGV4dDogYW55KTogYW55O1xuICB2aXNpdEV4cGFuc2lvbkNhc2UoZXhwYW5zaW9uQ2FzZTogRXhwYW5zaW9uQ2FzZSwgY29udGV4dDogYW55KTogYW55O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmlzaXRBbGwodmlzaXRvcjogVmlzaXRvciwgbm9kZXM6IE5vZGVbXSwgY29udGV4dDogYW55ID0gbnVsbCk6IGFueVtdIHtcbiAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xuXG4gIGNvbnN0IHZpc2l0ID0gdmlzaXRvci52aXNpdFxuICAgID8gKGFzdDogTm9kZSkgPT4gdmlzaXRvci52aXNpdCEoYXN0LCBjb250ZXh0KSB8fCBhc3QudmlzaXQodmlzaXRvciwgY29udGV4dClcbiAgICA6IChhc3Q6IE5vZGUpID0+IGFzdC52aXNpdCh2aXNpdG9yLCBjb250ZXh0KTtcbiAgbm9kZXMuZm9yRWFjaChhc3QgPT4ge1xuICAgIGNvbnN0IGFzdFJlc3VsdCA9IHZpc2l0KGFzdCk7XG4gICAgaWYgKGFzdFJlc3VsdCkge1xuICAgICAgcmVzdWx0LnB1c2goYXN0UmVzdWx0KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuIl19