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
exports.ArbitrosResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var arbitro_entity_1 = require("./entities/arbitro.entity");
var media_arbitro_entity_1 = require("./entities/media-arbitro.entity");
var ArbitrosResolver = function () {
    var _classDecorators = [(0, graphql_1.Resolver)(function () { return arbitro_entity_1.Arbitro; })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _findAll_decorators;
    var _findAtivos_decorators;
    var _findOne_decorators;
    var _mediaEstatisticas_decorators;
    var ArbitrosResolver = _classThis = /** @class */ (function () {
        function ArbitrosResolver_1(arbitrosService) {
            this.arbitrosService = (__runInitializers(this, _instanceExtraInitializers), arbitrosService);
        }
        ArbitrosResolver_1.prototype.findAll = function () {
            return this.arbitrosService.findAll();
        };
        ArbitrosResolver_1.prototype.findAtivos = function () {
            return this.arbitrosService.findAtivos();
        };
        ArbitrosResolver_1.prototype.findOne = function (id) {
            return this.arbitrosService.findOne(id);
        };
        ArbitrosResolver_1.prototype.mediaEstatisticas = function (id) {
            return this.arbitrosService.mediaEstatisticas(id);
        };
        return ArbitrosResolver_1;
    }());
    __setFunctionName(_classThis, "ArbitrosResolver");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, graphql_1.Query)(function () { return [arbitro_entity_1.Arbitro]; }, { name: 'arbitros' })];
        _findAtivos_decorators = [(0, graphql_1.Query)(function () { return [arbitro_entity_1.Arbitro]; }, { name: 'arbitrosAtivos' })];
        _findOne_decorators = [(0, graphql_1.Query)(function () { return arbitro_entity_1.Arbitro; }, { name: 'arbitro', nullable: true })];
        _mediaEstatisticas_decorators = [(0, graphql_1.Query)(function () { return media_arbitro_entity_1.MediaArbitro; }, { name: 'mediaArbitro', nullable: true })];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAtivos_decorators, { kind: "method", name: "findAtivos", static: false, private: false, access: { has: function (obj) { return "findAtivos" in obj; }, get: function (obj) { return obj.findAtivos; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _mediaEstatisticas_decorators, { kind: "method", name: "mediaEstatisticas", static: false, private: false, access: { has: function (obj) { return "mediaEstatisticas" in obj; }, get: function (obj) { return obj.mediaEstatisticas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ArbitrosResolver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ArbitrosResolver = _classThis;
}();
exports.ArbitrosResolver = ArbitrosResolver;
