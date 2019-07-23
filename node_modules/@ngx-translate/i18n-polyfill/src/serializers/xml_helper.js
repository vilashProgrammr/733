"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Visitor {
    visitTag(tag) {
        const strAttrs = this._serializeAttributes(tag.attrs);
        if (tag.children.length === 0) {
            return `<${tag.name}${strAttrs}/>`;
        }
        const strChildren = tag.children.map(node => node.visit(this));
        return `<${tag.name}${strAttrs}>${strChildren.join("")}</${tag.name}>`;
    }
    visitText(text) {
        return _escapeXml(text.value);
    }
    visitElement(element) {
        const attrs = {};
        element.attrs.forEach((attr) => {
            attrs[attr.name] = attr.value;
        });
        const tag = new Tag(element.name, attrs, element.children);
        return this.visitTag(tag);
    }
    visitDeclaration(decl) {
        return `<?xml${this._serializeAttributes(decl.attrs)} ?>`;
    }
    _serializeAttributes(attrs) {
        const strAttrs = Object.keys(attrs)
            .map((name) => `${name}="${_escapeXml(attrs[name])}"`)
            .join(" ");
        return strAttrs.length > 0 ? " " + strAttrs : "";
    }
    visitDoctype(doctype) {
        return `<!DOCTYPE ${doctype.rootTag} [\n${doctype.dtd}\n]>`;
    }
}
const _visitor = new Visitor();
function serialize(nodes) {
    return nodes.map((node) => node.visit(_visitor)).join("");
}
exports.serialize = serialize;
class Declaration {
    constructor(attrs) {
        this.attrs = attrs;
    }
    visit(visitor) {
        return visitor.visitDeclaration(this);
    }
}
exports.Declaration = Declaration;
class Doctype {
    constructor(rootTag, dtd) {
        this.rootTag = rootTag;
        this.dtd = dtd;
    }
    visit(visitor) {
        return visitor.visitDoctype(this);
    }
}
exports.Doctype = Doctype;
class Tag {
    constructor(name, attrs = {}, children = []) {
        this.name = name;
        this.attrs = attrs;
        this.children = children;
    }
    visit(visitor) {
        return visitor.visitTag(this);
    }
}
exports.Tag = Tag;
class Text {
    constructor(value) {
        this.value = value;
    }
    visit(visitor) {
        return visitor.visitText(this);
    }
}
exports.Text = Text;
class CR extends Text {
    constructor(ws = 0) {
        super(`\n${new Array(ws + 1).join(" ")}`);
    }
}
exports.CR = CR;
const _ESCAPED_CHARS = [
    [/&/g, "&amp;"],
    [/"/g, "&quot;"],
    [/'/g, "&apos;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"]
];
function _escapeXml(text) {
    return _ESCAPED_CHARS.reduce((str, entry) => str.replace(entry[0], entry[1]), text);
}
//# sourceMappingURL=xml_helper.js.map