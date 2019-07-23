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
import * as xml from "./xml_helper";
import { decimalDigest } from "./digest";
import { HtmlToXmlParser, SimplePlaceholderMapper } from "./serializer";
var /** @type {?} */ _MESSAGES_TAG = "messagebundle";
var /** @type {?} */ _MESSAGE_TAG = "msg";
var /** @type {?} */ _PLACEHOLDER_TAG = "ph";
var /** @type {?} */ _EXEMPLE_TAG = "ex";
var /** @type {?} */ _SOURCE_TAG = "source";
var /** @type {?} */ _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
/**
 * @param {?} content
 * @return {?}
 */
export function xmbLoadToXml(content) {
    var /** @type {?} */ parser = new HtmlToXmlParser(_MESSAGE_TAG);
    var _a = parser.parse(content), xmlMessagesById = _a.xmlMessagesById, errors = _a.errors;
    if (errors.length) {
        throw new Error("xmb parse errors:\n" + errors.join("\n"));
    }
    return xmlMessagesById;
}
/**
 * @param {?} messages
 * @param {?} locale
 * @param {?=} existingNodes
 * @return {?}
 */
export function xmbWrite(messages, locale, existingNodes) {
    if (existingNodes === void 0) { existingNodes = []; }
    var /** @type {?} */ exampleVisitor = new ExampleVisitor();
    var /** @type {?} */ visitor = new Visitor();
    var /** @type {?} */ rootNode = new xml.Tag(_MESSAGES_TAG);
    existingNodes.forEach(function (node) {
        rootNode.children.push(new xml.CR(2), node);
    });
    // console.log(existingNodes);
    messages.forEach(function (message) {
        var /** @type {?} */ attrs = { id: message.id };
        if (message.description) {
            attrs["desc"] = message.description;
        }
        if (message.meaning) {
            attrs["meaning"] = message.meaning;
        }
        var /** @type {?} */ sourceTags = [];
        message.sources.forEach(function (source) {
            sourceTags.push(new xml.Tag(_SOURCE_TAG, {}, [
                new xml.Text(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? "," + source.endLine : ""))
            ]));
        });
        rootNode.children.push(new xml.CR(2), new xml.Tag(_MESSAGE_TAG, attrs, tslib_1.__spread(sourceTags, visitor.serialize(message.nodes))));
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
/**
 * @param {?} message
 * @return {?}
 */
export function xmbDigest(message) {
    return digest(message);
}
/**
 * @param {?} message
 * @return {?}
 */
export function xmbMapper(message) {
    return new SimplePlaceholderMapper(message, toPublicName);
}
var Visitor = /** @class */ (function () {
    function Visitor() {
    }
    /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    Visitor.prototype.visitText = /**
     * @param {?} text
     * @param {?=} context
     * @return {?}
     */
    function (text, context) {
        return [new xml.Text(text.value)];
    };
    /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    Visitor.prototype.visitContainer = /**
     * @param {?} container
     * @param {?} context
     * @return {?}
     */
    function (container, context) {
        var _this = this;
        var /** @type {?} */ nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, tslib_1.__spread(node.visit(_this))); });
        return nodes;
    };
    /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    Visitor.prototype.visitIcu = /**
     * @param {?} icu
     * @param {?=} context
     * @return {?}
     */
    function (icu, context) {
        var _this = this;
        var /** @type {?} */ nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, tslib_1.__spread([new xml.Text(c + " {")], icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    Visitor.prototype.visitTagPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ startEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("<" + ph.tag + ">")]);
        var /** @type {?} */ startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        var /** @type {?} */ closeEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("</" + ph.tag + ">")]);
        var /** @type {?} */ closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.closeName }, [closeEx]);
        return tslib_1.__spread([startTagPh], this.serialize(ph.children), [closeTagPh]);
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    Visitor.prototype.visitPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ exTag = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("{{" + ph.value + "}}")]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    };
    /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    Visitor.prototype.visitIcuPlaceholder = /**
     * @param {?} ph
     * @param {?=} context
     * @return {?}
     */
    function (ph, context) {
        var /** @type {?} */ exTag = new xml.Tag(_EXEMPLE_TAG, {}, [
            new xml.Text("{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases)
                .map(function (value) { return value + " {...}"; })
                .join(" ") + "}")
        ]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    };
    /**
     * @param {?} nodes
     * @return {?}
     */
    Visitor.prototype.serialize = /**
     * @param {?} nodes
     * @return {?}
     */
    function (nodes) {
        var _this = this;
        return [].concat.apply([], tslib_1.__spread(nodes.map(function (node) { return node.visit(_this); })));
    };
    return Visitor;
}());
/**
 * @param {?} message
 * @return {?}
 */
