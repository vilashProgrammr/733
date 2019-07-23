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
var Message = /** @class */ (function () {
    /**
     * @param source message AST
     * @param placeholders maps placeholder names to static content
     * @param placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param meaning
     * @param description
     * @param id
     */
    function Message(nodes, placeholders, placeholderToMessage, meaning, description, id) {
        this.nodes = nodes;
        this.placeholders = placeholders;
        this.placeholderToMessage = placeholderToMessage;
        this.meaning = meaning;
        this.description = description;
        this.id = id;
        if (nodes.length) {
            this.sources = [
                {
                    filePath: nodes[0].sourceSpan.start.file.url,
                    startLine: nodes[0].sourceSpan.start.line + 1,
                    startCol: nodes[0].sourceSpan.start.col + 1,
                    endLine: nodes[nodes.length - 1].sourceSpan.end.line + 1,
                    endCol: nodes[0].sourceSpan.start.col + 1
                }
            ];
        }
        else {
            this.sources = [];
        }
    }
    return Message;
}());
export { Message };
function Message_tsickle_Closure_declarations() {
    /** @type {?} */
    Message.prototype.sources;
    /** @type {?} */
    Message.prototype.nodes;
    /** @type {?} */
    Message.prototype.placeholders;
    /** @type {?} */
    Message.prototype.placeholderToMessage;
    /** @type {?} */
    Message.prototype.meaning;
    /** @type {?} */
    Message.prototype.description;
    /** @type {?} */
    Message.prototype.id;
}
/**
 * @record
 */
