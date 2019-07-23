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
export const /** @type {?} */ MISSING_TRANSLATION_STRATEGY = new InjectionToken("MissingTranslationStrategy");
/**
 * A speculative polyfill to use i18n code translations
 */
export class I18n {
    /**
     * @param {?} format
     * @param {?} translations
     * @param {?} locale
     * @param {?=} missingTranslationStrategy
     */
    constructor(format, translations, locale, missingTranslationStrategy = MissingTranslationStrategy.Warning) {
        let /** @type {?} */ loadFct;
        let /** @type {?} */ digest;
        let /** @type {?} */ createMapper = (message) => null;
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
                throw new Error(`Unknown translations format ${format}`);
        }
        const /** @type {?} */ htmlParser = new HtmlParser();
        const /** @type {?} */ translationsBundle = TranslationBundle.load(translations, "i18n", digest, createMapper, loadFct, missingTranslationStrategy);
        // todo use interpolation config
        return (def, params = {}) => {
            const /** @type {?} */ content = typeof def === "string" ? def : def.value;
            const /** @type {?} */ metadata = {};
            if (typeof def === "object") {
                metadata["id"] = def.id;
                metadata["meaning"] = def.meaning;
                metadata["description"] = def.description;
            }
            const /** @type {?} */ htmlParserResult = htmlParser.parse(content, "", true);
            if (htmlParserResult.errors.length) {
                throw htmlParserResult.errors;
            }
            const /** @type {?} */ mergedNodes = htmlParser.mergeTranslations(htmlParserResult.rootNodes, translationsBundle, params, metadata, ["wrapper"]);
            return serializeNodes(mergedNodes.rootNodes, locale, params).join("");
        };
    }
}
I18n.decorators = [
    { type: Injectable },
];
/** @nocollapse */
I18n.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [TRANSLATIONS_FORMAT,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [TRANSLATIONS,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
    { type: MissingTranslationStrategy, decorators: [{ type: Optional }, { type: Inject, args: [MISSING_TRANSLATION_STRATEGY,] },] },
];
function I18n_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    I18n.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    I18n.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi1wb2x5ZmlsbC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZ3gtdHJhbnNsYXRlL2kxOG4tcG9seWZpbGwvIiwic291cmNlcyI6WyJzcmMvaTE4bi1wb2x5ZmlsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUNkLFNBQVMsRUFDVCwwQkFBMEIsRUFDMUIsUUFBUSxFQUNSLFlBQVksRUFDWixtQkFBbUIsRUFDcEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBRSxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRSxPQUFPLEVBQUMsWUFBWSxFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDcEUsT0FBTyxFQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdEUsT0FBTyxFQUFDLFVBQVUsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQW1CLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFjMUUsTUFBTSxDQUFDLHVCQUFNLDRCQUE0QixHQUFHLElBQUksY0FBYyxDQUM1RCw0QkFBNEIsQ0FDN0IsQ0FBQzs7OztBQU1GLE1BQU07Ozs7Ozs7SUFDSixZQUMrQixRQUNQLGNBQ0gsUUFHbkIsNkJBQXlELDBCQUEwQixDQUFDLE9BQU87UUFFM0YscUJBQUksT0FBMkQsQ0FBQztRQUNoRSxxQkFBSSxNQUFvQyxDQUFDO1FBQ3pDLHFCQUFJLFlBQVksR0FBRyxDQUFDLE9BQWdCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUM5QyxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNmLEtBQUssS0FBSztnQkFDUixPQUFPLEdBQUcsYUFBYSxDQUFDO2dCQUN4QixNQUFNLEdBQUcsU0FBUyxDQUFDO2dCQUNuQixZQUFZLEdBQUcsU0FBUyxDQUFDO2dCQUN6QixLQUFLLENBQUM7WUFDUixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssTUFBTTtnQkFDVCxPQUFPLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQzNCLE1BQU0sR0FBRyxZQUFZLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQztZQUNSLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxLQUFLO2dCQUNSLE9BQU8sR0FBRyxlQUFlLENBQUM7Z0JBQzFCLE1BQU0sR0FBRyxXQUFXLENBQUM7Z0JBQ3JCLEtBQUssQ0FBQztZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFDRCx1QkFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUVwQyx1QkFBTSxrQkFBa0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQy9DLFlBQVksRUFDWixNQUFNLEVBQ04sTUFBTSxFQUNOLFlBQVksRUFDWixPQUFPLEVBQ1AsMEJBQTBCLENBQzNCLENBQUM7O1FBR0YsTUFBTSxDQUFDLENBQUMsR0FBcUIsRUFBRSxTQUErQixFQUFFLEVBQUUsRUFBRTtZQUNsRSx1QkFBTSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDMUQsdUJBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztnQkFDeEIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xDLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDO2FBQzNDO1lBQ0QsdUJBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTdELEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLGdCQUFnQixDQUFDLE1BQU0sQ0FBQzthQUMvQjtZQUVELHVCQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQzlDLGdCQUFnQixDQUFDLFNBQVMsRUFDMUIsa0JBQWtCLEVBQ2xCLE1BQU0sRUFDTixRQUFRLEVBQ1IsQ0FBQyxTQUFTLENBQUMsQ0FDWixDQUFDO1lBRUYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkUsQ0FBQztLQUNIOzs7WUFyRUYsVUFBVTs7Ozs0Q0FHTixNQUFNLFNBQUMsbUJBQW1COzRDQUMxQixNQUFNLFNBQUMsWUFBWTs0Q0FDbkIsTUFBTSxTQUFDLFNBQVM7WUFuQ25CLDBCQUEwQix1QkFvQ3ZCLFFBQVEsWUFDUixNQUFNLFNBQUMsNEJBQTRCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5qZWN0LFxuICBJbmplY3RhYmxlLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgTE9DQUxFX0lELFxuICBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSxcbiAgT3B0aW9uYWwsXG4gIFRSQU5TTEFUSU9OUyxcbiAgVFJBTlNMQVRJT05TX0ZPUk1BVFxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHt4bGlmZkRpZ2VzdCwgeGxpZmZMb2FkVG9JMThufSBmcm9tIFwiLi9zZXJpYWxpemVycy94bGlmZlwiO1xuaW1wb3J0IHt4bGlmZjJEaWdlc3QsIHhsaWZmMkxvYWRUb0kxOG59IGZyb20gXCIuL3NlcmlhbGl6ZXJzL3hsaWZmMlwiO1xuaW1wb3J0IHt4dGJEaWdlc3QsIHh0YkxvYWRUb0kxOG4sIHh0Yk1hcHBlcn0gZnJvbSBcIi4vc2VyaWFsaXplcnMveHRiXCI7XG5pbXBvcnQge0h0bWxQYXJzZXIsIFRyYW5zbGF0aW9uQnVuZGxlfSBmcm9tIFwiLi9wYXJzZXIvaHRtbFwiO1xuaW1wb3J0IHtJMThuTWVzc2FnZXNCeUlkLCBzZXJpYWxpemVOb2Rlc30gZnJvbSBcIi4vc2VyaWFsaXplcnMvc2VyaWFsaXplclwiO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tIFwiLi9hc3QvaTE4bl9hc3RcIjtcblxuZXhwb3J0IGRlY2xhcmUgaW50ZXJmYWNlIEkxOG4ge1xuICAoZGVmOiBzdHJpbmcgfCBJMThuRGVmLCBwYXJhbXM/OiB7W2tleTogc3RyaW5nXTogYW55fSk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJMThuRGVmIHtcbiAgdmFsdWU6IHN0cmluZztcbiAgaWQ/OiBzdHJpbmc7XG4gIG1lYW5pbmc/OiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgTUlTU0lOR19UUkFOU0xBVElPTl9TVFJBVEVHWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneT4oXG4gIFwiTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3lcIlxuKTtcblxuLyoqXG4gKiBBIHNwZWN1bGF0aXZlIHBvbHlmaWxsIHRvIHVzZSBpMThuIGNvZGUgdHJhbnNsYXRpb25zXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBJMThuIHtcbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChUUkFOU0xBVElPTlNfRk9STUFUKSBmb3JtYXQ6IHN0cmluZyxcbiAgICBASW5qZWN0KFRSQU5TTEFUSU9OUykgdHJhbnNsYXRpb25zOiBzdHJpbmcsXG4gICAgQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZTogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNSVNTSU5HX1RSQU5TTEFUSU9OX1NUUkFURUdZKVxuICAgIG1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5OiBNaXNzaW5nVHJhbnNsYXRpb25TdHJhdGVneSA9IE1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5Lldhcm5pbmdcbiAgKSB7XG4gICAgbGV0IGxvYWRGY3Q6IChjb250ZW50OiBzdHJpbmcsIHVybDogc3RyaW5nKSA9PiBJMThuTWVzc2FnZXNCeUlkO1xuICAgIGxldCBkaWdlc3Q6IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBzdHJpbmc7XG4gICAgbGV0IGNyZWF0ZU1hcHBlciA9IChtZXNzYWdlOiBNZXNzYWdlKSA9PiBudWxsO1xuICAgIGZvcm1hdCA9IChmb3JtYXQgfHwgXCJ4bGZcIikudG9Mb3dlckNhc2UoKTtcbiAgICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgICAgY2FzZSBcInh0YlwiOlxuICAgICAgICBsb2FkRmN0ID0geHRiTG9hZFRvSTE4bjtcbiAgICAgICAgZGlnZXN0ID0geHRiRGlnZXN0O1xuICAgICAgICBjcmVhdGVNYXBwZXIgPSB4dGJNYXBwZXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInhsaWZmMlwiOlxuICAgICAgY2FzZSBcInhsZjJcIjpcbiAgICAgICAgbG9hZEZjdCA9IHhsaWZmMkxvYWRUb0kxOG47XG4gICAgICAgIGRpZ2VzdCA9IHhsaWZmMkRpZ2VzdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwieGxpZmZcIjpcbiAgICAgIGNhc2UgXCJ4bGZcIjpcbiAgICAgICAgbG9hZEZjdCA9IHhsaWZmTG9hZFRvSTE4bjtcbiAgICAgICAgZGlnZXN0ID0geGxpZmZEaWdlc3Q7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHRyYW5zbGF0aW9ucyBmb3JtYXQgJHtmb3JtYXR9YCk7XG4gICAgfVxuICAgIGNvbnN0IGh0bWxQYXJzZXIgPSBuZXcgSHRtbFBhcnNlcigpO1xuXG4gICAgY29uc3QgdHJhbnNsYXRpb25zQnVuZGxlID0gVHJhbnNsYXRpb25CdW5kbGUubG9hZChcbiAgICAgIHRyYW5zbGF0aW9ucyxcbiAgICAgIFwiaTE4blwiLFxuICAgICAgZGlnZXN0LFxuICAgICAgY3JlYXRlTWFwcGVyLFxuICAgICAgbG9hZEZjdCxcbiAgICAgIG1pc3NpbmdUcmFuc2xhdGlvblN0cmF0ZWd5XG4gICAgKTtcblxuICAgIC8vIHRvZG8gdXNlIGludGVycG9sYXRpb24gY29uZmlnXG4gICAgcmV0dXJuIChkZWY6IHN0cmluZyB8IEkxOG5EZWYsIHBhcmFtczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fSkgPT4ge1xuICAgICAgY29uc3QgY29udGVudCA9IHR5cGVvZiBkZWYgPT09IFwic3RyaW5nXCIgPyBkZWYgOiBkZWYudmFsdWU7XG4gICAgICBjb25zdCBtZXRhZGF0YSA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiBkZWYgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbWV0YWRhdGFbXCJpZFwiXSA9IGRlZi5pZDtcbiAgICAgICAgbWV0YWRhdGFbXCJtZWFuaW5nXCJdID0gZGVmLm1lYW5pbmc7XG4gICAgICAgIG1ldGFkYXRhW1wiZGVzY3JpcHRpb25cIl0gPSBkZWYuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgICBjb25zdCBodG1sUGFyc2VyUmVzdWx0ID0gaHRtbFBhcnNlci5wYXJzZShjb250ZW50LCBcIlwiLCB0cnVlKTtcblxuICAgICAgaWYgKGh0bWxQYXJzZXJSZXN1bHQuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICB0aHJvdyBodG1sUGFyc2VyUmVzdWx0LmVycm9ycztcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWVyZ2VkTm9kZXMgPSBodG1sUGFyc2VyLm1lcmdlVHJhbnNsYXRpb25zKFxuICAgICAgICBodG1sUGFyc2VyUmVzdWx0LnJvb3ROb2RlcyxcbiAgICAgICAgdHJhbnNsYXRpb25zQnVuZGxlLFxuICAgICAgICBwYXJhbXMsXG4gICAgICAgIG1ldGFkYXRhLFxuICAgICAgICBbXCJ3cmFwcGVyXCJdXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gc2VyaWFsaXplTm9kZXMobWVyZ2VkTm9kZXMucm9vdE5vZGVzLCBsb2NhbGUsIHBhcmFtcykuam9pbihcIlwiKTtcbiAgICB9O1xuICB9XG59XG4iXX0=