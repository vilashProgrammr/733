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
import { TagContentType } from './tags';
export class HtmlTagDefinition {
    /**
     * @param {?=} __0
     */
    constructor({ closedByChildren, requiredParents, implicitNamespacePrefix, contentType = TagContentType.PARSABLE_DATA, closedByParent = false, isVoid = false, ignoreFirstLf = false } = {}) {
        this.closedByChildren = {};
        this.closedByParent = false;
        this.canSelfClose = false;
        if (closedByChildren && closedByChildren.length > 0) {
            closedByChildren.forEach(tagName => this.closedByChildren[tagName] = true);
        }
        this.isVoid = isVoid;
        this.closedByParent = closedByParent || isVoid;
        if (requiredParents && requiredParents.length > 0) {
            this.requiredParents = {};
            // The first parent is the list is automatically when none of the listed parents are present
            this.parentToAdd = requiredParents[0];
            requiredParents.forEach(tagName => this.requiredParents[tagName] = true);
        }
        this.implicitNamespacePrefix = implicitNamespacePrefix || null;
        this.contentType = contentType;
        this.ignoreFirstLf = ignoreFirstLf;
    }
    /**
     * @param {?} currentParent
     * @return {?}
     */
    requireExtraParent(currentParent) {
        if (!this.requiredParents) {
            return false;
        }
        if (!currentParent) {
            return true;
        }
        const /** @type {?} */ lcParent = currentParent.toLowerCase();
        const /** @type {?} */ isParentTemplate = lcParent === 'template' || currentParent === 'ng-template';
        return !isParentTemplate && this.requiredParents[lcParent] !== true;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isClosedByChild(name) {
        return this.isVoid || name.toLowerCase() in this.closedByChildren;
    }
}
function HtmlTagDefinition_tsickle_Closure_declarations() {
    /** @type {?} */
    HtmlTagDefinition.prototype.closedByChildren;
    /** @type {?} */
    HtmlTagDefinition.prototype.closedByParent;
    /** @type {?} */
    HtmlTagDefinition.prototype.requiredParents;
    /** @type {?} */
    HtmlTagDefinition.prototype.parentToAdd;
    /** @type {?} */
    HtmlTagDefinition.prototype.implicitNamespacePrefix;
    /** @type {?} */
    HtmlTagDefinition.prototype.contentType;
    /** @type {?} */
    HtmlTagDefinition.prototype.isVoid;
    /** @type {?} */
    HtmlTagDefinition.prototype.ignoreFirstLf;
    /** @type {?} */
    HtmlTagDefinition.prototype.canSelfClose;
}
// see http://www.w3.org/TR/html51/syntax.html#optional-tags
// This implementation does not fully conform to the HTML5 spec.
const /** @type {?} */ TAG_DEFINITIONS = {
    'base': new HtmlTagDefinition({ isVoid: true }),
    'meta': new HtmlTagDefinition({ isVoid: true }),
    'area': new HtmlTagDefinition({ isVoid: true }),
    'embed': new HtmlTagDefinition({ isVoid: true }),
    'link': new HtmlTagDefinition({ isVoid: true }),
    'img': new HtmlTagDefinition({ isVoid: true }),
    'input': new HtmlTagDefinition({ isVoid: true }),
    'param': new HtmlTagDefinition({ isVoid: true }),
    'hr': new HtmlTagDefinition({ isVoid: true }),
    'br': new HtmlTagDefinition({ isVoid: true }),
    'source': new HtmlTagDefinition({ isVoid: true }),
    'track': new HtmlTagDefinition({ isVoid: true }),
    'wbr': new HtmlTagDefinition({ isVoid: true }),
    'p': new HtmlTagDefinition({
        closedByChildren: [
            'address', 'article', 'aside', 'blockquote', 'div', 'dl', 'fieldset', 'footer', 'form',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr',
            'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'
        ],
        closedByParent: true
    }),
    'thead': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'] }),
    'tbody': new HtmlTagDefinition({ closedByChildren: ['tbody', 'tfoot'], closedByParent: true }),
    'tfoot': new HtmlTagDefinition({ closedByChildren: ['tbody'], closedByParent: true }),
    'tr': new HtmlTagDefinition({
        closedByChildren: ['tr'],
        requiredParents: ['tbody', 'tfoot', 'thead'],
        closedByParent: true
    }),
    'td': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
    'th': new HtmlTagDefinition({ closedByChildren: ['td', 'th'], closedByParent: true }),
    'col': new HtmlTagDefinition({ requiredParents: ['colgroup'], isVoid: true }),
    'svg': new HtmlTagDefinition({ implicitNamespacePrefix: 'svg' }),
    'math': new HtmlTagDefinition({ implicitNamespacePrefix: 'math' }),
    'li': new HtmlTagDefinition({ closedByChildren: ['li'], closedByParent: true }),
    'dt': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'] }),
    'dd': new HtmlTagDefinition({ closedByChildren: ['dt', 'dd'], closedByParent: true }),
    'rb': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'rt': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'rtc': new HtmlTagDefinition({ closedByChildren: ['rb', 'rtc', 'rp'], closedByParent: true }),
    'rp': new HtmlTagDefinition({ closedByChildren: ['rb', 'rt', 'rtc', 'rp'], closedByParent: true }),
    'optgroup': new HtmlTagDefinition({ closedByChildren: ['optgroup'], closedByParent: true }),
    'option': new HtmlTagDefinition({ closedByChildren: ['option', 'optgroup'], closedByParent: true }),
    'pre': new HtmlTagDefinition({ ignoreFirstLf: true }),
    'listing': new HtmlTagDefinition({ ignoreFirstLf: true }),
    'style': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
    'script': new HtmlTagDefinition({ contentType: TagContentType.RAW_TEXT }),
    'title': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT }),
    'textarea': new HtmlTagDefinition({ contentType: TagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
};
const /** @type {?} */ _DEFAULT_TAG_DEFINITION = new HtmlTagDefinition();
/**
 * @param {?} tagName
 * @return {?}
 */
export function getHtmlTagDefinition(tagName) {
    return TAG_DEFINITIONS[tagName.toLowerCase()] || _DEFAULT_TAG_DEFINITION;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbF90YWdzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5neC10cmFuc2xhdGUvaTE4bi1wb2x5ZmlsbC8iLCJzb3VyY2VzIjpbInNyYy9hc3QvaHRtbF90YWdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBVUEsT0FBTyxFQUFDLGNBQWMsRUFBZ0IsTUFBTSxRQUFRLENBQUM7QUFFckQsTUFBTTs7OztJQVlKLFlBQ0ksRUFBQyxnQkFBZ0IsRUFBRSxlQUFlLEVBQUUsdUJBQXVCLEVBQzFELFdBQVcsR0FBRyxjQUFjLENBQUMsYUFBYSxFQUFFLGNBQWMsR0FBRyxLQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFDbEYsYUFBYSxHQUFHLEtBQUssS0FRbEIsRUFBRTtnQ0F0QjJDLEVBQUU7OEJBRTdCLEtBQUs7NEJBT1AsS0FBSztRQWMzQixFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDNUU7UUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsSUFBSSxNQUFNLENBQUM7UUFDL0MsRUFBRSxDQUFDLENBQUMsZUFBZSxJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQzs7WUFFMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdEMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxD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QUFRLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNqRyxLQUFLLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNuRCxTQUFTLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUN2RCxPQUFPLEVBQUUsSUFBSSxpQkFBaUIsQ0FBQyxFQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsUUFBUSxFQUFDLENBQUM7SUFDdEUsUUFBUSxFQUFFLElBQUksaUJBQWlCLENBQUMsRUFBQyxXQUFXLEVBQUUsY0FBYyxDQUFDLFFBQVEsRUFBQyxDQUFDO0lBQ3ZFLE9BQU8sRUFBRSxJQUFJLGlCQUFpQixDQUFDLEVBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsRUFBQyxDQUFDO0lBQ2hGLFVBQVUsRUFDTixJQUFJLGlCQUFpQixDQUFDLEVBQUMsV0FBVyxFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFDLENBQUM7Q0FDakcsQ0FBQztBQUVGLHVCQUFNLHVCQUF1QixHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQzs7Ozs7QUFFeEQsTUFBTSwrQkFBK0IsT0FBZTtJQUNsRCxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLHVCQUF1QixDQUFDO0NBQzFFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZSAqL1xuXG5pbXBvcnQge1RhZ0NvbnRlbnRUeXBlLCBUYWdEZWZpbml0aW9ufSBmcm9tICcuL3RhZ3MnO1xuXG5leHBvcnQgY2xhc3MgSHRtbFRhZ0RlZmluaXRpb24gaW1wbGVtZW50cyBUYWdEZWZpbml0aW9uIHtcbiAgcHJpdmF0ZSBjbG9zZWRCeUNoaWxkcmVuOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICBjbG9zZWRCeVBhcmVudDogYm9vbGVhbiA9IGZhbHNlO1xuICByZXF1aXJlZFBhcmVudHM6IHtba2V5OiBzdHJpbmddOiBib29sZWFufTtcbiAgcGFyZW50VG9BZGQ6IHN0cmluZztcbiAgaW1wbGljaXROYW1lc3BhY2VQcmVmaXg6IHN0cmluZ3xudWxsO1xuICBjb250ZW50VHlwZTogVGFnQ29udGVudFR5cGU7XG4gIGlzVm9pZDogYm9vbGVhbjtcbiAgaWdub3JlRmlyc3RMZjogYm9vbGVhbjtcbiAgY2FuU2VsZkNsb3NlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICB7Y2xvc2VkQnlDaGlsZHJlbiwgcmVxdWlyZWRQYXJlbnRzLCBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeCxcbiAgICAgICBjb250ZW50VHlwZSA9IFRhZ0NvbnRlbnRUeXBlLlBBUlNBQkxFX0RBVEEsIGNsb3NlZEJ5UGFyZW50ID0gZmFsc2UsIGlzVm9pZCA9IGZhbHNlLFxuICAgICAgIGlnbm9yZUZpcnN0TGYgPSBmYWxzZX06IHtcbiAgICAgICAgY2xvc2VkQnlDaGlsZHJlbj86IHN0cmluZ1tdLFxuICAgICAgICBjbG9zZWRCeVBhcmVudD86IGJvb2xlYW4sXG4gICAgICAgIHJlcXVpcmVkUGFyZW50cz86IHN0cmluZ1tdLFxuICAgICAgICBpbXBsaWNpdE5hbWVzcGFjZVByZWZpeD86IHN0cmluZyxcbiAgICAgICAgY29udGVudFR5cGU/OiBUYWdDb250ZW50VHlwZSxcbiAgICAgICAgaXNWb2lkPzogYm9vbGVhbixcbiAgICAgICAgaWdub3JlRmlyc3RMZj86IGJvb2xlYW5cbiAgICAgIH0gPSB7fSkge1xuICAgIGlmIChjbG9zZWRCeUNoaWxkcmVuICYmIGNsb3NlZEJ5Q2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgY2xvc2VkQnlDaGlsZHJlbi5mb3JFYWNoKHRhZ05hbWUgPT4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuW3RhZ05hbWVdID0gdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuaXNWb2lkID0gaXNWb2lkO1xuICAgIHRoaXMuY2xvc2VkQnlQYXJlbnQgPSBjbG9zZWRCeVBhcmVudCB8fCBpc1ZvaWQ7XG4gICAgaWYgKHJlcXVpcmVkUGFyZW50cyAmJiByZXF1aXJlZFBhcmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZXF1aXJlZFBhcmVudHMgPSB7fTtcbiAgICAgIC8vIFRoZSBmaXJzdCBwYXJlbnQgaXMgdGhlIGxpc3QgaXMgYXV0b21hdGljYWxseSB3aGVuIG5vbmUgb2YgdGhlIGxpc3RlZCBwYXJlbnRzIGFyZSBwcmVzZW50XG4gICAgICB0aGlzLnBhcmVudFRvQWRkID0gcmVxdWlyZWRQYXJlbnRzWzBdO1xuICAgICAgcmVxdWlyZWRQYXJlbnRzLmZvckVhY2godGFnTmFtZSA9PiB0aGlzLnJlcXVpcmVkUGFyZW50c1t0YWdOYW1lXSA9IHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmltcGxpY2l0TmFtZXNwYWNlUHJlZml4ID0gaW1wbGljaXROYW1lc3BhY2VQcmVmaXggfHwgbnVsbDtcbiAgICB0aGlzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGU7XG4gICAgdGhpcy5pZ25vcmVGaXJzdExmID0gaWdub3JlRmlyc3RMZjtcbiAgfVxuXG4gIHJlcXVpcmVFeHRyYVBhcmVudChjdXJyZW50UGFyZW50OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMucmVxdWlyZWRQYXJlbnRzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCFjdXJyZW50UGFyZW50KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBsY1BhcmVudCA9IGN1cnJlbnRQYXJlbnQudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBpc1BhcmVudFRlbXBsYXRlID0gbGNQYXJlbnQgPT09ICd0ZW1wbGF0ZScgfHwgY3VycmVudFBhcmVudCA9PT0gJ25nLXRlbXBsYXRlJztcbiAgICByZXR1cm4gIWlzUGFyZW50VGVtcGxhdGUgJiYgdGhpcy5yZXF1aXJlZFBhcmVudHNbbGNQYXJlbnRdICE9PSB0cnVlO1xuICB9XG5cbiAgaXNDbG9zZWRCeUNoaWxkKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzVm9pZCB8fCBuYW1lLnRvTG93ZXJDYXNlKCkgaW4gdGhpcy5jbG9zZWRCeUNoaWxkcmVuO1xuICB9XG59XG5cbi8vIHNlZSBodHRwOi8vd3d3LnczLm9yZy9UUi9odG1sNTEvc3ludGF4Lmh0bWwjb3B0aW9uYWwtdGFnc1xuLy8gVGhpcyBpbXBsZW1lbnRhdGlvbiBkb2VzIG5vdCBmdWxseSBjb25mb3JtIHRvIHRoZSBIVE1MNSBzcGVjLlxuY29uc3QgVEFHX0RFRklOSVRJT05TOiB7W2tleTogc3RyaW5nXTogSHRtbFRhZ0RlZmluaXRpb259ID0ge1xuICAnYmFzZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICdtZXRhJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgJ2FyZWEnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnZW1iZWQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnbGluayc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICdpbWcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnaW5wdXQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAncGFyYW0nOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnaHInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnYnInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2lzVm9pZDogdHJ1ZX0pLFxuICAnc291cmNlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgJ3RyYWNrJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpc1ZvaWQ6IHRydWV9KSxcbiAgJ3dicic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aXNWb2lkOiB0cnVlfSksXG4gICdwJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtcbiAgICBjbG9zZWRCeUNoaWxkcmVuOiBbXG4gICAgICAnYWRkcmVzcycsICdhcnRpY2xlJywgJ2FzaWRlJywgJ2Jsb2NrcXVvdGUnLCAnZGl2JywgJ2RsJywgICAgICAnZmllbGRzZXQnLCAnZm9vdGVyJywgJ2Zvcm0nLFxuICAgICAgJ2gxJywgICAgICAnaDInLCAgICAgICdoMycsICAgICdoNCcsICAgICAgICAgJ2g1JywgICdoNicsICAgICAgJ2hlYWRlcicsICAgJ2hncm91cCcsICdocicsXG4gICAgICAnbWFpbicsICAgICduYXYnLCAgICAgJ29sJywgICAgJ3AnLCAgICAgICAgICAncHJlJywgJ3NlY3Rpb24nLCAndGFibGUnLCAgICAndWwnXG4gICAgXSxcbiAgICBjbG9zZWRCeVBhcmVudDogdHJ1ZVxuICB9KSxcbiAgJ3RoZWFkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3Rib2R5JywgJ3Rmb290J119KSxcbiAgJ3Rib2R5JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3Rib2R5JywgJ3Rmb290J10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICd0Zm9vdCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0Ym9keSddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAndHInOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe1xuICAgIGNsb3NlZEJ5Q2hpbGRyZW46IFsndHInXSxcbiAgICByZXF1aXJlZFBhcmVudHM6IFsndGJvZHknLCAndGZvb3QnLCAndGhlYWQnXSxcbiAgICBjbG9zZWRCeVBhcmVudDogdHJ1ZVxuICB9KSxcbiAgJ3RkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3RkJywgJ3RoJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICd0aCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWyd0ZCcsICd0aCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAnY29sJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtyZXF1aXJlZFBhcmVudHM6IFsnY29sZ3JvdXAnXSwgaXNWb2lkOiB0cnVlfSksXG4gICdzdmcnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2ltcGxpY2l0TmFtZXNwYWNlUHJlZml4OiAnc3ZnJ30pLFxuICAnbWF0aCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7aW1wbGljaXROYW1lc3BhY2VQcmVmaXg6ICdtYXRoJ30pLFxuICAnbGknOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsnbGknXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgJ2R0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2R0JywgJ2RkJ119KSxcbiAgJ2RkJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ2R0JywgJ2RkJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICdyYic6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydyYicsICdydCcsICdydGMnLCAncnAnXSwgY2xvc2VkQnlQYXJlbnQ6IHRydWV9KSxcbiAgJ3J0JzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0JywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAncnRjJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ3JiJywgJ3J0YycsICdycCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAncnAnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2Nsb3NlZEJ5Q2hpbGRyZW46IFsncmInLCAncnQnLCAncnRjJywgJ3JwJ10sIGNsb3NlZEJ5UGFyZW50OiB0cnVlfSksXG4gICdvcHRncm91cCc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y2xvc2VkQnlDaGlsZHJlbjogWydvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAnb3B0aW9uJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtjbG9zZWRCeUNoaWxkcmVuOiBbJ29wdGlvbicsICdvcHRncm91cCddLCBjbG9zZWRCeVBhcmVudDogdHJ1ZX0pLFxuICAncHJlJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICdsaXN0aW5nJzogbmV3IEh0bWxUYWdEZWZpbml0aW9uKHtpZ25vcmVGaXJzdExmOiB0cnVlfSksXG4gICdzdHlsZSc6IG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLlJBV19URVhUfSksXG4gICdzY3JpcHQnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZS5SQVdfVEVYVH0pLFxuICAndGl0bGUnOiBuZXcgSHRtbFRhZ0RlZmluaXRpb24oe2NvbnRlbnRUeXBlOiBUYWdDb250ZW50VHlwZS5FU0NBUEFCTEVfUkFXX1RFWFR9KSxcbiAgJ3RleHRhcmVhJzpcbiAgICAgIG5ldyBIdG1sVGFnRGVmaW5pdGlvbih7Y29udGVudFR5cGU6IFRhZ0NvbnRlbnRUeXBlLkVTQ0FQQUJMRV9SQVdfVEVYVCwgaWdub3JlRmlyc3RMZjogdHJ1ZX0pLFxufTtcblxuY29uc3QgX0RFRkFVTFRfVEFHX0RFRklOSVRJT04gPSBuZXcgSHRtbFRhZ0RlZmluaXRpb24oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0bWxUYWdEZWZpbml0aW9uKHRhZ05hbWU6IHN0cmluZyk6IEh0bWxUYWdEZWZpbml0aW9uIHtcbiAgcmV0dXJuIFRBR19ERUZJTklUSU9OU1t0YWdOYW1lLnRvTG93ZXJDYXNlKCldIHx8IF9ERUZBVUxUX1RBR19ERUZJTklUSU9OO1xufVxuIl19