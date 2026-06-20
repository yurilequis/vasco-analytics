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
exports.Equipe = void 0;
var graphql_1 = require("@nestjs/graphql");
var Equipe = function () {
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
    var _nomeCurto_decorators;
    var _nomeCurto_initializers = [];
    var _nomeCurto_extraInitializers = [];
    var _sigla_decorators;
    var _sigla_initializers = [];
    var _sigla_extraInitializers = [];
    var _cidade_decorators;
    var _cidade_initializers = [];
    var _cidade_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _pais_decorators;
    var _pais_initializers = [];
    var _pais_extraInitializers = [];
    var _fundacao_decorators;
    var _fundacao_initializers = [];
    var _fundacao_extraInitializers = [];
    var _escudoUrl_decorators;
    var _escudoUrl_initializers = [];
    var _escudoUrl_extraInitializers = [];
    var _criadoEm_decorators;
    var _criadoEm_initializers = [];
    var _criadoEm_extraInitializers = [];
    var Equipe = _classThis = /** @class */ (function () {
        function Equipe_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nome = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nome_initializers, void 0));
            this.nomeCurto = (__runInitializers(this, _nome_extraInitializers), __runInitializers(this, _nomeCurto_initializers, void 0));
            this.sigla = (__runInitializers(this, _nomeCurto_extraInitializers), __runInitializers(this, _sigla_initializers, void 0));
            this.cidade = (__runInitializers(this, _sigla_extraInitializers), __runInitializers(this, _cidade_initializers, void 0));
            this.estado = (__runInitializers(this, _cidade_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
            this.pais = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _pais_initializers, void 0));
            this.fundacao = (__runInitializers(this, _pais_extraInitializers), __runInitializers(this, _fundacao_initializers, void 0));
            this.escudoUrl = (__runInitializers(this, _fundacao_extraInitializers), __runInitializers(this, _escudoUrl_initializers, void 0));
            this.criadoEm = (__runInitializers(this, _escudoUrl_extraInitializers), __runInitializers(this, _criadoEm_initializers, void 0));
            __runInitializers(this, _criadoEm_extraInitializers);
        }
        return Equipe_1;
    }());
    __setFunctionName(_classThis, "Equipe");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _nome_decorators = [(0, graphql_1.Field)()];
        _nomeCurto_decorators = [(0, graphql_1.Field)()];
        _sigla_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _cidade_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _estado_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _pais_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _fundacao_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _escudoUrl_decorators = [(0, graphql_1.Field)({ nullable: true })];
        _criadoEm_decorators = [(0, graphql_1.Field)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nome_decorators, { kind: "field", name: "nome", static: false, private: false, access: { has: function (obj) { return "nome" in obj; }, get: function (obj) { return obj.nome; }, set: function (obj, value) { obj.nome = value; } }, metadata: _metadata }, _nome_initializers, _nome_extraInitializers);
        __esDecorate(null, null, _nomeCurto_decorators, { kind: "field", name: "nomeCurto", static: false, private: false, access: { has: function (obj) { return "nomeCurto" in obj; }, get: function (obj) { return obj.nomeCurto; }, set: function (obj, value) { obj.nomeCurto = value; } }, metadata: _metadata }, _nomeCurto_initializers, _nomeCurto_extraInitializers);
        __esDecorate(null, null, _sigla_decorators, { kind: "field", name: "sigla", static: false, private: false, access: { has: function (obj) { return "sigla" in obj; }, get: function (obj) { return obj.sigla; }, set: function (obj, value) { obj.sigla = value; } }, metadata: _metadata }, _sigla_initializers, _sigla_extraInitializers);
        __esDecorate(null, null, _cidade_decorators, { kind: "field", name: "cidade", static: false, private: false, access: { has: function (obj) { return "cidade" in obj; }, get: function (obj) { return obj.cidade; }, set: function (obj, value) { obj.cidade = value; } }, metadata: _metadata }, _cidade_initializers, _cidade_extraInitializers);
        __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
        __esDecorate(null, null, _pais_decorators, { kind: "field", name: "pais", static: false, private: false, access: { has: function (obj) { return "pais" in obj; }, get: function (obj) { return obj.pais; }, set: function (obj, value) { obj.pais = value; } }, metadata: _metadata }, _pais_initializers, _pais_extraInitializers);
        __esDecorate(null, null, _fundacao_decorators, { kind: "field", name: "fundacao", static: false, private: false, access: { has: function (obj) { return "fundacao" in obj; }, get: function (obj) { return obj.fundacao; }, set: function (obj, value) { obj.fundacao = value; } }, metadata: _metadata }, _fundacao_initializers, _fundacao_extraInitializers);
        __esDecorate(null, null, _escudoUrl_decorators, { kind: "field", name: "escudoUrl", static: false, private: false, access: { has: function (obj) { return "escudoUrl" in obj; }, get: function (obj) { return obj.escudoUrl; }, set: function (obj, value) { obj.escudoUrl = value; } }, metadata: _metadata }, _escudoUrl_initializers, _escudoUrl_extraInitializers);
        __esDecorate(null, null, _criadoEm_decorators, { kind: "field", name: "criadoEm", static: false, private: false, access: { has: function (obj) { return "criadoEm" in obj; }, get: function (obj) { return obj.criadoEm; }, set: function (obj, value) { obj.criadoEm = value; } }, metadata: _metadata }, _criadoEm_initializers, _criadoEm_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Equipe = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Equipe = _classThis;
}();
exports.Equipe = Equipe;
