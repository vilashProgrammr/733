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
export class XmlTagDefinition {
    constructor() {
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
    requireExtraParent(currentParent) {
        return false;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isClosedByChild(name) {
        return false;
    }
}
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
const /** @type {?} */ _TAG_DEFINITION = new XmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getXmlTagDefinition(tagName) {
    return _TAG_DEFINITION;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1sX3RhZ3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL2FzdC94bWxfdGFncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxjQUFjLEVBQWdCLE1BQU0sUUFBUSxDQUFDO0FBRXJELE1BQU07OzhCQUNhLEtBQUs7MkJBSVEsY0FBYyxDQUFDLGFBQWE7c0JBQ2pELEtBQUs7NkJBQ0UsS0FBSzs0QkFDTixJQUFJOzs7Ozs7SUFFbkIsa0JBQWtCLENBQUMsYUFBcUI7UUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNkOzs7OztJQUVELGVBQWUsQ0FBQyxJQUFZO1FBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUM7S0FDZDtDQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsdUJBQU0sZUFBZSxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQzs7Ozs7QUFFL0MsTUFBTSw4QkFBOEIsT0FBZTtJQUNqRCxNQUFNLENBQUMsZUFBZSxDQUFDO0NBQ3hCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1RhZ0NvbnRlbnRUeXBlLCBUYWdEZWZpbml0aW9ufSBmcm9tIFwiLi90YWdzXCI7XG5cbmV4cG9ydCBjbGFzcyBYbWxUYWdEZWZpbml0aW9uIGltcGxlbWVudHMgVGFnRGVmaW5pdGlvbiB7XG4gIGNsb3NlZEJ5UGFyZW50ID0gZmFsc2U7XG4gIHJlcXVpcmVkUGFyZW50czoge1trZXk6IHN0cmluZ106IGJvb2xlYW59O1xuICBwYXJlbnRUb0FkZDogc3RyaW5nO1xuICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeDogc3RyaW5nO1xuICBjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGUgPSBUYWdDb250ZW50VHlwZS5QQVJTQUJMRV9EQVRBO1xuICBpc1ZvaWQgPSBmYWxzZTtcbiAgaWdub3JlRmlyc3RMZiA9IGZhbHNlO1xuICBjYW5TZWxmQ2xvc2UgPSB0cnVlO1xuXG4gIHJlcXVpcmVFeHRyYVBhcmVudChjdXJyZW50UGFyZW50OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpc0Nsb3NlZEJ5Q2hpbGQobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmNvbnN0IF9UQUdfREVGSU5JVElPTiA9IG5ldyBYbWxUYWdEZWZpbml0aW9uKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRYbWxUYWdEZWZpbml0aW9uKHRhZ05hbWU6IHN0cmluZyk6IFhtbFRhZ0RlZmluaXRpb24ge1xuICByZXR1cm4gX1RBR19ERUZJTklUSU9OO1xufVxuIl19