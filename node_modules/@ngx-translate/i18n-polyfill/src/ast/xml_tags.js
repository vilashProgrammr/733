"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tags_1 = require("./tags");
class XmlTagDefinition {
    constructor() {
        this.closedByParent = false;
        this.contentType = tags_1.TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    requireExtraParent(currentParent) {
        return false;
    }
    isClosedByChild(name) {
        return false;
    }
}
exports.XmlTagDefinition = XmlTagDefinition;
const _TAG_DEFINITION = new XmlTagDefinition();
function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}
exports.getXmlTagDefinition = getXmlTagDefinition;
//# sourceMappingURL=xml_tags.js.map