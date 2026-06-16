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
// Configuração reutilizável do Multer para organizar as pastas
var multerConfig = function (pasta, prefixo) { return ({
    storage: (0, multer_1.diskStorage)({
        destination: "./uploads/".concat(pasta),
        filename: function (req, file, cb) {
            var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            var ext = (0, path_1.extname)(file.originalname);
            cb(null, "".concat(prefixo, "-").concat(uniqueSuffix).concat(ext));
        },
    }),
}); };
var UploadController = function () {
    var _classDecorators = [(0, common_1.Controller)('api/v1/upload')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadFotoJogador_decorators;
    var _uploadEscudoEquipe_decorators;
    var UploadController = _classThis = /** @class */ (function () {
        function UploadController_1() {
            __runInitializers(this, _instanceExtraInitializers);
        }
        // 1. Rota da Foto do Jogador
        UploadController_1.prototype.uploadFotoJogador = function (file) {
            if (!file)
                throw new common_1.BadRequestException('Nenhum arquivo enviado');
            return {
                fotoUrl: "http://localhost:3001/uploads/jogadores/".concat(file.filename),
            };
        };
        // 2. Rota do Escudo da Equipe
        UploadController_1.prototype.uploadEscudoEquipe = function (file) {
            if (!file)
                throw new common_1.BadRequestException('Nenhum arquivo enviado');
            return {
                escudoUrl: "http://localhost:3001/uploads/escudos/".concat(file.filename),
            };
        };
        return UploadController_1;
    }());
    __setFunctionName(_classThis, "UploadController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadFotoJogador_decorators = [(0, common_1.Post)('jogador-foto'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', multerConfig('jogadores', 'jogador')))];
        _uploadEscudoEquipe_decorators = [(0, common_1.Post)('equipe-escudo'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('escudo', multerConfig('escudos', 'escudo')))];
        __esDecorate(_classThis, null, _uploadFotoJogador_decorators, { kind: "method", name: "uploadFotoJogador", static: false, private: false, access: { has: function (obj) { return "uploadFotoJogador" in obj; }, get: function (obj) { return obj.uploadFotoJogador; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadEscudoEquipe_decorators, { kind: "method", name: "uploadEscudoEquipe", static: false, private: false, access: { has: function (obj) { return "uploadEscudoEquipe" in obj; }, get: function (obj) { return obj.uploadEscudoEquipe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UploadController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UploadController = _classThis;
}();
exports.UploadController = UploadController;
