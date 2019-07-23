"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const xliff_1 = require("./serializers/xliff");
const xliff2_1 = require("./serializers/xliff2");
const xtb_1 = require("./serializers/xtb");
const html_1 = require("./parser/html");
const serializer_1 = require("./serializers/serializer");
exports.MISSING_TRANSLATION_STRATEGY = new core_1.InjectionToken("MissingTranslationStrategy");
/**
 * A speculative polyfill to use i18n code translations
 */
let I18n = class I18n {
    constructor(format, translations, locale, missingTranslationStrategy = core_1.MissingTranslationStrategy.Warning) {
        let loadFct;
        let digest;
        let createMapper = (message) => null;
        format = (format || "xlf").toLowerCase();
        switch (format) {
            case "xtb":
                loadFct = xtb_1.xtbLoadToI18n;
                digest = xtb_1.xtbDigest;
                createMapper = xtb_1.xtbMapper;
                break;
            case "xliff2":
            case "xlf2":
                loadFct = xliff2_1.xliff2LoadToI18n;
                digest = xliff2_1.xliff2Digest;
                break;
            case "xliff":
            case "xlf":
                loadFct = xliff_1.xliffLoadToI18n;
                digest = xliff_1.xliffDigest;
                break;
            default:
                throw new Error(`Unknown translations format ${format}`);
        }
        const htmlParser = new html_1.HtmlParser();
        const translationsBundle = html_1.TranslationBundle.load(translations, "i18n", digest, createMapper, loadFct, missingTranslationStrategy);
        // todo use interpolation config
        return (def, params = {}) => {
            const content = typeof def === "string" ? def : def.value;
            const metadata = {};
            if (typeof def === "object") {
                metadata["id"] = def.id;
                metadata["meaning"] = def.meaning;
                metadata["description"] = def.description;
            }
            const htmlParserResult = htmlParser.parse(content, "", true);
            if (htmlParserResult.errors.length) {
                throw htmlParserResult.errors;
            }
            const mergedNodes = htmlParser.mergeTranslations(htmlParserResult.rootNodes, translationsBundle, params, metadata, ["wrapper"]);
            return serializer_1.serializeNodes(mergedNodes.rootNodes, locale, params).join("");
        };
    }
};
I18n = __decorate([
    core_1.Injectable(),
    __param(0, core_1.Inject(core_1.TRANSLATIONS_FORMAT)),
    __param(1, core_1.Inject(core_1.TRANSLATIONS)),
    __param(2, core_1.Inject(core_1.LOCALE_ID)),
    __param(3, core_1.Optional()),
    __param(3, core_1.Inject(exports.MISSING_TRANSLATION_STRATEGY))
], I18n);
exports.I18n = I18n;
//# sourceMappingURL=i18n-polyfill.js.map