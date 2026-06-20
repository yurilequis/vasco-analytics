"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbitro = void 0;
var graphql_1 = require("@nestjs/graphql");
var Arbitro = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _nomeCompleto_decorators;
    var _nomeCompleto_initializers = [];
    var _nomeCompleto_extraInitializers = [];
    var _nomePopular_decorators;
    var _nomePopular_initializers = [];
    var _nomePopular_extraInitializers = [];
    var _nacionalidade_decorators;
    var _nacionalidade_initializers = [];
    var _nacionalidade_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _fotoUrl_decorators;
    var _fotoUrl_initializers = [];
    var _fotoUrl_extraInitializers = [];
    var _ativo_decorators;
    var _ativo_initializers = [];
    var _ativo_extraInitializers = [];
    var Arbitro = _classThis = /** @class */ (function () {
        function Arbitro_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nomeCompleto = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nomeCompleto_initializers, void 0));
            this.nomePopular = (__runInitializers(this, _nomeCompleto_extraInitializers), __runInitializers(this, _nomePopular_initializers, void 0));
            this.nacionalidade = (__runInitializers(this, _nomePopular_extraInitializers), __runInitializers(this, _nacionalidade_initializers, void 0));
            this.estado = (__runInitializers(this, _nacionalidade_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
            this.fotoUrl = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _fotoUrl_initializers, void 0));
            this.ativo = (__runInitializers(this, _fotoUrl_extraInitializers), __runInitializers(this, _ativo_initializers, void 0));
            __runInitializers(this, _ativo_extraInitializers);
        }
        return Arbitro_1;
    }());
    __setFunctionName(_classThis, "Arbitro");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _nomeCompleto_decorators = [(0, graphql_1.Field)()];
        _nomePopular_decorators = [(0, graphql_1.Field)()];
        _nacionalidade_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _estado_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _fotoUrl_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _ativo_decorators = [(0, graphql_1.Field)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nomeCompleto_decorators, { kind: "field", name: "nomeCompleto", static: false, private: false, access: { has: function (obj) { return "nomeCompleto" in obj; }, get: function (obj) { return obj.nomeCompleto; }, set: function (obj, value) { obj.nomeCompleto = value; } }, metadata: _metadata }, _nomeCompleto_initializers, _nomeCompleto_extraInitializers);
        __esDecorate(null, null, _nomePopular_decorators, { kind: "field", name: "nomePopular", static: false, private: false, access: { has: function (obj) { return "nomePopular" in obj; }, get: function (obj) { return obj.nomePopular; }, set: function (obj, value) { obj.nomePopular = value; } }, metadata: _metadata }, _nomePopular_initializers, _nomePopular_extraInitializers);
        __esDecorate(null, null, _nacionalidade_decorators, { kind: "field", name: "nacionalidade", static: false, private: false, access: { has: function (obj) { return "nacionalidade" in obj; }, get: function (obj) { return obj.nacionalidade; }, set: function (obj, value) { obj.nacionalidade = value; } }, metadata: _metadata }, _nacionalidade_initializers, _nacionalidade_extraInitializers);
        __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
        __esDecorate(null, null, _fotoUrl_decorators, { kind: "field", name: "fotoUrl", static: false, private: false, access: { has: function (obj) { return "fotoUrl" in obj; }, get: function (obj) { return obj.fotoUrl; }, set: function (obj, value) { obj.fotoUrl = value; } }, metadata: _metadata }, _fotoUrl_initializers, _fotoUrl_extraInitializers);
        __esDecorate(null, null, _ativo_decorators, { kind: "field", name: "ativo", static: false, private: false, access: { has: function (obj) { return "ativo" in obj; }, get: function (obj) { return obj.ativo; }, set: function (obj, value) { obj.ativo = value; } }, metadata: _metadata }, _ativo_initializers, _ativo_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Arbitro = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Arbitro = _classThis;
}();
exports.Arbitro = Arbitro;
