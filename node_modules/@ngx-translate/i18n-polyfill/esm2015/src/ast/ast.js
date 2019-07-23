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
export class Text {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitText(this, context);
    }
}
function Text_tsickle_Closure_declarations() {
    /** @type {?} */
    Text.prototype.value;
    /** @type {?} */
    Text.prototype.sourceSpan;
}
export class Expansion {
    /**
     * @param {?} switchValue
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     * @param {?} switchValueSourceSpan
     */
    constructor(switchValue, type, cases, sourceSpan, switchValueSourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitExpansion(this, context);
    }
}
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
export class ExpansionCase {
    /**
     * @param {?} value
     * @param {?} expression
     * @param {?} sourceSpan
     * @param {?} valueSourceSpan
     * @param {?} expSourceSpan
     */
    constructor(value, expression, sourceSpan, valueSourceSpan, expSourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitExpansionCase(this, context);
    }
}
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
export class Attribute {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?=} valueSpan
     */
    constructor(name, value, sourceSpan, valueSpan) {
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
    visit(visitor, context) {
        return visitor.visitAttribute(this, context);
    }
}
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
export class Element {
    /**
     * @param {?} name
     * @param {?} attrs
     * @param {?} children
     * @param {?} sourceSpan
     * @param {?=} startSourceSpan
     * @param {?=} endSourceSpan
     */
    constructor(name, attrs, children, sourceSpan, startSourceSpan = null, endSourceSpan = null) {
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
    visit(visitor, context) {
        return visitor.visitElement(this, context);
    }
}
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
export class Comment {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitComment(this, context);
    }
}
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
export function visitAll(visitor, nodes, context = null) {
    const /** @type {?} */ result = [];
    const /** @type {?} */ visit = visitor.visit
        ? (ast) => /** @type {?} */ ((visitor.visit))(ast, context) || ast.visit(visitor, context)
        : (ast) => ast.visit(visitor, context);
    nodes.forEach(ast => {
        const /** @type {?} */ astResult = visit(ast);
        if (astResult) {
            result.push(astResult);
        }
    });
    return result;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9hc3QvYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxNQUFNOzs7OztJQUNKLFlBQW1CLEtBQWEsRUFBUyxVQUEyQjtRQUFqRCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7S0FBSTs7Ozs7O0lBQ3hFLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pDO0NBQ0Y7Ozs7Ozs7QUFFRCxNQUFNOzs7Ozs7OztJQUNKLFlBQ1MsYUFDQSxNQUNBLE9BQ0EsWUFDQTtRQUpBLGdCQUFXLEdBQVgsV0FBVztRQUNYLFNBQUksR0FBSixJQUFJO1FBQ0osVUFBSyxHQUFMLEtBQUs7UUFDTCxlQUFVLEdBQVYsVUFBVTtRQUNWLDBCQUFxQixHQUFyQixxQkFBcUI7S0FDMUI7Ozs7OztJQUNKLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzlDO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7QUFFRCxNQUFNOzs7Ozs7OztJQUNKLFlBQ1MsT0FDQSxZQUNBLFlBQ0EsaUJBQ0E7UUFKQSxVQUFLLEdBQUwsS0FBSztRQUNMLGVBQVUsR0FBVixVQUFVO1FBQ1YsZUFBVSxHQUFWLFVBQVU7UUFDVixvQkFBZSxHQUFmLGVBQWU7UUFDZixrQkFBYSxHQUFiLGFBQWE7S0FDbEI7Ozs7OztJQUVKLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEQ7Q0FDRjs7Ozs7Ozs7Ozs7OztBQUVELE1BQU07Ozs7Ozs7SUFDSixZQUNTLE1BQ0EsT0FDQSxZQUNBO1FBSEEsU0FBSSxHQUFKLElBQUk7UUFDSixVQUFLLEdBQUwsS0FBSztRQUNMLGVBQVUsR0FBVixVQUFVO1FBQ1YsY0FBUyxHQUFULFNBQVM7S0FDZDs7Ozs7O0lBQ0osS0FBSyxDQUFDLE9BQWdCLEVBQUUsT0FBWTtRQUNsQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7Q0FDRjs7Ozs7Ozs7Ozs7QUFFRCxNQUFNOzs7Ozs7Ozs7SUFDSixZQUNTLE1BQ0EsT0FDQSxVQUNBLFlBQ0Esa0JBQTBDLElBQUksRUFDOUMsZ0JBQXdDLElBQUk7UUFMNUMsU0FBSSxHQUFKLElBQUk7UUFDSixVQUFLLEdBQUwsS0FBSztRQUNMLGFBQVEsR0FBUixRQUFRO1FBQ1IsZUFBVSxHQUFWLFVBQVU7UUFDVixvQkFBZSxHQUFmLGVBQWU7UUFDZixrQkFBYSxHQUFiLGFBQWE7S0FDbEI7Ozs7OztJQUNKLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzVDO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7OztBQUVELE1BQU07Ozs7O0lBQ0osWUFBbUIsS0FBb0IsRUFBUyxVQUEyQjtRQUF4RCxVQUFLLEdBQUwsS0FBSyxDQUFlO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBaUI7S0FBSTs7Ozs7O0lBQy9FLEtBQUssQ0FBQyxPQUFnQixFQUFFLE9BQVk7UUFDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzVDO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVELE1BQU0sbUJBQW1CLE9BQWdCLEVBQUUsS0FBYSxFQUFFLFVBQWUsSUFBSTtJQUMzRSx1QkFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO0lBRXpCLHVCQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSztRQUN6QixDQUFDLENBQUMsQ0FBQyxHQUFTLEVBQUUsRUFBRSxvQkFBQyxPQUFPLENBQUMsS0FBSyxHQUFFLEdBQUcsRUFBRSxPQUFPLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDLEdBQVMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNsQix1QkFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3hCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQztDQUNmIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuaW1wb3J0IHtQYXJzZVNvdXJjZVNwYW59IGZyb20gXCIuL3BhcnNlX3V0aWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBOb2RlIHtcbiAgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuO1xuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRXhwYW5zaW9uIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBzd2l0Y2hWYWx1ZTogc3RyaW5nLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNhc2VzOiBFeHBhbnNpb25DYXNlW10sXG4gICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICBwdWJsaWMgc3dpdGNoVmFsdWVTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0RXhwYW5zaW9uKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHBhbnNpb25DYXNlIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nLFxuICAgIHB1YmxpYyBleHByZXNzaW9uOiBOb2RlW10sXG4gICAgcHVibGljIHNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbixcbiAgICBwdWJsaWMgdmFsdWVTb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIGV4cFNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhblxuICApIHt9XG5cbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEV4cGFuc2lvbkNhc2UodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZSBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyB2YWx1ZTogc3RyaW5nLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIHZhbHVlU3Bhbj86IFBhcnNlU291cmNlU3BhblxuICApIHt9XG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHZpc2l0b3IudmlzaXRBdHRyaWJ1dGUodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEVsZW1lbnQgaW1wbGVtZW50cyBOb2RlIHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgYXR0cnM6IEF0dHJpYnV0ZVtdLFxuICAgIHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW4sXG4gICAgcHVibGljIHN0YXJ0U291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuIHwgbnVsbCA9IG51bGwsXG4gICAgcHVibGljIGVuZFNvdXJjZVNwYW46IFBhcnNlU291cmNlU3BhbiB8IG51bGwgPSBudWxsXG4gICkge31cbiAgdmlzaXQodmlzaXRvcjogVmlzaXRvciwgY29udGV4dDogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmlzaXRvci52aXNpdEVsZW1lbnQodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIENvbW1lbnQgaW1wbGVtZW50cyBOb2RlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBzdHJpbmcgfCBudWxsLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuICB2aXNpdCh2aXNpdG9yOiBWaXNpdG9yLCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29tbWVudCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZpc2l0b3Ige1xuICAvLyBSZXR1cm5pbmcgYSB0cnV0aHkgdmFsdWUgZnJvbSBgdmlzaXQoKWAgd2lsbCBwcmV2ZW50IGB2aXNpdEFsbCgpYCBmcm9tIHRoZSBjYWxsIHRvIHRoZSB0eXBlZFxuICAvLyBtZXRob2QgYW5kIHJlc3VsdCByZXR1cm5lZCB3aWxsIGJlY29tZSB0aGUgcmVzdWx0IGluY2x1ZGVkIGluIGB2aXNpdEFsbCgpYHMgcmVzdWx0IGFycmF5LlxuICB2aXNpdD8obm9kZTogTm9kZSwgY29udGV4dDogYW55KTogYW55O1xuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBFbGVtZW50LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0QXR0cmlidXRlKGF0dHJpYnV0ZTogQXR0cmlidXRlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q29tbWVudChjb21tZW50OiBDb21tZW50LCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwYW5zaW9uKGV4cGFuc2lvbjogRXhwYW5zaW9uLCBjb250ZXh0OiBhbnkpOiBhbnk7XG4gIHZpc2l0RXhwYW5zaW9uQ2FzZShleHBhbnNpb25DYXNlOiBFeHBhbnNpb25DYXNlLCBjb250ZXh0OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXNpdEFsbCh2aXNpdG9yOiBWaXNpdG9yLCBub2RlczogTm9kZVtdLCBjb250ZXh0OiBhbnkgPSBudWxsKTogYW55W10ge1xuICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XG5cbiAgY29uc3QgdmlzaXQgPSB2aXNpdG9yLnZpc2l0XG4gICAgPyAoYXN0OiBOb2RlKSA9PiB2aXNpdG9yLnZpc2l0IShhc3QsIGNvbnRleHQpIHx8IGFzdC52aXNpdCh2aXNpdG9yLCBjb250ZXh0KVxuICAgIDogKGFzdDogTm9kZSkgPT4gYXN0LnZpc2l0KHZpc2l0b3IsIGNvbnRleHQpO1xuICBub2Rlcy5mb3JFYWNoKGFzdCA9PiB7XG4gICAgY29uc3QgYXN0UmVzdWx0ID0gdmlzaXQoYXN0KTtcbiAgICBpZiAoYXN0UmVzdWx0KSB7XG4gICAgICByZXN1bHQucHVzaChhc3RSZXN1bHQpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=