export function MessageSpan() { }
function MessageSpan_tsickle_Closure_declarations() {
    /** @type {?} */
    MessageSpan.prototype.filePath;
    /** @type {?} */
    MessageSpan.prototype.startLine;
    /** @type {?} */
    MessageSpan.prototype.startCol;
    /** @type {?} */
    MessageSpan.prototype.endLine;
    /** @type {?} */
    MessageSpan.prototype.endCol;
}
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
     * @param {?=} context
     * @return {?}
     */
    Text.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
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
var Container = /** @class */ (function () {
    function Container(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Container.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitContainer(this, context);
    };
    return Container;
}());
export { Container };
function Container_tsickle_Closure_declarations() {
    /** @type {?} */
    Container.prototype.children;
    /** @type {?} */
    Container.prototype.sourceSpan;
}
var Icu = /** @class */ (function () {
    function Icu(expression, type, cases, sourceSpan) {
        this.expression = expression;
        this.type = type;
        this.cases = cases;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Icu.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitIcu(this, context);
    };
    return Icu;
}());
export { Icu };
function Icu_tsickle_Closure_declarations() {
    /** @type {?} */
    Icu.prototype.expressionPlaceholder;
    /** @type {?} */
    Icu.prototype.expression;
    /** @type {?} */
    Icu.prototype.type;
    /** @type {?} */
    Icu.prototype.cases;
    /** @type {?} */
    Icu.prototype.sourceSpan;
}
var TagPlaceholder = /** @class */ (function () {
    function TagPlaceholder(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
        this.tag = tag;
        this.attrs = attrs;
        this.startName = startName;
        this.closeName = closeName;
        this.children = children;
        this.isVoid = isVoid;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    TagPlaceholder.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitTagPlaceholder(this, context);
    };
    return TagPlaceholder;
}());
export { TagPlaceholder };
function TagPlaceholder_tsickle_Closure_declarations() {
    /** @type {?} */
    TagPlaceholder.prototype.tag;
    /** @type {?} */
    TagPlaceholder.prototype.attrs;
    /** @type {?} */
    TagPlaceholder.prototype.startName;
    /** @type {?} */
    TagPlaceholder.prototype.closeName;
    /** @type {?} */
    TagPlaceholder.prototype.children;
    /** @type {?} */
    TagPlaceholder.prototype.isVoid;
    /** @type {?} */
    TagPlaceholder.prototype.sourceSpan;
}
var Placeholder = /** @class */ (function () {
    function Placeholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    Placeholder.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitPlaceholder(this, context);
    };
    return Placeholder;
}());
export { Placeholder };
function Placeholder_tsickle_Closure_declarations() {
    /** @type {?} */
    Placeholder.prototype.value;
    /** @type {?} */
    Placeholder.prototype.name;
    /** @type {?} */
    Placeholder.prototype.sourceSpan;
}
var IcuPlaceholder = /** @class */ (function () {
    function IcuPlaceholder(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    IcuPlaceholder.prototype.visit = /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    function (visitor, context) {
        return visitor.visitIcuPlaceholder(this, context);
    };
    return IcuPlaceholder;
}());
export { IcuPlaceholder };
function IcuPlaceholder_tsickle_Closure_declarations() {
    /** @type {?} */
    IcuPlaceholder.prototype.value;
    /** @type {?} */
    IcuPlaceholder.prototype.name;
    /** @type {?} */
    IcuPlaceholder.prototype.sourceSpan;
}
/**
 * @record
 */
export function Visitor() { }
function Visitor_tsickle_Closure_declarations() {
    /** @type {?} */
    Visitor.prototype.visitText;
    /** @type {?} */
    Visitor.prototype.visitContainer;
    /** @type {?} */
    Visitor.prototype.visitIcu;
    /** @type {?} */
    Visitor.prototype.visitTagPlaceholder;
    /** @type {?} */
    Visitor.prototype.visitPlaceholder;
    /** @type {?} */
    Visitor.prototype.visitIcuPlaceholder;
}
var CloneVisitor = /** @class */ (function () {
    function CloneVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) {
        return new Text(text.value, text.sourceSpan);
    };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        var /** @type {?} */ children = container.children.map(function (n) { return n.visit(_this, context); });
        return new Container(children, container.sourceSpan);
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ cases = {};
        Object.keys(icu.cases).forEach(function (key) { return (cases[key] = icu.cases[key].visit(_this, context)); });
        var /** @type {?} */ msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var _this = this;
        var /** @type {?} */ children = ph.children.map(function (n) { return n.visit(_this, context); });
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    CloneVisitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
    };
    return CloneVisitor;
}());
export { CloneVisitor };
var RecurseVisitor = /** @class */ (function () {
    function RecurseVisitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) { };
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        container.children.forEach(function (child) { return child.visit(_this); });
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        Object.keys(icu.cases).forEach(function (k) {
            icu.cases[k].visit(_this);
        });
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var _this = this;
        ph.children.forEach(function (child) { return child.visit(_this); });
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) { };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    RecurseVisitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) { };
    return RecurseVisitor;
}());
export { RecurseVisitor };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9hc3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL2FzdC9pMThuX2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVlBLElBQUE7SUFHRTs7Ozs7OztPQU9HO0lBQ0gsaUJBQ1MsT0FDQSxjQUNBLHNCQUNBLFNBQ0EsYUFDQTtRQUxBLFVBQUssR0FBTCxLQUFLO1FBQ0wsaUJBQVksR0FBWixZQUFZO1FBQ1oseUJBQW9CLEdBQXBCLG9CQUFvQjtRQUNwQixZQUFPLEdBQVAsT0FBTztRQUNQLGdCQUFXLEdBQVgsV0FBVztRQUNYLE9BQUUsR0FBRixFQUFFO1FBRVQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRztnQkFDYjtvQkFDRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzVDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDN0MsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUMzQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDeEQsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO2lCQUMxQzthQUNGLENBQUM7U0FDSDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFF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QUM7S0FDeEQ7Ozs7OztJQUVELGlDQUFROzs7OztJQUFSLFVBQVMsR0FBUSxFQUFFLE9BQWE7UUFBaEMsaUJBSUM7UUFIQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxDQUFDO1NBQzFCLENBQUMsQ0FBQztLQUNKOzs7Ozs7SUFFRCw0Q0FBbUI7Ozs7O0lBQW5CLFVBQW9CLEVBQWtCLEVBQUUsT0FBYTtRQUFyRCxpQkFFQztRQURDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0tBQ2pEOzs7Ozs7SUFFRCx5Q0FBZ0I7Ozs7O0lBQWhCLFVBQWlCLEVBQWUsRUFBRSxPQUFhLEtBQVM7Ozs7OztJQUV4RCw0Q0FBbUI7Ozs7O0lBQW5CLFVBQW9CLEVBQWtCLEVBQUUsT0FBYSxLQUFTO3lCQTFMaEU7SUEyTEMsQ0FBQTtBQXBCRCwwQkFvQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlICovXG5cbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tIFwiLi9wYXJzZV91dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcbiAgc291cmNlczogTWVzc2FnZVNwYW5bXTtcblxuICAvKipcbiAgICogQHBhcmFtIHNvdXJjZSBtZXNzYWdlIEFTVFxuICAgKiBAcGFyYW0gcGxhY2Vob2xkZXJzIG1hcHMgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3RhdGljIGNvbnRlbnRcbiAgICogQHBhcmFtIHBsYWNlaG9sZGVyVG9NZXNzYWdlIG1hcHMgcGxhY2Vob2xkZXIgbmFtZXMgdG8gbWVzc2FnZXMgKHVzZWQgZm9yIG5lc3RlZCBJQ1UgbWVzc2FnZXMpXG4gICAqIEBwYXJhbSBtZWFuaW5nXG4gICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBub2RlczogTm9kZVtdLFxuICAgIHB1YmxpYyBwbGFjZWhvbGRlcnM6IHtbcGhOYW1lOiBzdHJpbmddOiBzdHJpbmd9LFxuICAgIHB1YmxpYyBwbGFjZWhvbGRlclRvTWVzc2FnZToge1twaE5hbWU6IHN0cmluZ106IE1lc3NhZ2V9LFxuICAgIHB1YmxpYyBtZWFuaW5nOiBzdHJpbmcsXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgcHVibGljIGlkOiBzdHJpbmdcbiAgKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zb3VyY2VzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZmlsZVBhdGg6IG5vZGVzWzBdLnNvdXJjZVNwYW4uc3RhcnQuZmlsZS51cmwsXG4gICAgICAgICAgc3RhcnRMaW5lOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmxpbmUgKyAxLFxuICAgICAgICAgIHN0YXJ0Q29sOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmNvbCArIDEsXG4gICAgICAgICAgZW5kTGluZTogbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0uc291cmNlU3Bhbi5lbmQubGluZSArIDEsXG4gICAgICAgICAgZW5kQ29sOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmNvbCArIDFcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zb3VyY2VzID0gW107XG4gICAgfVxuICB9XG59XG5cbi8vIGxpbmUgYW5kIGNvbHVtbnMgaW5kZXhlcyBhcmUgMSBiYXNlZFxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlU3BhbiB7XG4gIGZpbGVQYXRoOiBzdHJpbmc7XG4gIHN0YXJ0TGluZTogbnVtYmVyO1xuICBzdGFydENvbDogbnVtYmVyO1xuICBlbmRMaW5lOiBudW1iZXI7XG4gIGVuZENvbDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGUge1xuICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW47XG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vLyBUT0RPKHZpY2IpOiBkbyB3ZSByZWFsbHkgbmVlZCB0aGlzIG5vZGUgKHZzIGFuIGFycmF5KSA/XG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29udGFpbmVyKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJY3UgaW1wbGVtZW50cyBOb2RlIHtcbiAgcHVibGljIGV4cHJlc3Npb25QbGFjZWhvbGRlcjogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogc3RyaW5nLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNhc2VzOiB7W2s6IHN0cmluZ106IE5vZGV9LFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SWN1KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYWdQbGFjZWhvbGRlciBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdGFnOiBzdHJpbmcsXG4gICAgcHVibGljIGF0dHJzOiB7W2s6IHN0cmluZ106IHN0cmluZ30sXG4gICAgcHVibGljIHN0YXJ0TmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjbG9zZU5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXSxcbiAgICBwdWJsaWMgaXNWb2lkOiBib29sZWFuLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGFnUGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEljdVBsYWNlaG9sZGVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogSWN1LCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SWN1UGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBWaXNpdG9yIHtcbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogQ29udGFpbmVyLCBjb250ZXh0PzogYW55KTogYW55O1xuICB2aXNpdEljdShpY3U6IEljdSwgY29udGV4dD86IGFueSk6IGFueTtcbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IFBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55O1xuICB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBJY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueTtcbn1cblxuLy8gQ2xvbmUgdGhlIEFTVFxuZXhwb3J0IGNsYXNzIENsb25lVmlzaXRvciBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICB2aXNpdFRleHQodGV4dDogVGV4dCwgY29udGV4dD86IGFueSk6IFRleHQge1xuICAgIHJldHVybiBuZXcgVGV4dCh0ZXh0LnZhbHVlLCB0ZXh0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBDb250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiBDb250YWluZXIge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gY29udGFpbmVyLmNoaWxkcmVuLm1hcChuID0+IG4udmlzaXQodGhpcywgY29udGV4dCkpO1xuICAgIHJldHVybiBuZXcgQ29udGFpbmVyKGNoaWxkcmVuLCBjb250YWluZXIuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IEljdSwgY29udGV4dD86IGFueSk6IEljdSB7XG4gICAgY29uc3QgY2FzZXM6IHtbazogc3RyaW5nXTogTm9kZX0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goa2V5ID0+IChjYXNlc1trZXldID0gaWN1LmNhc2VzW2tleV0udmlzaXQodGhpcywgY29udGV4dCkpKTtcbiAgICBjb25zdCBtc2cgPSBuZXcgSWN1KGljdS5leHByZXNzaW9uLCBpY3UudHlwZSwgY2FzZXMsIGljdS5zb3VyY2VTcGFuKTtcbiAgICBtc2cuZXhwcmVzc2lvblBsYWNlaG9sZGVyID0gaWN1LmV4cHJlc3Npb25QbGFjZWhvbGRlcjtcbiAgICByZXR1cm4gbXNnO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBUYWdQbGFjZWhvbGRlciB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBwaC5jaGlsZHJlbi5tYXAobiA9PiBuLnZpc2l0KHRoaXMsIGNvbnRleHQpKTtcbiAgICByZXR1cm4gbmV3IFRhZ1BsYWNlaG9sZGVyKHBoLnRhZywgcGguYXR0cnMsIHBoLnN0YXJ0TmFtZSwgcGguY2xvc2VOYW1lLCBjaGlsZHJlbiwgcGguaXNWb2lkLCBwaC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IFBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogUGxhY2Vob2xkZXIge1xuICAgIHJldHVybiBuZXcgUGxhY2Vob2xkZXIocGgudmFsdWUsIHBoLm5hbWUsIHBoLnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBJY3VQbGFjZWhvbGRlciB7XG4gICAgcmV0dXJuIG5ldyBJY3VQbGFjZWhvbGRlcihwaC52YWx1ZSwgcGgubmFtZSwgcGguc291cmNlU3Bhbik7XG4gIH1cbn1cblxuLy8gVmlzaXQgYWxsIHRoZSBub2RlcyByZWN1cnNpdmVseVxuZXhwb3J0IGNsYXNzIFJlY3Vyc2VWaXNpdG9yIGltcGxlbWVudHMgVmlzaXRvciB7XG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0LCBjb250ZXh0PzogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBDb250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0SWN1KGljdTogSWN1LCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goayA9PiB7XG4gICAgICBpY3UuY2FzZXNba10udmlzaXQodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdFRhZ1BsYWNlaG9sZGVyKHBoOiBUYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgcGguY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IEljdVBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55IHt9XG59XG4iXX0=