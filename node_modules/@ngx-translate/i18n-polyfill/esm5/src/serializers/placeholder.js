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
var /** @type {?} */ TAG_TO_PLACEHOLDER_NAMES = {
    'A': 'LINK',
    'B': 'BOLD_TEXT',
    'BR': 'LINE_BREAK',
    'EM': 'EMPHASISED_TEXT',
    'H1': 'HEADING_LEVEL1',
    'H2': 'HEADING_LEVEL2',
    'H3': 'HEADING_LEVEL3',
    'H4': 'HEADING_LEVEL4',
    'H5': 'HEADING_LEVEL5',
    'H6': 'HEADING_LEVEL6',
    'HR': 'HORIZONTAL_RULE',
    'I': 'ITALIC_TEXT',
    'LI': 'LIST_ITEM',
    'LINK': 'MEDIA_LINK',
    'OL': 'ORDERED_LIST',
    'P': 'PARAGRAPH',
    'Q': 'QUOTATION',
    'S': 'STRIKETHROUGH_TEXT',
    'SMALL': 'SMALL_TEXT',
    'SUB': 'SUBSTRIPT',
    'SUP': 'SUPERSCRIPT',
    'TBODY': 'TABLE_BODY',
    'TD': 'TABLE_CELL',
    'TFOOT': 'TABLE_FOOTER',
    'TH': 'TABLE_HEADER_CELL',
    'THEAD': 'TABLE_HEADER',
    'TR': 'TABLE_ROW',
    'TT': 'MONOSPACED_TEXT',
    'U': 'UNDERLINED_TEXT',
    'UL': 'UNORDERED_LIST',
};
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 *
 * \@internal
 */
var /**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 *
 * \@internal
 */
