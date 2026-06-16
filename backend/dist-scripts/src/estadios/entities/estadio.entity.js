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
exports.Estadio = void 0;
var graphql_1 = require("@nestjs/graphql");
var Estadio = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _nome_decorators;
    var _nome_initializers = [];
    var _nome_extraInitializers = [];
    var _nomePopular_decorators;
    var _nomePopular_initializers = [];
    var _nomePopular_extraInitializers = [];
    var _cidade_decorators;
    var _cidade_initializers = [];
    var _cidade_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _pais_decorators;
    var _pais_initializers = [];
    var _pais_extraInitializers = [];
    var _capacidade_decorators;
    var _capacidade_initializers = [];
    var _capacidade_extraInitializers = [];
    var _proprietario_decorators;
    var _proprietario_initializers = [];
    var _proprietario_extraInitializers = [];
    var _grama_decorators;
    var _grama_initializers = [];
    var _grama_extraInitializers = [];
    var _fotoUrl_decorators;
    var _fotoUrl_initializers = [];
    var _fotoUrl_extraInitializers = [];
    var Estadio = _classThis = /** @class */ (function () {
        function Estadio_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nome = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nome_initializers, void 0));
            this.nomePopular = (__runInitializers(this, _nome_extraInitializers), __runInitializers(this, _nomePopular_initializers, void 0));
            this.cidade = (__runInitializers(this, _nomePopular_extraInitializers), __runInitializers(this, _cidade_initializers, void 0));
            this.estado = (__runInitializers(this, _cidade_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
            this.pais = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _pais_initializers, void 0));
            this.capacidade = (__runInitializers(this, _pais_extraInitializers), __runInitializers(this, _capacidade_initializers, void 0));
            this.proprietario = (__runInitializers(this, _capacidade_extraInitializers), __runInitializers(this, _proprietario_initializers, void 0));
            this.grama = (__runInitializers(this, _proprietario_extraInitializers), __runInitializers(this, _grama_initializers, void 0));
            this.fotoUrl = (__runInitializers(this, _grama_extraInitializers), __runInitializers(this, _fotoUrl_initializers, void 0));
            __runInitializers(this, _fotoUrl_extraInitializers);
        }
        return Estadio_1;
    }());
    __setFunctionName(_classThis, "Estadio");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _nome_decorators = [(0, graphql_1.Field)()];
        _nomePopular_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _cidade_decorators = [(0, graphql_1.Field)()];
        _estado_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _pais_decorators = [(0, graphql_1.Field)()];
        _capacidade_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; }, { nullable: true })];
        _proprietario_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _grama_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _fotoUrl_decorators = [(0, graphql_1.Field)({ nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nome_decorators, { kind: "field", name: "nome", static: false, private: false, access: { has: function (obj) { return "nome" in obj; }, get: function (obj) { return obj.nome; }, set: function (obj, value) { obj.nome = value; } }, metadata: _metadata }, _nome_initializers, _nome_extraInitializers);
        __esDecorate(null, null, _nomePopular_decorators, { kind: "field", name: "nomePopular", static: false, private: false, access: { has: function (obj) { return "nomePopular" in obj; }, get: function (obj) { return obj.nomePopular; }, set: function (obj, value) { obj.nomePopular = value; } }, metadata: _metadata }, _nomePopular_initializers, _nomePopular_extraInitializers);
        __esDecorate(null, null, _cidade_decorators, { kind: "field", name: "cidade", static: false, private: false, access: { has: function (obj) { return "cidade" in obj; }, get: function (obj) { return obj.cidade; }, set: function (obj, value) { obj.cidade = value; } }, metadata: _metadata }, _cidade_initializers, _cidade_extraInitializers);
        __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
        __esDecorate(null, null, _pais_decorators, { kind: "field", name: "pais", static: false, private: false, access: { has: function (obj) { return "pais" in obj; }, get: function (obj) { return obj.pais; }, set: function (obj, value) { obj.pais = value; } }, metadata: _metadata }, _pais_initializers, _pais_extraInitializers);
        __esDecorate(null, null, _capacidade_decorators, { kind: "field", name: "capacidade", static: false, private: false, access: { has: function (obj) { return "capacidade" in obj; }, get: function (obj) { return obj.capacidade; }, set: function (obj, value) { obj.capacidade = value; } }, metadata: _metadata }, _capacidade_initializers, _capacidade_extraInitializers);
        __esDecorate(null, null, _proprietario_decorators, { kind: "field", name: "proprietario", static: false, private: false, access: { has: function (obj) { return "proprietario" in obj; }, get: function (obj) { return obj.proprietario; }, set: function (obj, value) { obj.proprietario = value; } }, metadata: _metadata }, _proprietario_initializers, _proprietario_extraInitializers);
        __esDecorate(null, null, _grama_decorators, { kind: "field", name: "grama", static: false, private: false, access: { has: function (obj) { return "grama" in obj; }, get: function (obj) { return obj.grama; }, set: function (obj, value) { obj.grama = value; } }, metadata: _metadata }, _grama_initializers, _grama_extraInitializers);
        __esDecorate(null, null, _fotoUrl_decorators, { kind: "field", name: "fotoUrl", static: false, private: false, access: { has: function (obj) { return "fotoUrl" in obj; }, get: function (obj) { return obj.fotoUrl; }, set: function (obj, value) { obj.fotoUrl = value; } }, metadata: _metadata }, _fotoUrl_initializers, _fotoUrl_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Estadio = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Estadio = _classThis;
}();
exports.Estadio = Estadio;
