"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
// source: https://github.com/biesbjerg/ngx-translate-extract/blob/master/src/parsers/abstract-ast.parser.ts
class AbstractAstParser {
    _createSourceFile(path, contents) {
        return ts.createSourceFile(path, contents, ts.ScriptTarget.ES5, /*setParentNodes */ false);
    }
    /**
     * Get strings from function call's first argument
     */
    _getCallArgStrings(callNode) {
        if (!callNode.arguments.length) {
            return [];
        }
        const firstArg = callNode.arguments[0];
        switch (firstArg.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.FirstTemplateToken:
                return [firstArg.text];
            case ts.SyntaxKind.ArrayLiteralExpression:
                return firstArg.elements.map((element) => element.text);
            case ts.SyntaxKind.ObjectLiteralExpression:
                const i18nDef = { value: "" };
                firstArg.properties.forEach((prop) => {
                    i18nDef[prop.name.text] = prop.initializer.text;
                });
                if (!i18nDef.value) {
                    throw new Error(`An I18nDef requires a value property on '${this.syntaxKindToName(firstArg.kind)}' for ${firstArg}`);
                }
                return [i18nDef];
            case ts.SyntaxKind.Identifier:
                console.log("WARNING: We cannot extract variable values passed to TranslateService (yet)");
                break;
            default:
                console.log(`SKIP: Unknown argument type: '${this.syntaxKindToName(firstArg.kind)}'`, firstArg);
        }
        return [];
    }
    /**
     * Find all child nodes of a kind
     */
    _findNodes(node, kind) {
        const childrenNodes = node.getChildren(this._sourceFile);
        const initialValue = node.kind === kind ? [node] : [];
        return childrenNodes.reduce((result, childNode) => {
            return result.concat(this._findNodes(childNode, kind));
        }, initialValue);
    }
    syntaxKindToName(kind) {
        return ts.SyntaxKind[kind];
    }
}
exports.AbstractAstParser = AbstractAstParser;
//# sourceMappingURL=abstract-ast-parser.js.map