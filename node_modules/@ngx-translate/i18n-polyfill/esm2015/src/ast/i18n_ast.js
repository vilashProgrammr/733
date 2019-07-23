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
export class Message {
    /**
     * @param {?} nodes
     * @param {?} placeholders maps placeholder names to static content
     * @param {?} placeholderToMessage maps placeholder names to messages (used for nested ICU messages)
     * @param {?} meaning
     * @param {?} description
     * @param {?} id
     */
    constructor(nodes, placeholders, placeholderToMessage, meaning, description, id) {
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
}
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
     * @param {?=} context
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
export class Container {
    /**
     * @param {?} children
     * @param {?} sourceSpan
     */
    constructor(children, sourceSpan) {
        this.children = children;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitContainer(this, context);
    }
}
function Container_tsickle_Closure_declarations() {
    /** @type {?} */
    Container.prototype.children;
    /** @type {?} */
    Container.prototype.sourceSpan;
}
export class Icu {
    /**
     * @param {?} expression
     * @param {?} type
     * @param {?} cases
     * @param {?} sourceSpan
     */
    constructor(expression, type, cases, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitIcu(this, context);
    }
}
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
export class TagPlaceholder {
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} startName
     * @param {?} closeName
     * @param {?} children
     * @param {?} isVoid
     * @param {?} sourceSpan
     */
    constructor(tag, attrs, startName, closeName, children, isVoid, sourceSpan) {
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
    visit(visitor, context) {
        return visitor.visitTagPlaceholder(this, context);
    }
}
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
export class Placeholder {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitPlaceholder(this, context);
    }
}
function Placeholder_tsickle_Closure_declarations() {
    /** @type {?} */
    Placeholder.prototype.value;
    /** @type {?} */
    Placeholder.prototype.name;
    /** @type {?} */
    Placeholder.prototype.sourceSpan;
}
export class IcuPlaceholder {
    /**
     * @param {?} value
     * @param {?} name
     * @param {?} sourceSpan
     */
    constructor(value, name, sourceSpan) {
        this.value = value;
        this.name = name;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    visit(visitor, context) {
        return visitor.visitIcuPlaceholder(this, context);
    }
}
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
export class CloneVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) {
        return new Text(text.value, text.sourceSpan);
    }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        const /** @type {?} */ children = container.children.map(n => n.visit(this, context));
        return new Container(children, container.sourceSpan);
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        const /** @type {?} */ cases = {};
        Object.keys(icu.cases).forEach(key => (cases[key] = icu.cases[key].visit(this, context)));
        const /** @type {?} */ msg = new Icu(icu.expression, icu.type, cases, icu.sourceSpan);
        msg.expressionPlaceholder = icu.expressionPlaceholder;
        return msg;
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        const /** @type {?} */ children = ph.children.map(n => n.visit(this, context));
        return new TagPlaceholder(ph.tag, ph.attrs, ph.startName, ph.closeName, children, ph.isVoid, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) {
        return new Placeholder(ph.value, ph.name, ph.sourceSpan);
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) {
        return new IcuPlaceholder(ph.value, ph.name, ph.sourceSpan);
    }
}
export class RecurseVisitor {
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    visitText(text, context) { }
    /**
     * @param {?} container
     * @param {?=} context
     * @return {?}
     */
    visitContainer(container, context) {
        container.children.forEach(child => child.visit(this));
    }
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    visitIcu(icu, context) {
        Object.keys(icu.cases).forEach(k => {
            icu.cases[k].visit(this);
        });
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitTagPlaceholder(ph, context) {
        ph.children.forEach(child => child.visit(this));
    }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitPlaceholder(ph, context) { }
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    visitIcuPlaceholder(ph, context) { }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9hc3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL2FzdC9pMThuX2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVlBLE1BQU07Ozs7Ozs7OztJQVdKLFlBQ1MsT0FDQSxjQUNBLHNCQUNBLFNBQ0EsYUFDQTtRQUxBLFVBQUssR0FBTCxLQUFLO1FBQ0wsaUJBQVksR0FBWixZQUFZO1FBQ1oseUJBQW9CLEdBQXBCLG9CQUFvQjtRQUNwQixZQUFPLEdBQVAsT0FBTztRQUNQLGdCQUFXLEdBQVgsV0FBVztRQUNYLE9BQUUsR0FBRixFQUFFO1FBRVQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRztnQkFDYjtvQkFDRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQzVDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDN0MsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO29CQUMzQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQztvQkFDeEQsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDO2lCQUMxQzthQUNGLENBQUM7U0FDSDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FD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RUFBa0IsRUFBRSxPQUFhLEtBQVM7Q0FDL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qIHRzbGludDpkaXNhYmxlICovXG5cbmltcG9ydCB7UGFyc2VTb3VyY2VTcGFufSBmcm9tIFwiLi9wYXJzZV91dGlsXCI7XG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIHtcbiAgc291cmNlczogTWVzc2FnZVNwYW5bXTtcblxuICAvKipcbiAgICogQHBhcmFtIHNvdXJjZSBtZXNzYWdlIEFTVFxuICAgKiBAcGFyYW0gcGxhY2Vob2xkZXJzIG1hcHMgcGxhY2Vob2xkZXIgbmFtZXMgdG8gc3RhdGljIGNvbnRlbnRcbiAgICogQHBhcmFtIHBsYWNlaG9sZGVyVG9NZXNzYWdlIG1hcHMgcGxhY2Vob2xkZXIgbmFtZXMgdG8gbWVzc2FnZXMgKHVzZWQgZm9yIG5lc3RlZCBJQ1UgbWVzc2FnZXMpXG4gICAqIEBwYXJhbSBtZWFuaW5nXG4gICAqIEBwYXJhbSBkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0gaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBub2RlczogTm9kZVtdLFxuICAgIHB1YmxpYyBwbGFjZWhvbGRlcnM6IHtbcGhOYW1lOiBzdHJpbmddOiBzdHJpbmd9LFxuICAgIHB1YmxpYyBwbGFjZWhvbGRlclRvTWVzc2FnZToge1twaE5hbWU6IHN0cmluZ106IE1lc3NhZ2V9LFxuICAgIHB1YmxpYyBtZWFuaW5nOiBzdHJpbmcsXG4gICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgcHVibGljIGlkOiBzdHJpbmdcbiAgKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCkge1xuICAgICAgdGhpcy5zb3VyY2VzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgZmlsZVBhdGg6IG5vZGVzWzBdLnNvdXJjZVNwYW4uc3RhcnQuZmlsZS51cmwsXG4gICAgICAgICAgc3RhcnRMaW5lOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmxpbmUgKyAxLFxuICAgICAgICAgIHN0YXJ0Q29sOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmNvbCArIDEsXG4gICAgICAgICAgZW5kTGluZTogbm9kZXNbbm9kZXMubGVuZ3RoIC0gMV0uc291cmNlU3Bhbi5lbmQubGluZSArIDEsXG4gICAgICAgICAgZW5kQ29sOiBub2Rlc1swXS5zb3VyY2VTcGFuLnN0YXJ0LmNvbCArIDFcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zb3VyY2VzID0gW107XG4gICAgfVxuICB9XG59XG5cbi8vIGxpbmUgYW5kIGNvbHVtbnMgaW5kZXhlcyBhcmUgMSBiYXNlZFxuZXhwb3J0IGludGVyZmFjZSBNZXNzYWdlU3BhbiB7XG4gIGZpbGVQYXRoOiBzdHJpbmc7XG4gIHN0YXJ0TGluZTogbnVtYmVyO1xuICBzdGFydENvbDogbnVtYmVyO1xuICBlbmRMaW5lOiBudW1iZXI7XG4gIGVuZENvbDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE5vZGUge1xuICBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW47XG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGV4dCh0aGlzLCBjb250ZXh0KTtcbiAgfVxufVxuXG4vLyBUT0RPKHZpY2IpOiBkbyB3ZSByZWFsbHkgbmVlZCB0aGlzIG5vZGUgKHZzIGFuIGFycmF5KSA/XG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBjaGlsZHJlbjogTm9kZVtdLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0Q29udGFpbmVyKHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJY3UgaW1wbGVtZW50cyBOb2RlIHtcbiAgcHVibGljIGV4cHJlc3Npb25QbGFjZWhvbGRlcjogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgZXhwcmVzc2lvbjogc3RyaW5nLFxuICAgIHB1YmxpYyB0eXBlOiBzdHJpbmcsXG4gICAgcHVibGljIGNhc2VzOiB7W2s6IHN0cmluZ106IE5vZGV9LFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SWN1KHRoaXMsIGNvbnRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUYWdQbGFjZWhvbGRlciBpbXBsZW1lbnRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdGFnOiBzdHJpbmcsXG4gICAgcHVibGljIGF0dHJzOiB7W2s6IHN0cmluZ106IHN0cmluZ30sXG4gICAgcHVibGljIHN0YXJ0TmFtZTogc3RyaW5nLFxuICAgIHB1YmxpYyBjbG9zZU5hbWU6IHN0cmluZyxcbiAgICBwdWJsaWMgY2hpbGRyZW46IE5vZGVbXSxcbiAgICBwdWJsaWMgaXNWb2lkOiBib29sZWFuLFxuICAgIHB1YmxpYyBzb3VyY2VTcGFuOiBQYXJzZVNvdXJjZVNwYW5cbiAgKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0VGFnUGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBsYWNlaG9sZGVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogc3RyaW5nLCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0UGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEljdVBsYWNlaG9sZGVyIGltcGxlbWVudHMgTm9kZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogSWN1LCBwdWJsaWMgbmFtZTogc3RyaW5nLCBwdWJsaWMgc291cmNlU3BhbjogUGFyc2VTb3VyY2VTcGFuKSB7fVxuXG4gIHZpc2l0KHZpc2l0b3I6IFZpc2l0b3IsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2aXNpdG9yLnZpc2l0SWN1UGxhY2Vob2xkZXIodGhpcywgY29udGV4dCk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBWaXNpdG9yIHtcbiAgdmlzaXRUZXh0KHRleHQ6IFRleHQsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogQ29udGFpbmVyLCBjb250ZXh0PzogYW55KTogYW55O1xuICB2aXNpdEljdShpY3U6IEljdSwgY29udGV4dD86IGFueSk6IGFueTtcbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnk7XG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IFBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55O1xuICB2aXNpdEljdVBsYWNlaG9sZGVyKHBoOiBJY3VQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueTtcbn1cblxuLy8gQ2xvbmUgdGhlIEFTVFxuZXhwb3J0IGNsYXNzIENsb25lVmlzaXRvciBpbXBsZW1lbnRzIFZpc2l0b3Ige1xuICB2aXNpdFRleHQodGV4dDogVGV4dCwgY29udGV4dD86IGFueSk6IFRleHQge1xuICAgIHJldHVybiBuZXcgVGV4dCh0ZXh0LnZhbHVlLCB0ZXh0LnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBDb250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiBDb250YWluZXIge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gY29udGFpbmVyLmNoaWxkcmVuLm1hcChuID0+IG4udmlzaXQodGhpcywgY29udGV4dCkpO1xuICAgIHJldHVybiBuZXcgQ29udGFpbmVyKGNoaWxkcmVuLCBjb250YWluZXIuc291cmNlU3Bhbik7XG4gIH1cblxuICB2aXNpdEljdShpY3U6IEljdSwgY29udGV4dD86IGFueSk6IEljdSB7XG4gICAgY29uc3QgY2FzZXM6IHtbazogc3RyaW5nXTogTm9kZX0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goa2V5ID0+IChjYXNlc1trZXldID0gaWN1LmNhc2VzW2tleV0udmlzaXQodGhpcywgY29udGV4dCkpKTtcbiAgICBjb25zdCBtc2cgPSBuZXcgSWN1KGljdS5leHByZXNzaW9uLCBpY3UudHlwZSwgY2FzZXMsIGljdS5zb3VyY2VTcGFuKTtcbiAgICBtc2cuZXhwcmVzc2lvblBsYWNlaG9sZGVyID0gaWN1LmV4cHJlc3Npb25QbGFjZWhvbGRlcjtcbiAgICByZXR1cm4gbXNnO1xuICB9XG5cbiAgdmlzaXRUYWdQbGFjZWhvbGRlcihwaDogVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBUYWdQbGFjZWhvbGRlciB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBwaC5jaGlsZHJlbi5tYXAobiA9PiBuLnZpc2l0KHRoaXMsIGNvbnRleHQpKTtcbiAgICByZXR1cm4gbmV3IFRhZ1BsYWNlaG9sZGVyKHBoLnRhZywgcGguYXR0cnMsIHBoLnN0YXJ0TmFtZSwgcGguY2xvc2VOYW1lLCBjaGlsZHJlbiwgcGguaXNWb2lkLCBwaC5zb3VyY2VTcGFuKTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IFBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogUGxhY2Vob2xkZXIge1xuICAgIHJldHVybiBuZXcgUGxhY2Vob2xkZXIocGgudmFsdWUsIHBoLm5hbWUsIHBoLnNvdXJjZVNwYW4pO1xuICB9XG5cbiAgdmlzaXRJY3VQbGFjZWhvbGRlcihwaDogSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiBJY3VQbGFjZWhvbGRlciB7XG4gICAgcmV0dXJuIG5ldyBJY3VQbGFjZWhvbGRlcihwaC52YWx1ZSwgcGgubmFtZSwgcGguc291cmNlU3Bhbik7XG4gIH1cbn1cblxuLy8gVmlzaXQgYWxsIHRoZSBub2RlcyByZWN1cnNpdmVseVxuZXhwb3J0IGNsYXNzIFJlY3Vyc2VWaXNpdG9yIGltcGxlbWVudHMgVmlzaXRvciB7XG4gIHZpc2l0VGV4dCh0ZXh0OiBUZXh0LCBjb250ZXh0PzogYW55KTogYW55IHt9XG5cbiAgdmlzaXRDb250YWluZXIoY29udGFpbmVyOiBDb250YWluZXIsIGNvbnRleHQ/OiBhbnkpOiBhbnkge1xuICAgIGNvbnRhaW5lci5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IGNoaWxkLnZpc2l0KHRoaXMpKTtcbiAgfVxuXG4gIHZpc2l0SWN1KGljdTogSWN1LCBjb250ZXh0PzogYW55KTogYW55IHtcbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goayA9PiB7XG4gICAgICBpY3UuY2FzZXNba10udmlzaXQodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICB2aXNpdFRhZ1BsYWNlaG9sZGVyKHBoOiBUYWdQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7XG4gICAgcGguY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiBjaGlsZC52aXNpdCh0aGlzKSk7XG4gIH1cblxuICB2aXNpdFBsYWNlaG9sZGVyKHBoOiBQbGFjZWhvbGRlciwgY29udGV4dD86IGFueSk6IGFueSB7fVxuXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IEljdVBsYWNlaG9sZGVyLCBjb250ZXh0PzogYW55KTogYW55IHt9XG59XG4iXX0=