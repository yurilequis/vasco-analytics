"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var passport_1 = require("@nestjs/passport");
var UploadController = function () {
    var _classDecorators = [(0, common_1.Controller)('api/v1/upload')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadFoto_decorators;
    var UploadController = _classThis = /** @class */ (function () {
        function UploadController_1() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        UploadController_1.prototype.uploadFoto = function (file) {
            if (!file) {
                throw new common_1.BadRequestException('Nenhum arquivo enviado.');
            }
            return { fotoUrl: "/fotos-jogadores/".concat(file.filename) };
        };
        return UploadController_1;
    }());
    __setFunctionName(_classThis, "UploadController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadFoto_decorators = [(0, common_1.Post)('jogador-foto'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', {
                storage: (0, multer_1.diskStorage)({
                    destination: (0, path_1.join)(process.cwd(), '..', 'frontend', 'public', 'fotos-jogadores'),
                    // Tipagem explícita adicionada aqui:
                    filename: function (_req, file, callback) {
                        var sufixoUnico = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        var extensao = (0, path_1.extname)(file.originalname);
                        callback(null, "jogador-".concat(sufixoUnico).concat(extensao));
                    },
                }),
                // Tipagem explícita adicionada aqui:
                fileFilter: function (_req, file, callback) {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                        return callback(new common_1.BadRequestException('Apenas imagens (png, jpg, webp) são permitidas!'), false);
                    }
                    callback(null, true);
                },
            }))];
        __esDecorate(_classThis, null, _uploadFoto_decorators, { kind: "method", name: "uploadFoto", static: false, private: false, access: { has: function (obj) { return "uploadFoto" in obj; }, get: function (obj) { return obj.uploadFoto; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UploadController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UploadController = _classThis;
}();
exports.UploadController = UploadController;