export function digest(message) {
    return decimalDigest(message);
}
var ExampleVisitor = /** @class */ (function () {
    function ExampleVisitor() {
    }
    /**
     * @param {?} node
     * @return {?}
     */
    ExampleVisitor.prototype.addDefaultExamples = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        node.visit(this);
        return node;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    ExampleVisitor.prototype.visitTag = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) {
        var _this = this;
        if (tag.name === _PLACEHOLDER_TAG) {
            if (!tag.children || tag.children.length === 0) {
                var /** @type {?} */ exText = new xml.Text(tag.attrs["name"] || "...");
                tag.children = [new xml.Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(function (node) { return node.visit(_this); });
        }
    };
    /**
     * @param {?} element
     * @return {?}
     */
    ExampleVisitor.prototype.visitElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        var /** @type {?} */ attrs = {};
        element.attrs.forEach(function (attr) {
            attrs[attr.name] = attr.value;
        });
        var /** @type {?} */ tag = new xml.Tag(element.name, attrs, /** @type {?} */ (element.children));
        return this.visitTag(tag);
    };
    /**
     * @param {?} text
     * @return {?}
     */
    ExampleVisitor.prototype.visitText = /**
     * @param {?} text
     * @return {?}
     */
    function (text) { };
    /**
     * @param {?} decl
     * @return {?}
     */
    ExampleVisitor.prototype.visitDeclaration = /**
     * @param {?} decl
     * @return {?}
     */
    function (decl) { };
    /**
     * @param {?} doctype
     * @return {?}
     */
    ExampleVisitor.prototype.visitDoctype = /**
     * @param {?} doctype
     * @return {?}
     */
    function (doctype) { };
    return ExampleVisitor;
}());
/**
 * @param {?} internalName
 * @return {?}
 */
