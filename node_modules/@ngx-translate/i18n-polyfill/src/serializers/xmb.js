"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const xml = require("./xml_helper");
const digest_1 = require("./digest");
const serializer_1 = require("./serializer");
const _MESSAGES_TAG = "messagebundle";
const _MESSAGE_TAG = "msg";
const _PLACEHOLDER_TAG = "ph";
const _EXEMPLE_TAG = "ex";
const _SOURCE_TAG = "source";
const _DOCTYPE = `<!ELEMENT messagebundle (msg)*>
<!ATTLIST messagebundle class CDATA #IMPLIED>

<!ELEMENT msg (#PCDATA|ph|source)*>
<!ATTLIST msg id CDATA #IMPLIED>
<!ATTLIST msg seq CDATA #IMPLIED>
<!ATTLIST msg name CDATA #IMPLIED>
<!ATTLIST msg desc CDATA #IMPLIED>
<!ATTLIST msg meaning CDATA #IMPLIED>
<!ATTLIST msg obsolete (obsolete) #IMPLIED>
<!ATTLIST msg xml:space (default|preserve) "default">
<!ATTLIST msg is_hidden CDATA #IMPLIED>

<!ELEMENT source (#PCDATA)>

<!ELEMENT ph (#PCDATA|ex)*>
<!ATTLIST ph name CDATA #REQUIRED>

<!ELEMENT ex (#PCDATA)>`;
// used to merge translations when extracting
function xmbLoadToXml(content) {
    const parser = new serializer_1.HtmlToXmlParser(_MESSAGE_TAG);
    const { xmlMessagesById, errors } = parser.parse(content);
    if (errors.length) {
        throw new Error(`xmb parse errors:\n${errors.join("\n")}`);
    }
    return xmlMessagesById;
}
exports.xmbLoadToXml = xmbLoadToXml;
function xmbWrite(messages, locale, existingNodes = []) {
    const exampleVisitor = new ExampleVisitor();
    const visitor = new Visitor();
    const rootNode = new xml.Tag(_MESSAGES_TAG);
    existingNodes.forEach(node => {
        rootNode.children.push(new xml.CR(2), node);
    });
    // console.log(existingNodes);
    messages.forEach(message => {
        const attrs = { id: message.id };
        if (message.description) {
            attrs["desc"] = message.description;
        }
        if (message.meaning) {
            attrs["meaning"] = message.meaning;
        }
        const sourceTags = [];
        message.sources.forEach((source) => {
            sourceTags.push(new xml.Tag(_SOURCE_TAG, {}, [
                new xml.Text(`${source.filePath}:${source.startLine}${source.endLine !== source.startLine ? "," + source.endLine : ""}`)
            ]));
        });
        rootNode.children.push(new xml.CR(2), new xml.Tag(_MESSAGE_TAG, attrs, [...sourceTags, ...visitor.serialize(message.nodes)]));
    });
    rootNode.children.push(new xml.CR());
    return xml.serialize([
        new xml.Declaration({ version: "1.0", encoding: "UTF-8" }),
        new xml.CR(),
        new xml.Doctype(_MESSAGES_TAG, _DOCTYPE),
        new xml.CR(),
        exampleVisitor.addDefaultExamples(rootNode),
        new xml.CR()
    ]);
}
exports.xmbWrite = xmbWrite;
function xmbDigest(message) {
    return digest(message);
}
exports.xmbDigest = xmbDigest;
function xmbMapper(message) {
    return new serializer_1.SimplePlaceholderMapper(message, toPublicName);
}
exports.xmbMapper = xmbMapper;
class Visitor {
    visitText(text, context) {
        return [new xml.Text(text.value)];
    }
    visitContainer(container, context) {
        const nodes = [];
        container.children.forEach((node) => nodes.push(...node.visit(this)));
        return nodes;
    }
    visitIcu(icu, context) {
        const nodes = [new xml.Text(`{${icu.expressionPlaceholder}, ${icu.type}, `)];
        Object.keys(icu.cases).forEach((c) => {
            nodes.push(new xml.Text(`${c} {`), ...icu.cases[c].visit(this), new xml.Text(`} `));
        });
        nodes.push(new xml.Text(`}`));
        return nodes;
    }
    visitTagPlaceholder(ph, context) {
        const startEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text(`<${ph.tag}>`)]);
        const startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        const closeEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text(`</${ph.tag}>`)]);
        const closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.closeName }, [closeEx]);
        return [startTagPh, ...this.serialize(ph.children), closeTagPh];
    }
    visitPlaceholder(ph, context) {
        const exTag = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text(`{{${ph.value}}}`)]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    }
    visitIcuPlaceholder(ph, context) {
        const exTag = new xml.Tag(_EXEMPLE_TAG, {}, [
            new xml.Text(`{${ph.value.expression}, ${ph.value.type}, ${Object.keys(ph.value.cases)
                .map((value) => value + " {...}")
                .join(" ")}}`)
        ]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    }
    serialize(nodes) {
        return [].concat(...nodes.map(node => node.visit(this)));
    }
}
function digest(message) {
    return digest_1.decimalDigest(message);
}
exports.digest = digest;
// TC requires at least one non-empty example on placeholders
class ExampleVisitor {
    addDefaultExamples(node) {
        node.visit(this);
        return node;
    }
    visitTag(tag) {
        if (tag.name === _PLACEHOLDER_TAG) {
            if (!tag.children || tag.children.length === 0) {
                const exText = new xml.Text(tag.attrs["name"] || "...");
                tag.children = [new xml.Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(node => node.visit(this));
        }
    }
    visitElement(element) {
        const attrs = {};
        element.attrs.forEach((attr) => {
            attrs[attr.name] = attr.value;
        });
        const tag = new xml.Tag(element.name, attrs, element.children);
        return this.visitTag(tag);
    }
    visitText(text) { }
    visitDeclaration(decl) { }
    visitDoctype(doctype) { }
}
// XMB/XTB placeholders can only contain A-Z, 0-9 and _
function toPublicName(internalName) {
    return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}
exports.toPublicName = toPublicName;
//# sourceMappingURL=xmb.js.map