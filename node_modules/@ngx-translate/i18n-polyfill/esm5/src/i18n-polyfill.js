/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable, InjectionToken, LOCALE_ID, MissingTranslationStrategy, Optional, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { xliffDigest, xliffLoadToI18n } from "./serializers/xliff";
import { xliff2Digest, xliff2LoadToI18n } from "./serializers/xliff2";
import { xtbDigest, xtbLoadToI18n, xtbMapper } from "./serializers/xtb";
import { HtmlParser, TranslationBundle } from "./parser/html";
import { serializeNodes } from "./serializers/serializer";
/**
 * @record
 */
export function I18nDef() { }
function I18nDef_tsickle_Closure_declarations() {
    /** @type {?} */
    I18nDef.prototype.value;
    /** @type {?|undefined} */
    I18nDef.prototype.id;
    /** @type {?|undefined} */
    I18nDef.prototype.meaning;
    /** @type {?|undefined} */
    I18nDef.prototype.description;
}
export var /** @type {?} */ MISSING_TRANSLATION_STRATEGY = new InjectionToken("MissingTranslationStrategy");
/**
 * A speculative polyfill to use i18n code translations
 */
var I18n = /** @class */ (function () {
    function I18n(format, translations, locale, missingTranslationStrategy) {
        if (missingTranslationStrategy === void 0) { missingTranslationStrategy = MissingTranslationStrategy.Warning; }
        var /** @type {?} */ loadFct;
        var /** @type {?} */ digest;
        var /** @type {?} */ createMapper = function (message) { return null; };
        format = (format || "xlf").toLowerCase();
        switch (format) {
            case "xtb":
                loadFct = xtbLoadToI18n;
                digest = xtbDigest;
                createMapper = xtbMapper;
                break;
            case "xliff2":
            case "xlf2":
                loadFct = xliff2LoadToI18n;
                digest = xliff2Digest;
                break;
            case "xliff":
            case "xlf":
                loadFct = xliffLoadToI18n;
                digest = xliffDigest;
                break;
            default:
                throw new Error("Unknown translations format " + format);
        }
        var /** @type {?} */ htmlParser = new HtmlParser();
        var /** @type {?} */ translationsBundle = TranslationBundle.load(translations, "i18n", digest, createMapper, loadFct, missingTranslationStrategy);
        // todo use interpolation config
        return function (def, params) {
            if (params === void 0) { params = {}; }
            var /** @type {?} */ content = typeof def === "string" ? def : def.value;
            var /** @type {?} */ metadata = {};
            if (typeof def === "object") {
                metadata["id"] = def.id;
                metadata["meaning"] = def.meaning;
                metadata["description"] = def.description;
            }
            var /** @type {?} */ htmlParserResult = htmlParser.parse(content, "", true);
            if (htmlParserResult.errors.length) {
                throw htmlParserResult.errors;
            }
            var /** @type {?} */ mergedNodes = htmlParser.mergeTranslations(htmlParserResult.rootNodes, translationsBundle, params, metadata, ["wrapper"]);
            return serializeNodes(mergedNodes.rootNodes, locale, params).join("");
        };
    }
    I18n.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    I18n.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [TRANSLATIONS_FORMAT,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [TRANSLATIONS,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
        { type: MissingTranslationStrategy, decorators: [{ type: Optional }, { type: Inject, args: [MISSING_TRANSLATION_STRATEGY,] },] },
    ]; };
    return I18n;
}());
export { I18n };
function I18n_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    I18n.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    I18n.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi1wb2x5ZmlsbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvaTE4bi1wb2x5ZmlsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFNBQVMsRUFDVCwwQkFBMEIsRUFDMUIsUUFBUSxFQUNSLFlBQVksRUFDWixtQkFBbUIsRUFDcEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdEUsT0FBTyxFQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQW1CLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFjMUUsTUFBTSxDQUFDLHFCQUFNLDRCQUE0QixHQUFHLElBQUksY0FBYyxDQUM1RCw0QkFBNEIsQ0FDN0IsQ0FBQzs7Ozs7SUFPQSxjQUMrQixRQUNQLGNBQ0gsUUFHbkI7a0ZBQXlELDBCQUEwQixDQUFDLE9BQU87UUFFM0YscUJBQUksT0FBMkQsQ0FBQztRQUNoRSxxQkFBSSxNQUFvQyxDQUFDO1FBQ3pDLHFCQUFJLFlBQVksR0FBRyxVQUFDLE9BQWdCLElBQUssT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDO1FBQzlDLE1BQU0sR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2YsS0FBSyxLQUFLO2dCQUNSLE9BQU8sR0FBRyxhQUFhLENBQUM7Z0JBQ3hCLE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ25CLFlBQVksR0FBRyxTQUFTLENBQUM7Z0JBQ3pCLEtBQUssQ0FBQztZQUNSLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxNQUFNO2dCQUNULE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQztnQkFDM0IsTUFBTSxHQUFHLFlBQVksQ0FBQztnQkFDdEIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLEtBQUs7Z0JBQ1IsT0FBTyxHQUFHLGVBQWUsQ0FBQztnQkFDMUIsTUFBTSxHQUFHLFdBQVcsQ0FBQztnQkFDckIsS0FBSyxDQUFDO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBK0IsTUFBUSxDQUFDLENBQUM7U0FDNUQ7UUFDRCxxQkFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUVwQyxxQkFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQy9DLFlBQVksRUFDWixNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksRUFDWixPQUFPLEVBQ1AsMEJBQTBCLENBQzNCLENBQUM7O1FBR0YsTUFBTSxDQUFDLFVBQUMsR0FBcUIsRUFBRSxNQUFpQztZQUFqQyx1QkFBQSxFQUFBLFdBQWlDO1lBQzlELHFCQUFNLE9BQU8sR0FBRyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUMxRCxxQkFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUN4QixRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDbEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7YUFDM0M7WUFDRCxxQkFBTSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFN0QsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sZ0JBQWdCLENBQUMsTUFBTSxDQUFDO2FBQy9CO1lBRUQscUJBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsQ0FDOUMsZ0JBQWdCLENBQUMsU0FBUyxFQUMxQixrQkFBa0IsRUFDbEIsTUFBTSxFQUNOLFFBQVEsRUFDUixDQUFDLFNBQVMsQ0FBQyxDQUNaLENBQUM7WUFFRixNQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RSxDQUFDO0tBQ0g7O2dCQXJFRixVQUFVOzs7O2dEQUdOLE1BQU0sU0FBQyxtQkFBbUI7Z0RBQzFCLE1BQU0sU0FBQyxZQUFZO2dEQUNuQixNQUFNLFNBQUMsU0FBUztnQkFuQ25CLDBCQUEwQix1QkFvQ3ZCLFFBQVEsWUFDUixNQUFNLFNBQUMsNEJBQTRCOztlQTFDeEM7O1NBb0NhLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdGlvblRva2VuLFxuICBMT0NBTEVfSUQsXG4gIE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5LFxuICBPcHRpb25hbCxcbiAgVFJBTlNMQVRJT05TLFxuICBUUkFOU0xBVElPTlNfRk9STUFUXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge3hsaWZmRGlnZXN0LCB4bGlmZkxvYWRUb0kxOG59IGZyb20gXCIuL3NlcmlhbGl6ZXJzL3hsaWZmXCI7XG5pbXBvcnQge3hsaWZmMkRpZ2VzdCwgeGxpZmYyTG9hZFRvSTE4bn0gZnJvbSBcIi4vc2VyaWFsaXplcnMveGxpZmYyXCI7XG5pbXBvcnQge3h0YkRpZ2VzdCwgeHRiTG9hZFRvSTE4biwgeHRiTWFwcGVyfSBmcm9tIFwiLi9zZXJpYWxpemVycy94dGJcIjtcbmltcG9ydCB7SHRtbFBhcnNlciwgVHJhbnNsYXRpb25CdW5kbGV9IGZyb20gXCIuL3BhcnNlci9odG1sXCI7XG5pbXBvcnQge0kxOG5NZXNzYWdlc0J5SWQsIHNlcmlhbGl6ZU5vZGVzfSBmcm9tIFwiLi9zZXJpYWxpemVycy9zZXJpYWxpemVyXCI7XG5pbXBvcnQge01lc3NhZ2V9IGZyb20gXCIuL2FzdC9pMThuX2FzdFwiO1xuXG5leHBvcnQgZGVjbGFyZSBpbnRlcmZhY2UgSTE4biB7XG4gIChkZWY6IHN0cmluZyB8IEkxOG5EZWYsIHBhcmFtcz86IHtba2V5OiBzdHJpbmddOiBhbnl9KTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEkxOG5EZWYge1xuICB2YWx1ZTogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgbWVhbmluZz86IHN0cmluZztcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBNSVNTSU5HX1RSQU5TTEFUSU9OX1NUUkFURUdZID0gbmV3IEluamVjdGlvblRva2VuPE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5PihcbiAgXCJNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneVwiXG4pO1xuXG4vKipcbiAqIEEgc3BlY3VsYXRpdmUgcG9seWZpbGwgdG8gdXNlIGkxOG4gY29kZSB0cmFuc2xhdGlvbnNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEkxOG4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KFRSQU5TTEFUSU9OU19GT1JNQVQpIGZvcm1hdDogc3RyaW5nLFxuICAgIEBJbmplY3QoVFJBTlNMQVRJT05TKSB0cmFuc2xhdGlvbnM6IHN0cmluZyxcbiAgICBASW5qZWN0KExPQ0FMRV9JRCkgbG9jYWxlOiBzdHJpbmcsXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1JU1NJTkdfVFJBTlNMQVRJT05fU1RSQVRFR1kpXG4gICAgbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3k6IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5ID0gTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3kuV2FybmluZ1xuICApIHtcbiAgICBsZXQgbG9hZEZjdDogKGNvbnRlbnQ6IHN0cmluZywgdXJsOiBzdHJpbmcpID0+IEkxOG5NZXNzYWdlc0J5SWQ7XG4gICAgbGV0IGRpZ2VzdDogKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IHN0cmluZztcbiAgICBsZXQgY3JlYXRlTWFwcGVyID0gKG1lc3NhZ2U6IE1lc3NhZ2UpID0+IG51bGw7XG4gICAgZm9ybWF0ID0gKGZvcm1hdCB8fCBcInhsZlwiKS50b0xvd2VyQ2FzZSgpO1xuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlIFwieHRiXCI6XG4gICAgICAgIGxvYWRGY3QgPSB4dGJMb2FkVG9JMThuO1xuICAgICAgICBkaWdlc3QgPSB4dGJEaWdlc3Q7XG4gICAgICAgIGNyZWF0ZU1hcHBlciA9IHh0Yk1hcHBlcjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwieGxpZmYyXCI6XG4gICAgICBjYXNlIFwieGxmMlwiOlxuICAgICAgICBsb2FkRmN0ID0geGxpZmYyTG9hZFRvSTE4bjtcbiAgICAgICAgZGlnZXN0ID0geGxpZmYyRGlnZXN0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ4bGlmZlwiOlxuICAgICAgY2FzZSBcInhsZlwiOlxuICAgICAgICBsb2FkRmN0ID0geGxpZmZMb2FkVG9JMThuO1xuICAgICAgICBkaWdlc3QgPSB4bGlmZkRpZ2VzdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHJhbnNsYXRpb25zIGZvcm1hdCAke2Zvcm1hdH1gKTtcbiAgICB9XG4gICAgY29uc3QgaHRtbFBhcnNlciA9IG5ldyBIdG1sUGFyc2VyKCk7XG5cbiAgICBjb25zdCB0cmFuc2xhdGlvbnNCdW5kbGUgPSBUcmFuc2xhdGlvbkJ1bmRsZS5sb2FkKFxuICAgICAgdHJhbnNsYXRpb25zLFxuICAgICAgXCJpMThuXCIsXG4gICAgICBkaWdlc3QsXG4gICAgICBjcmVhdGVNYXBwZXIsXG4gICAgICBsb2FkRmN0LFxuICAgICAgbWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3lcbiAgICApO1xuXG4gICAgLy8gdG9kbyB1c2UgaW50ZXJwb2xhdGlvbiBjb25maWdcbiAgICByZXR1cm4gKGRlZjogc3RyaW5nIHwgSTE4bkRlZiwgcGFyYW1zOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9KSA9PiB7XG4gICAgICBjb25zdCBjb250ZW50ID0gdHlwZW9mIGRlZiA9PT0gXCJzdHJpbmdcIiA/IGRlZiA6IGRlZi52YWx1ZTtcbiAgICAgIGNvbnN0IG1ldGFkYXRhID0ge307XG4gICAgICBpZiAodHlwZW9mIGRlZiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtZXRhZGF0YVtcImlkXCJdID0gZGVmLmlkO1xuICAgICAgICBtZXRhZGF0YVtcIm1lYW5pbmdcIl0gPSBkZWYubWVhbmluZztcbiAgICAgICAgbWV0YWRhdGFbXCJkZXNjcmlwdGlvblwiXSA9IGRlZi5kZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGh0bWxQYXJzZXJSZXN1bHQgPSBodG1sUGFyc2VyLnBhcnNlKGNvbnRlbnQsIFwiXCIsIHRydWUpO1xuXG4gICAgICBpZiAoaHRtbFBhcnNlclJlc3VsdC5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIHRocm93IGh0bWxQYXJzZXJSZXN1bHQuZXJyb3JzO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtZXJnZWROb2RlcyA9IGh0bWxQYXJzZXIubWVyZ2VUcmFuc2xhdGlvbnMoXG4gICAgICAgIGh0bWxQYXJzZXJSZXN1bHQucm9vdE5vZGVzLFxuICAgICAgICB0cmFuc2xhdGlvbnNCdW5kbGUsXG4gICAgICAgIHBhcmFtcyxcbiAgICAgICAgbWV0YWRhdGEsXG4gICAgICAgIFtcIndyYXBwZXJcIl1cbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBzZXJpYWxpemVOb2RlcyhtZXJnZWROb2Rlcy5yb290Tm9kZXMsIGxvY2FsZSwgcGFyYW1zKS5qb2luKFwiXCIpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==