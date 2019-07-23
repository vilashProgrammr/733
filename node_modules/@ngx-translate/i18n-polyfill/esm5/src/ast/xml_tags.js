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
import { TagContentType } from "./tags";
var XmlTagDefinition = /** @class */ (function () {
    function XmlTagDefinition() {
        this.closedByParent = false;
        this.contentType = TagContentType.PARSABLE_DATA;
        this.isVoid = false;
        this.ignoreFirstLf = false;
        this.canSelfClose = true;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    XmlTagDefinition.prototype.requireExtraParent = /**
     * @param {?} currentParent
     * @return {?}
     */
    function (currentParent) {
        return false;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    XmlTagDefinition.prototype.isClosedByChild = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return false;
    };
    return XmlTagDefinition;
}());
export { XmlTagDefinition };
function XmlTagDefinition_tsickle_Closure_declarations() {
    /** @type {?} */
    XmlTagDefinition.prototype.closedByParent;
    /** @type {?} */
    XmlTagDefinition.prototype.requiredParents;
    /** @type {?} */
    XmlTagDefinition.prototype.parentToAdd;
    /** @type {?} */
    XmlTagDefinition.prototype.implicitNamespacePrefix;
    /** @type {?} */
    XmlTagDefinition.prototype.contentType;
    /** @type {?} */
    XmlTagDefinition.prototype.isVoid;
    /** @type {?} */
    XmlTagDefinition.prototype.ignoreFirstLf;
    /** @type {?} */
    XmlTagDefinition.prototype.canSelfClose;
}
var /** @type {?} */ _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX3RhZ3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL2FzdC94bWxfdGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxjQUFjLEVBQWdCLE1BQU0sUUFBUSxDQUFDO0FBRXJELElBQUE7OzhCQUNtQixLQUFLOzJCQUlRLGNBQWMsQ0FBQyxhQUFhO3NCQUNqRCxLQUFLOzZCQUNFLEtBQUs7NEJBQ04sSUFBSTs7Ozs7O0lBRW5CLDZDQUFrQjs7OztJQUFsQixVQUFtQixhQUFxQjtRQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2Q7Ozs7O0lBRUQsMENBQWU7Ozs7SUFBZixVQUFnQixJQUFZO1FBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDZDsyQkExQkg7SUEyQkMsQ0FBQTtBQWpCRCw0QkFpQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxxQkFBTSxlQUFlLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDOzs7OztBQUUvQyxNQUFNLDhCQUE4QixPQUFlO0lBQ2pELE1BQU0sQ0FBQyxlQUFlLENBQUM7Q0FDeEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7VGFnQ29udGVudFR5cGUsIFRhZ0RlZmluaXRpb259IGZyb20gXCIuL3RhZ3NcIjtcblxuZXhwb3J0IGNsYXNzIFhtbFRhZ0RlZmluaXRpb24gaW1wbGVtZW50cyBUYWdEZWZpbml0aW9uIHtcbiAgY2xvc2VkQnlQYXJlbnQgPSBmYWxzZTtcbiAgcmVxdWlyZWRQYXJlbnRzOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn07XG4gIHBhcmVudFRvQWRkOiBzdHJpbmc7XG4gIGltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiBzdHJpbmc7XG4gIGNvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZSA9IFRhZ0NvbnRlbnRUeXBlLlBBUlNBQkxFX0RBVEE7XG4gIGlzVm9pZCA9IGZhbHNlO1xuICBpZ25vcmVGaXJzdExmID0gZmFsc2U7XG4gIGNhblNlbGZDbG9zZSA9IHRydWU7XG5cbiAgcmVxdWlyZUV4dHJhUGFyZW50KGN1cnJlbnRQYXJlbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlzQ2xvc2VkQnlDaGlsZChuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuY29uc3QgX1RBR19ERUZJTklUSU9OID0gbmV3IFhtbFRhZ0RlZmluaXRpb24oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFhtbFRhZ0RlZmluaXRpb24odGFnTmFtZTogc3RyaW5nKTogWG1sVGFnRGVmaW5pdGlvbiB7XG4gIHJldHVybiBfVEFHX0RFRklOSVRJT047XG59XG4iXX0=