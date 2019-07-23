"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs_1 = require("fs");
const glob = require("glob");
const abstract_ast_parser_1 = require("./abstract-ast-parser");
const xliff2_1 = require("../../src/serializers/xliff2");
const xliff_1 = require("../../src/serializers/xliff");
const xtb_1 = require("../../src/serializers/xtb");
const xmb_1 = require("../../src/serializers/xmb");
const message_bundle_1 = require("./message-bundle");
function getAst(paths) {
    const files = [];
    paths.forEach(path => {
        files.push(...glob.sync(path));
    });
    const parser = new ServiceParser();
    const collection = {};
    files.forEach(path => {
        if (fs_1.statSync(path).isDirectory) {
            // this._options.verbose && this._out(chalk.gray('- %s'), path);
            const contents = fs_1.readFileSync(path, "utf-8");
            const entries = parser.extract(contents, path);
            if (entries.length) {
                collection[path] = entries;
            }
        }
    });
    // save file
    return collection;
}
exports.getAst = getAst;
// source: https://github.com/biesbjerg/ngx-translate-extract/blob/master/src/parsers/service.parser.ts
class ServiceParser extends abstract_ast_parser_1.AbstractAstParser {
    extract(contents, path) {
        const entries = [];
        this._sourceFile = this._createSourceFile(path, contents);
        const classNodes = this._findClassNodes(this._sourceFile);
        classNodes.forEach(classNode => {
            const constructorNode = this._findConstructorNode(classNode);
            if (!constructorNode) {
                return;
            }
            const propertyName = this._findTranslateServicePropertyName(constructorNode);
            if (!propertyName) {
                return;
            }
            const callNodes = this._findCallNodes(classNode, propertyName);
            callNodes.forEach(callNode => {
                entries.push(...this._getCallArgStrings(callNode));
            });
        });
        return entries;
    }
    /**
     * Detect what the TranslateService instance property
     * is called by inspecting constructor arguments
     */
    _findTranslateServicePropertyName(constructorNode) {
        if (!constructorNode) {
            return null;
        }
        const result = constructorNode.parameters.find(parameter => {
            // Skip if visibility modifier is not present (we want it set as an instance property)
            /*if (!parameter.modifiers) {
              return false;
            }*/
            // Parameter has no type
            if (!parameter.type) {
                return false;
            }
            // Make sure className is of the correct type
            const parameterType = parameter.type.typeName;
            if (!parameterType) {
                return false;
            }
            const className = parameterType.text;
            return className === "I18n";
        });
        if (result) {
            return result.name.text;
        }
    }
    /**
     * Find class nodes
     */
    _findClassNodes(node) {
        return this._findNodes(node, ts.SyntaxKind.ClassDeclaration);
    }
    /**
     * Find constructor
     */
    _findConstructorNode(node) {
        const constructorNodes = this._findNodes(node, ts.SyntaxKind.Constructor);
        if (constructorNodes) {
            return constructorNodes[0];
        }
    }
    /**
     * Find all calls to TranslateService methods
     */
    _findCallNodes(node, propertyIdentifier) {
        let callNodes = this._findNodes(node, ts.SyntaxKind.CallExpression);
        callNodes = callNodes.filter(callNode => {
            // Only call expressions with arguments
            if (callNode.arguments.length < 1) {
                return false;
            }
            const expression = callNode.expression;
            return expression.text === propertyIdentifier || (expression.name && expression.name.text === propertyIdentifier);
        });
        return callNodes;
    }
}
exports.ServiceParser = ServiceParser;
function getFileContent(messages, sourcePath, format, locale = "en") {
    let loadFct;
    let writeFct;
    let digest;
    let createMapper = (message) => null;
    format = (format || "xlf").toLowerCase();
    switch (format) {
        case "xmb":
            loadFct = xmb_1.xmbLoadToXml;
            writeFct = xmb_1.xmbWrite;
            digest = xtb_1.xtbDigest;
            createMapper = xtb_1.xtbMapper;
            break;
        case "xliff2":
        case "xlf2":
            loadFct = xliff2_1.xliff2LoadToXml;
            writeFct = xliff2_1.xliff2Write;
            digest = xliff2_1.xliff2Digest;
            break;
        case "xliff":
        case "xlf":
        default:
            loadFct = xliff_1.xliffLoadToXml;
            writeFct = xliff_1.xliffWrite;
            digest = xliff_1.xliffDigest;
            break;
    }
    let xmlMessagesById = {};
    if (fs_1.existsSync(sourcePath)) {
        xmlMessagesById = loadFct(fs_1.readFileSync(sourcePath, { encoding: "utf8" }), sourcePath);
    }
    const messageBundle = new message_bundle_1.MessageBundle(locale);
    Object.keys(messages).forEach(url => {
        messages[url].forEach(entry => messageBundle.updateFromTemplate(entry, url));
    });
    return messageBundle.write(writeFct, digest, xmlMessagesById, createMapper);
}
exports.getFileContent = getFileContent;
//# sourceMappingURL=extractor.js.map