PlaceholderRegistry = /** @class */ (function () {
    function PlaceholderRegistry() {
        this._placeHolderNameCounts = {};
        this._signatureToName = {};
    }
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype.getStartTagPlaceholderName = /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    function (tag, attrs, isVoid) {
        var /** @type {?} */ signature = this._hashTag(tag, attrs, isVoid);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName(isVoid ? baseName : "START_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype.getCloseTagPlaceholderName = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) {
        var /** @type {?} */ signature = this._hashClosingTag(tag);
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ upperTag = tag.toUpperCase();
        var /** @type {?} */ baseName = TAG_TO_PLACEHOLDER_NAMES[upperTag] || "TAG_" + upperTag;
        var /** @type {?} */ name = this._generateUniqueName("CLOSE_" + baseName);
        this._signatureToName[signature] = name;
        return name;
    };
    /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    PlaceholderRegistry.prototype.getPlaceholderName = /**
     * @param {?} name
     * @param {?} content
     * @return {?}
     */
    function (name, content) {
        var /** @type {?} */ upperName = name.toUpperCase();
        var /** @type {?} */ signature = "PH: " + upperName + "=" + content;
        if (this._signatureToName[signature]) {
            return this._signatureToName[signature];
        }
        var /** @type {?} */ uniqueName = this._generateUniqueName(upperName);
        this._signatureToName[signature] = uniqueName;
        return uniqueName;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    PlaceholderRegistry.prototype.getUniquePlaceholder = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this._generateUniqueName(name.toUpperCase());
    };
    /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashTag = /**
     * @param {?} tag
     * @param {?} attrs
     * @param {?} isVoid
     * @return {?}
     */
    function (tag, attrs, isVoid) {
        var /** @type {?} */ start = "<" + tag;
        var /** @type {?} */ strAttrs = Object.keys(attrs).sort().map(function (name) { return " " + name + "=" + attrs[name]; }).join('');
        var /** @type {?} */ end = isVoid ? '/>' : "></" + tag + ">";
        return start + strAttrs + end;
    };
    /**
     * @param {?} tag
     * @return {?}
     */
    PlaceholderRegistry.prototype._hashClosingTag = /**
     * @param {?} tag
     * @return {?}
     */
    function (tag) { return this._hashTag("/" + tag, {}, false); };
    /**
     * @param {?} base
     * @return {?}
     */
    PlaceholderRegistry.prototype._generateUniqueName = /**
     * @param {?} base
     * @return {?}
     */
    function (base) {
        var /** @type {?} */ seen = this._placeHolderNameCounts.hasOwnProperty(base);
        if (!seen) {
            this._placeHolderNameCounts[base] = 1;
            return base;
        }
        var /** @type {?} */ id = this._placeHolderNameCounts[base];
        this._placeHolderNameCounts[base] = id + 1;
        return base + "_" + id;
    };
    return PlaceholderRegistry;
}());
/**
 * Creates unique names for placeholder with different content.
 *
 * Returns the same placeholder name when the content is identical.
 *
 * \@internal
 */
export { PlaceholderRegistry };
function PlaceholderRegistry_tsickle_Closure_declarations() {
    /** @type {?} */
    PlaceholderRegistry.prototype._placeHolderNameCounts;
    /** @type {?} */
    PlaceholderRegistry.prototype._signatureToName;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9pMThuLXBvbHlmaWxsLyIsInNvdXJjZXMiOlsic3JjL3NlcmlhbGl6ZXJzL3BsYWNlaG9sZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEscUJBQU0sd0JBQXdCLEdBQTBCO0lBQ3RELEdBQUcsRUFBRSxNQUFNO0lBQ1gsR0FBRyxFQUFFLFdBQVc7SUFDaEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLGlCQUFpQjtJQUN2QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLEdBQUcsRUFBRSxhQUFhO0lBQ2xCLElBQUksRUFBRSxXQUFXO0lBQ2pCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLElBQUksRUFBRSxjQUFjO0lBQ3BCLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLEdBQUcsRUFBRSxvQkFBb0I7SUFDekIsT0FBTyxFQUFFLFlBQVk7SUFDckIsS0FBSyxFQUFFLFdBQVc7SUFDbEIsS0FBSyxFQUFFLGFBQWE7SUFDcEIsT0FBTyxFQUFFLFlBQVk7SUFDckIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsT0FBTyxFQUFFLGNBQWM7SUFDdkIsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixPQUFPLEVBQUUsY0FBYztJQUN2QixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLEdBQUcsRUFBRSxpQkFBaUI7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtDQUN2QixDQUFDOzs7Ozs7OztBQVNGOzs7Ozs7O0FBQUE7O3NDQUUwRCxFQUFFO2dDQUVSLEVB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LENBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0YscUJBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFNLEdBQUcsTUFBRyxDQUFDO1FBRXpDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxHQUFHLEdBQUcsQ0FBQzs7Ozs7O0lBR3hCLDZDQUFlOzs7O2NBQUMsR0FBVyxJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQUksR0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7Ozs7SUFFbEYsaURBQW1COzs7O2NBQUMsSUFBWTtRQUN0QyxxQkFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDVixJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUM7U0FDYjtRQUVELHFCQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFJLElBQUksU0FBSSxFQUFJLENBQUM7OzhCQXpIM0I7SUEySEMsQ0FBQTs7Ozs7Ozs7QUEzRUQsK0JBMkVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBUQUdfVE9fUExBQ0VIT0xERVJfTkFNRVM6IHtbazogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgJ0EnOiAnTElOSycsXG4gICdCJzogJ0JPTERfVEVYVCcsXG4gICdCUic6ICdMSU5FX0JSRUFLJyxcbiAgJ0VNJzogJ0VNUEhBU0lTRURfVEVYVCcsXG4gICdIMSc6ICdIRUFESU5HX0xFVkVMMScsXG4gICdIMic6ICdIRUFESU5HX0xFVkVMMicsXG4gICdIMyc6ICdIRUFESU5HX0xFVkVMMycsXG4gICdINCc6ICdIRUFESU5HX0xFVkVMNCcsXG4gICdINSc6ICdIRUFESU5HX0xFVkVMNScsXG4gICdINic6ICdIRUFESU5HX0xFVkVMNicsXG4gICdIUic6ICdIT1JJWk9OVEFMX1JVTEUnLFxuICAnSSc6ICdJVEFMSUNfVEVYVCcsXG4gICdMSSc6ICdMSVNUX0lURU0nLFxuICAnTElOSyc6ICdNRURJQV9MSU5LJyxcbiAgJ09MJzogJ09SREVSRURfTElTVCcsXG4gICdQJzogJ1BBUkFHUkFQSCcsXG4gICdRJzogJ1FVT1RBVElPTicsXG4gICdTJzogJ1NUUklLRVRIUk9VR0hfVEVYVCcsXG4gICdTTUFMTCc6ICdTTUFMTF9URVhUJyxcbiAgJ1NVQic6ICdTVUJTVFJJUFQnLFxuICAnU1VQJzogJ1NVUEVSU0NSSVBUJyxcbiAgJ1RCT0RZJzogJ1RBQkxFX0JPRFknLFxuICAnVEQnOiAnVEFCTEVfQ0VMTCcsXG4gICdURk9PVCc6ICdUQUJMRV9GT09URVInLFxuICAnVEgnOiAnVEFCTEVfSEVBREVSX0NFTEwnLFxuICAnVEhFQUQnOiAnVEFCTEVfSEVBREVSJyxcbiAgJ1RSJzogJ1RBQkxFX1JPVycsXG4gICdUVCc6ICdNT05PU1BBQ0VEX1RFWFQnLFxuICAnVSc6ICdVTkRFUkxJTkVEX1RFWFQnLFxuICAnVUwnOiAnVU5PUkRFUkVEX0xJU1QnLFxufTtcblxuLyoqXG4gKiBDcmVhdGVzIHVuaXF1ZSBuYW1lcyBmb3IgcGxhY2Vob2xkZXIgd2l0aCBkaWZmZXJlbnQgY29udGVudC5cbiAqXG4gKiBSZXR1cm5zIHRoZSBzYW1lIHBsYWNlaG9sZGVyIG5hbWUgd2hlbiB0aGUgY29udGVudCBpcyBpZGVudGljYWwuXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBQbGFjZWhvbGRlclJlZ2lzdHJ5IHtcbiAgLy8gQ291bnQgdGhlIG9jY3VycmVuY2Ugb2YgdGhlIGJhc2UgbmFtZSB0b3AgZ2VuZXJhdGUgYSB1bmlxdWUgbmFtZVxuICBwcml2YXRlIF9wbGFjZUhvbGRlck5hbWVDb3VudHM6IHtbazogc3RyaW5nXTogbnVtYmVyfSA9IHt9O1xuICAvLyBNYXBzIHNpZ25hdHVyZSB0byBwbGFjZWhvbGRlciBuYW1lc1xuICBwcml2YXRlIF9zaWduYXR1cmVUb05hbWU6IHtbazogc3RyaW5nXTogc3RyaW5nfSA9IHt9O1xuXG4gIGdldFN0YXJ0VGFnUGxhY2Vob2xkZXJOYW1lKHRhZzogc3RyaW5nLCBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9LCBpc1ZvaWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHRoaXMuX2hhc2hUYWcodGFnLCBhdHRycywgaXNWb2lkKTtcbiAgICBpZiAodGhpcy5fc2lnbmF0dXJlVG9OYW1lW3NpZ25hdHVyZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXTtcbiAgICB9XG5cbiAgICBjb25zdCB1cHBlclRhZyA9IHRhZy50b1VwcGVyQ2FzZSgpO1xuICAgIGNvbnN0IGJhc2VOYW1lID0gVEFHX1RPX1BMQUNFSE9MREVSX05BTUVTW3VwcGVyVGFnXSB8fCBgVEFHXyR7dXBwZXJUYWd9YDtcbiAgICBjb25zdCBuYW1lID0gdGhpcy5fZ2VuZXJhdGVVbmlxdWVOYW1lKGlzVm9pZCA/IGJhc2VOYW1lIDogYFNUQVJUXyR7YmFzZU5hbWV9YCk7XG5cbiAgICB0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXSA9IG5hbWU7XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGdldENsb3NlVGFnUGxhY2Vob2xkZXJOYW1lKHRhZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzaWduYXR1cmUgPSB0aGlzLl9oYXNoQ2xvc2luZ1RhZyh0YWcpO1xuICAgIGlmICh0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25hdHVyZVRvTmFtZVtzaWduYXR1cmVdO1xuICAgIH1cblxuICAgIGNvbnN0IHVwcGVyVGFnID0gdGFnLnRvVXBwZXJDYXNlKCk7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBUQUdfVE9fUExBQ0VIT0xERVJfTkFNRVNbdXBwZXJUYWddIHx8IGBUQUdfJHt1cHBlclRhZ31gO1xuICAgIGNvbnN0IG5hbWUgPSB0aGlzLl9nZW5lcmF0ZVVuaXF1ZU5hbWUoYENMT1NFXyR7YmFzZU5hbWV9YCk7XG5cbiAgICB0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXSA9IG5hbWU7XG5cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG4gIGdldFBsYWNlaG9sZGVyTmFtZShuYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgdXBwZXJOYW1lID0gbmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IGBQSDogJHt1cHBlck5hbWV9PSR7Y29udGVudH1gO1xuICAgIGlmICh0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXSkge1xuICAgICAgcmV0dXJuIHRoaXMuX3NpZ25hdHVyZVRvTmFtZVtzaWduYXR1cmVdO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaXF1ZU5hbWUgPSB0aGlzLl9nZW5lcmF0ZVVuaXF1ZU5hbWUodXBwZXJOYW1lKTtcbiAgICB0aGlzLl9zaWduYXR1cmVUb05hbWVbc2lnbmF0dXJlXSA9IHVuaXF1ZU5hbWU7XG5cbiAgICByZXR1cm4gdW5pcXVlTmFtZTtcbiAgfVxuXG4gIGdldFVuaXF1ZVBsYWNlaG9sZGVyKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2dlbmVyYXRlVW5pcXVlTmFtZShuYW1lLnRvVXBwZXJDYXNlKCkpO1xuICB9XG5cbiAgLy8gR2VuZXJhdGUgYSBoYXNoIGZvciBhIHRhZyAtIGRvZXMgbm90IHRha2UgYXR0cmlidXRlIG9yZGVyIGludG8gYWNjb3VudFxuICBwcml2YXRlIF9oYXNoVGFnKHRhZzogc3RyaW5nLCBhdHRyczoge1trOiBzdHJpbmddOiBzdHJpbmd9LCBpc1ZvaWQ6IGJvb2xlYW4pOiBzdHJpbmcge1xuICAgIGNvbnN0IHN0YXJ0ID0gYDwke3RhZ31gO1xuICAgIGNvbnN0IHN0ckF0dHJzID0gT2JqZWN0LmtleXMoYXR0cnMpLnNvcnQoKS5tYXAoKG5hbWUpID0+IGAgJHtuYW1lfT0ke2F0dHJzW25hbWVdfWApLmpvaW4oJycpO1xuICAgIGNvbnN0IGVuZCA9IGlzVm9pZCA/ICcvPicgOiBgPjwvJHt0YWd9PmA7XG5cbiAgICByZXR1cm4gc3RhcnQgKyBzdHJBdHRycyArIGVuZDtcbiAgfVxuXG4gIHByaXZhdGUgX2hhc2hDbG9zaW5nVGFnKHRhZzogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2hhc2hUYWcoYC8ke3RhZ31gLCB7fSwgZmFsc2UpOyB9XG5cbiAgcHJpdmF0ZSBfZ2VuZXJhdGVVbmlxdWVOYW1lKGJhc2U6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3Qgc2VlbiA9IHRoaXMuX3BsYWNlSG9sZGVyTmFtZUNvdW50cy5oYXNPd25Qcm9wZXJ0eShiYXNlKTtcbiAgICBpZiAoIXNlZW4pIHtcbiAgICAgIHRoaXMuX3BsYWNlSG9sZGVyTmFtZUNvdW50c1tiYXNlXSA9IDE7XG4gICAgICByZXR1cm4gYmFzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuX3BsYWNlSG9sZGVyTmFtZUNvdW50c1tiYXNlXTtcbiAgICB0aGlzLl9wbGFjZUhvbGRlck5hbWVDb3VudHNbYmFzZV0gPSBpZCArIDE7XG4gICAgcmV0dXJuIGAke2Jhc2V9XyR7aWR9YDtcbiAgfVxufVxuIl19