export function toPublicName(internalName) {
    return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9zZXJpYWxpemVycy94bWIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBVUEsT0FBTyxLQUFLLEdBQUcsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsZUFBZSxFQUFxQix1QkFBdUIsRUFBa0IsTUFBTSxjQUFjLENBQUM7QUFFMUcscUJBQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztBQUN0QyxxQkFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzNCLHFCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUM5QixxQkFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQzFCLHFCQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFFN0IscUJBQU0sUUFBUSxHQUFHLHVqQkFrQk8sQ0FBQzs7Ozs7QUFHekIsTUFBTSx1QkFBdUIsT0FBZTtJQUMxQyxxQkFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDakQsZ0NBQU8sb0NBQWUsRUFBRSxrQkFBTSxDQUEwQjtJQUV4RCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUFzQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7S0FDNUQ7SUFFRCxNQUFNLENBQUMsZUFBZSxDQUFDO0NBQ3hCOzs7Ozs7O0FBRUQsTUFBTSxtQkFBbUIsUUFBd0IsRUFBRSxNQUFxQixFQUFFLGFBQThCO0lBQTlCLDhCQUFBLEVBQUEsa0JBQThCO0lBQ3RHLHFCQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQzVDLHFCQUFNLE9BQU8sR0FBRyxJQUFJLE9B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LElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssb0JBQUUsT0FBTyxDQUFDLFFBQWUsRUFBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzNCOzs7OztJQUVELGtDQUFTOzs7O0lBQVQsVUFBVSxJQUFjLEtBQVU7Ozs7O0lBRWxDLHlDQUFnQjs7OztJQUFoQixVQUFpQixJQUFxQixLQUFVOzs7OztJQUVoRCxxQ0FBWTs7OztJQUFaLFVBQWEsT0FBb0IsS0FBVTt5QkEzTTdDO0lBNE1DLENBQUE7Ozs7O0FBR0QsTUFBTSx1QkFBdUIsWUFBb0I7SUFDL0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0NBQy9EIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBpMThuIGZyb20gXCIuLi9hc3QvaTE4bl9hc3RcIjtcbmltcG9ydCAqIGFzIG1sIGZyb20gXCIuLi9hc3QvYXN0XCI7XG5pbXBvcnQgKiBhcyB4bWwgZnJvbSBcIi4veG1sX2hlbHBlclwiO1xuaW1wb3J0IHtkZWNpbWFsRGlnZXN0fSBmcm9tIFwiLi9kaWdlc3RcIjtcbmltcG9ydCB7SHRtbFRvWG1sUGFyc2VyLCBQbGFjZWhvbGRlck1hcHBlciwgU2ltcGxlUGxhY2Vob2xkZXJNYXBwZXIsIFhtbE1lc3NhZ2VzQnlJZH0gZnJvbSBcIi4vc2VyaWFsaXplclwiO1xuXG5jb25zdCBfTUVTU0FHRVNfVEFHID0gXCJtZXNzYWdlYnVuZGxlXCI7XG5jb25zdCBfTUVTU0FHRV9UQUcgPSBcIm1zZ1wiO1xuY29uc3QgX1BMQUNFSE9MREVSX1RBRyA9IFwicGhcIjtcbmNvbnN0IF9FWEVNUExFX1RBRyA9IFwiZXhcIjtcbmNvbnN0IF9TT1VSQ0VfVEFHID0gXCJzb3VyY2VcIjtcblxuY29uc3QgX0RPQ1RZUEUgPSBgPCFFTEVNRU5UIG1lc3NhZ2VidW5kbGUgKG1zZykqPlxuPCFBVFRMSVNUIG1lc3NhZ2VidW5kbGUgY2xhc3MgQ0RBVEEgI0lNUExJRUQ+XG5cbjwhRUxFTUVOVCBtc2cgKCNQQ0RBVEF8cGh8c291cmNlKSo+XG48IUFUVExJU1QgbXNnIGlkIENEQVRBICNJTVBMSUVEPlxuPCFBVFRMSVNUIG1zZyBzZXEgQ0RBVEEgI0lNUExJRUQ+XG48IUFUVExJU1QgbXNnIG5hbWUgQ0RBVEEgI0lNUExJRUQ+XG48IUFUVExJU1QgbXNnIGRlc2MgQ0RBVEEgI0lNUExJRUQ+XG48IUFUVExJU1QgbXNnIG1lYW5pbmcgQ0RBVEEgI0lNUExJRUQ+XG48IUFUVExJU1QgbXNnIG9ic29sZXRlIChvYnNvbGV0ZSkgI0lNUExJRUQ+XG48IUFUVExJU1QgbXNnIHhtbDpzcGFjZSAoZGVmYXVsdHxwcmVzZXJ2ZSkgXCJkZWZhdWx0XCI+XG48IUFUVExJU1QgbXNnIGlzX2hpZGRlbiBDREFUQSAjSU1QTElFRD5cblxuPCFFTEVNRU5UIHNvdXJjZSAoI1BDREFUQSk+XG5cbjwhRUxFTUVOVCBwaCAoI1BDREFUQXxleCkqPlxuPCFBVFRMSVNUIHBoIG5hbWUgQ0RBVEEgI1JFUVVJUkVEPlxuXG48IUVMRU1FTlQgZXggKCNQQ0RBVEEpPmA7XG5cbi8vIHVzZWQgdG8gbWVyZ2UgdHJhbnNsYXRpb25zIHdoZW4gZXh0cmFjdGluZ1xuZXhwb3J0IGZ1bmN0aW9uIHhtYkxvYWRUb1htbChjb250ZW50OiBzdHJpbmcpOiBYbWxNZXNzYWdlc0J5SWQge1xuICBjb25zdCBwYXJzZXIgPSBuZXcgSHRtbFRvWG1sUGFyc2VyKF9NRVNTQUdFX1RBRyk7XG4gIGNvbnN0IHt4bWxNZXNzYWdlc0J5SWQsIGVycm9yc30gPSBwYXJzZXIucGFyc2UoY29udGVudCk7XG5cbiAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHhtYiBwYXJzZSBlcnJvcnM6XFxuJHtlcnJvcnMuam9pbihcIlxcblwiKX1gKTtcbiAgfVxuXG4gIHJldHVybiB4bWxNZXNzYWdlc0J5SWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB4bWJXcml0ZShtZXNzYWdlczogaTE4bi5NZXNzYWdlW10sIGxvY2FsZTogc3RyaW5nIHwgbnVsbCwgZXhpc3RpbmdOb2RlczogeG1sLk5vZGVbXSA9IFtdKTogc3RyaW5nIHtcbiAgY29uc3QgZXhhbXBsZVZpc2l0b3IgPSBuZXcgRXhhbXBsZVZpc2l0b3IoKTtcbiAgY29uc3QgdmlzaXRvciA9IG5ldyBWaXNpdG9yKCk7XG4gIGNvbnN0IHJvb3ROb2RlID0gbmV3IHhtbC5UYWcoX01FU1NBR0VTX1RBRyk7XG5cbiAgZXhpc3RpbmdOb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIHJvb3ROb2RlLmNoaWxkcmVuLnB1c2gobmV3IHhtbC5DUigyKSwgbm9kZSk7XG4gIH0pO1xuXG4gIC8vIGNvbnNvbGUubG9nKGV4aXN0aW5nTm9kZXMpO1xuICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IGF0dHJzOiB7W2s6IHN0cmluZ106IHN0cmluZ30gPSB7aWQ6IG1lc3NhZ2UuaWR9O1xuXG4gICAgaWYgKG1lc3NhZ2UuZGVzY3JpcHRpb24pIHtcbiAgICAgIGF0dHJzW1wiZGVzY1wiXSA9IG1lc3NhZ2UuZGVzY3JpcHRpb247XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UubWVhbmluZykge1xuICAgICAgYXR0cnNbXCJtZWFuaW5nXCJdID0gbWVzc2FnZS5tZWFuaW5nO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZVRhZ3M6IHhtbC5UYWdbXSA9IFtdO1xuICAgIG1lc3NhZ2Uuc291cmNlcy5mb3JFYWNoKChzb3VyY2U6IGkxOG4uTWVzc2FnZVNwYW4pID0+IHtcbiAgICAgIHNvdXJjZVRhZ3MucHVzaChcbiAgICAgICAgbmV3IHhtbC5UYWcoX1NPVVJDRV9UQUcsIHt9LCBbXG4gICAgICAgICAgbmV3IHhtbC5UZXh0KFxuICAgICAgICAgICAgYCR7c291cmNlLmZpbGVQYXRofToke3NvdXJjZS5zdGFydExpbmV9JHtzb3VyY2UuZW5kTGluZSAhPT0gc291cmNlLnN0YXJ0TGluZSA/IFwiLFwiICsgc291cmNlLmVuZExpbmUgOiBcIlwifWBcbiAgICAgICAgICApXG4gICAgICAgIF0pXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcm9vdE5vZGUuY2hpbGRyZW4ucHVzaChcbiAgICAgIG5ldyB4bWwuQ1IoMiksXG4gICAgICBuZXcgeG1sLlRhZyhfTUVTU0FHRV9UQUcsIGF0dHJzLCBbLi4uc291cmNlVGFncywgLi4udmlzaXRvci5zZXJpYWxpemUobWVzc2FnZS5ub2RlcyldKVxuICAgICk7XG4gIH0pO1xuXG4gIHJvb3ROb2RlLmNoaWxkcmVuLnB1c2gobmV3IHhtbC5DUigpKTtcblxuICByZXR1cm4geG1sLnNlcmlhbGl6ZShbXG4gICAgbmV3IHhtbC5EZWNsYXJhdGlvbih7dmVyc2lvbjogXCIxLjBcIiwgZW5jb2Rpbmc6IFwiVVRGLThcIn0pLFxuICAgIG5ldyB4bWwuQ1IoKSxcbiAgICBuZXcgeG1sLkRvY3R5cGUoX01FU1NBR0VTX1RBRywgX0RPQ1RZUEUpLFxuICAgIG5ldyB4bWwuQ1IoKSxcbiAgICBleGFtcGxlVmlzaXRvci5hZGREZWZhdWx0RXhhbXBsZXMocm9vdE5vZGUpLFxuICAgIG5ldyB4bWwuQ1IoKVxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHhtYkRpZ2VzdChtZXNzYWdlOiBpMThuLk1lc3NhZ2UpOiBzdHJpbmcge1xuICByZXR1cm4gZGlnZXN0KG1lc3NhZ2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24geG1iTWFwcGVyKG1lc3NhZ2U6IGkxOG4uTWVzc2FnZSk6IFBsYWNlaG9sZGVyTWFwcGVyIHtcbiAgcmV0dXJuIG5ldyBTaW1wbGVQbGFjZWhvbGRlck1hcHBlcihtZXNzYWdlLCB0b1B1YmxpY05hbWUpO1xufVxuXG5jbGFzcyBWaXNpdG9yIGltcGxlbWVudHMgaTE4bi5WaXNpdG9yIHtcbiAgdmlzaXRUZXh0KHRleHQ6IGkxOG4uVGV4dCwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIHJldHVybiBbbmV3IHhtbC5UZXh0KHRleHQudmFsdWUpXTtcbiAgfVxuXG4gIHZpc2l0Q29udGFpbmVyKGNvbnRhaW5lcjogaTE4bi5Db250YWluZXIsIGNvbnRleHQ6IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IG5vZGVzOiB4bWwuTm9kZVtdID0gW107XG4gICAgY29udGFpbmVyLmNoaWxkcmVuLmZvckVhY2goKG5vZGU6IGkxOG4uTm9kZSkgPT4gbm9kZXMucHVzaCguLi5ub2RlLnZpc2l0KHRoaXMpKSk7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgdmlzaXRJY3UoaWN1OiBpMThuLkljdSwgY29udGV4dD86IGFueSk6IHhtbC5Ob2RlW10ge1xuICAgIGNvbnN0IG5vZGVzID0gW25ldyB4bWwuVGV4dChgeyR7aWN1LmV4cHJlc3Npb25QbGFjZWhvbGRlcn0sICR7aWN1LnR5cGV9LCBgKV07XG5cbiAgICBPYmplY3Qua2V5cyhpY3UuY2FzZXMpLmZvckVhY2goKGM6IHN0cmluZykgPT4ge1xuICAgICAgbm9kZXMucHVzaChuZXcgeG1sLlRleHQoYCR7Y30ge2ApLCAuLi5pY3UuY2FzZXNbY10udmlzaXQodGhpcyksIG5ldyB4bWwuVGV4dChgfSBgKSk7XG4gICAgfSk7XG5cbiAgICBub2Rlcy5wdXNoKG5ldyB4bWwuVGV4dChgfWApKTtcblxuICAgIHJldHVybiBub2RlcztcbiAgfVxuXG4gIHZpc2l0VGFnUGxhY2Vob2xkZXIocGg6IGkxOG4uVGFnUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBzdGFydEV4ID0gbmV3IHhtbC5UYWcoX0VYRU1QTEVfVEFHLCB7fSwgW25ldyB4bWwuVGV4dChgPCR7cGgudGFnfT5gKV0pO1xuICAgIGNvbnN0IHN0YXJ0VGFnUGggPSBuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7bmFtZTogcGguc3RhcnROYW1lfSwgW3N0YXJ0RXhdKTtcbiAgICBpZiAocGguaXNWb2lkKSB7XG4gICAgICAvLyB2b2lkIHRhZ3MgaGF2ZSBubyBjaGlsZHJlbiBub3IgY2xvc2luZyB0YWdzXG4gICAgICByZXR1cm4gW3N0YXJ0VGFnUGhdO1xuICAgIH1cblxuICAgIGNvbnN0IGNsb3NlRXggPSBuZXcgeG1sLlRhZyhfRVhFTVBMRV9UQUcsIHt9LCBbbmV3IHhtbC5UZXh0KGA8LyR7cGgudGFnfT5gKV0pO1xuICAgIGNvbnN0IGNsb3NlVGFnUGggPSBuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7bmFtZTogcGguY2xvc2VOYW1lfSwgW2Nsb3NlRXhdKTtcblxuICAgIHJldHVybiBbc3RhcnRUYWdQaCwgLi4udGhpcy5zZXJpYWxpemUocGguY2hpbGRyZW4pLCBjbG9zZVRhZ1BoXTtcbiAgfVxuXG4gIHZpc2l0UGxhY2Vob2xkZXIocGg6IGkxOG4uUGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBleFRhZyA9IG5ldyB4bWwuVGFnKF9FWEVNUExFX1RBRywge30sIFtuZXcgeG1sLlRleHQoYHt7JHtwaC52YWx1ZX19fWApXSk7XG4gICAgcmV0dXJuIFtuZXcgeG1sLlRhZyhfUExBQ0VIT0xERVJfVEFHLCB7bmFtZTogcGgubmFtZX0sIFtleFRhZ10pXTtcbiAgfVxuXG4gIHZpc2l0SWN1UGxhY2Vob2xkZXIocGg6IGkxOG4uSWN1UGxhY2Vob2xkZXIsIGNvbnRleHQ/OiBhbnkpOiB4bWwuTm9kZVtdIHtcbiAgICBjb25zdCBleFRhZyA9IG5ldyB4bWwuVGFnKF9FWEVNUExFX1RBRywge30sIFtcbiAgICAgIG5ldyB4bWwuVGV4dChcbiAgICAgICAgYHske3BoLnZhbHVlLmV4cHJlc3Npb259LCAke3BoLnZhbHVlLnR5cGV9LCAke09iamVjdC5rZXlzKHBoLnZhbHVlLmNhc2VzKVxuICAgICAgICAgIC5tYXAoKHZhbHVlOiBzdHJpbmcpID0+IHZhbHVlICsgXCIgey4uLn1cIilcbiAgICAgICAgICAuam9pbihcIiBcIil9fWBcbiAgICAgIClcbiAgICBdKTtcbiAgICByZXR1cm4gW25ldyB4bWwuVGFnKF9QTEFDRUhPTERFUl9UQUcsIHtuYW1lOiBwaC5uYW1lfSwgW2V4VGFnXSldO1xuICB9XG5cbiAgc2VyaWFsaXplKG5vZGVzOiBpMThuLk5vZGVbXSk6IHhtbC5Ob2RlW10ge1xuICAgIHJldHVybiBbXS5jb25jYXQoLi4ubm9kZXMubWFwKG5vZGUgPT4gbm9kZS52aXNpdCh0aGlzKSkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWdlc3QobWVzc2FnZTogaTE4bi5NZXNzYWdlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGRlY2ltYWxEaWdlc3QobWVzc2FnZSk7XG59XG5cbi8vIFRDIHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBub24tZW1wdHkgZXhhbXBsZSBvbiBwbGFjZWhvbGRlcnNcbmNsYXNzIEV4YW1wbGVWaXNpdG9yIGltcGxlbWVudHMgeG1sLklWaXNpdG9yIHtcbiAgYWRkRGVmYXVsdEV4YW1wbGVzKG5vZGU6IHhtbC5Ob2RlKTogeG1sLk5vZGUge1xuICAgIG5vZGUudmlzaXQodGhpcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICB2aXNpdFRhZyh0YWc6IHhtbC5UYWcpOiB2b2lkIHtcbiAgICBpZiAodGFnLm5hbWUgPT09IF9QTEFDRUhPTERFUl9UQUcpIHtcbiAgICAgIGlmICghdGFnLmNoaWxkcmVuIHx8IHRhZy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc3QgZXhUZXh0ID0gbmV3IHhtbC5UZXh0KHRhZy5hdHRyc1tcIm5hbWVcIl0gfHwgXCIuLi5cIik7XG4gICAgICAgIHRhZy5jaGlsZHJlbiA9IFtuZXcgeG1sLlRhZyhfRVhFTVBMRV9UQUcsIHt9LCBbZXhUZXh0XSldO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFnLmNoaWxkcmVuKSB7XG4gICAgICB0YWcuY2hpbGRyZW4uZm9yRWFjaChub2RlID0+IG5vZGUudmlzaXQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0RWxlbWVudChlbGVtZW50OiBtbC5FbGVtZW50KTogYW55IHtcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGVsZW1lbnQuYXR0cnMuZm9yRWFjaCgoYXR0cjogbWwuQXR0cmlidXRlKSA9PiB7XG4gICAgICBhdHRyc1thdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcbiAgICB9KTtcbiAgICBjb25zdCB0YWcgPSBuZXcgeG1sLlRhZyhlbGVtZW50Lm5hbWUsIGF0dHJzLCBlbGVtZW50LmNoaWxkcmVuIGFzIGFueSk7XG4gICAgcmV0dXJuIHRoaXMudmlzaXRUYWcodGFnKTtcbiAgfVxuXG4gIHZpc2l0VGV4dCh0ZXh0OiB4bWwuVGV4dCk6IHZvaWQge31cblxuICB2aXNpdERlY2xhcmF0aW9uKGRlY2w6IHhtbC5EZWNsYXJhdGlvbik6IHZvaWQge31cblxuICB2aXNpdERvY3R5cGUoZG9jdHlwZTogeG1sLkRvY3R5cGUpOiB2b2lkIHt9XG59XG5cbi8vIFhNQi9YVEIgcGxhY2Vob2xkZXJzIGNhbiBvbmx5IGNvbnRhaW4gQS1aLCAwLTkgYW5kIF9cbmV4cG9ydCBmdW5jdGlvbiB0b1B1YmxpY05hbWUoaW50ZXJuYWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gaW50ZXJuYWxOYW1lLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvW15BLVowLTlfXS9nLCBcIl9cIik7XG59XG4iXX0=