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
exports.AtualizarEscalacaoInput = exports.AtualizarEscalacaoJogadorInput = void 0;
var graphql_1 = require("@nestjs/graphql");
var AtualizarEscalacaoJogadorInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _estatisticaId_decorators;
    var _estatisticaId_initializers = [];
    var _estatisticaId_extraInitializers = [];
    var _titular_decorators;
    var _titular_initializers = [];
    var _titular_extraInitializers = [];
    var _posicaoPartida_decorators;
    var _posicaoPartida_initializers = [];
    var _posicaoPartida_extraInitializers = [];
    var _numeroCamisa_decorators;
    var _numeroCamisa_initializers = [];
    var _numeroCamisa_extraInitializers = [];
    var AtualizarEscalacaoJogadorInput = _classThis = /** @class */ (function () {
        function AtualizarEscalacaoJogadorInput_1() {
            this.estatisticaId = __runInitializers(this, _estatisticaId_initializers, void 0);
            this.titular = (__runInitializers(this, _estatisticaId_extraInitializers), __runInitializers(this, _titular_initializers, void 0));
            this.posicaoPartida = (__runInitializers(this, _titular_extraInitializers), __runInitializers(this, _posicaoPartida_initializers, void 0));
            this.numeroCamisa = (__runInitializers(this, _posicaoPartida_extraInitializers), __runInitializers(this, _numeroCamisa_initializers, void 0));
            __runInitializers(this, _numeroCamisa_extraInitializers);
        }
        return AtualizarEscalacaoJogadorInput_1;
    }());
    __setFunctionName(_classThis, "AtualizarEscalacaoJogadorInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _estatisticaId_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _titular_decorators = [(0, graphql_1.Field)(function () { return Boolean; })];
        _posicaoPartida_decorators = [(0, graphql_1.Field)(function () { return String; }, { nullable: true })];
        _numeroCamisa_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; }, { nullable: true })];
        __esDecorate(null, null, _estatisticaId_decorators, { kind: "field", name: "estatisticaId", static: false, private: false, access: { has: function (obj) { return "estatisticaId" in obj; }, get: function (obj) { return obj.estatisticaId; }, set: function (obj, value) { obj.estatisticaId = value; } }, metadata: _metadata }, _estatisticaId_initializers, _estatisticaId_extraInitializers);
        __esDecorate(null, null, _titular_decorators, { kind: "field", name: "titular", static: false, private: false, access: { has: function (obj) { return "titular" in obj; }, get: function (obj) { return obj.titular; }, set: function (obj, value) { obj.titular = value; } }, metadata: _metadata }, _titular_initializers, _titular_extraInitializers);
        __esDecorate(null, null, _posicaoPartida_decorators, { kind: "field", name: "posicaoPartida", static: false, private: false, access: { has: function (obj) { return "posicaoPartida" in obj; }, get: function (obj) { return obj.posicaoPartida; }, set: function (obj, value) { obj.posicaoPartida = value; } }, metadata: _metadata }, _posicaoPartida_initializers, _posicaoPartida_extraInitializers);
        __esDecorate(null, null, _numeroCamisa_decorators, { kind: "field", name: "numeroCamisa", static: false, private: false, access: { has: function (obj) { return "numeroCamisa" in obj; }, get: function (obj) { return obj.numeroCamisa; }, set: function (obj, value) { obj.numeroCamisa = value; } }, metadata: _metadata }, _numeroCamisa_initializers, _numeroCamisa_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AtualizarEscalacaoJogadorInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AtualizarEscalacaoJogadorInput = _classThis;
}();
exports.AtualizarEscalacaoJogadorInput = AtualizarEscalacaoJogadorInput;
var AtualizarEscalacaoInput = function () {
    var _classDecorators = [(0, graphql_1.InputType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _partidaId_decorators;
    var _partidaId_initializers = [];
    var _partidaId_extraInitializers = [];
    var _formacaoCasa_decorators;
    var _formacaoCasa_initializers = [];
    var _formacaoCasa_extraInitializers = [];
    var _formacaoVisitante_decorators;
    var _formacaoVisitante_initializers = [];
    var _formacaoVisitante_extraInitializers = [];
    var _jogadores_decorators;
    var _jogadores_initializers = [];
    var _jogadores_extraInitializers = [];
    var AtualizarEscalacaoInput = _classThis = /** @class */ (function () {
        function AtualizarEscalacaoInput_1() {
            this.partidaId = __runInitializers(this, _partidaId_initializers, void 0);
            this.formacaoCasa = (__runInitializers(this, _partidaId_extraInitializers), __runInitializers(this, _formacaoCasa_initializers, void 0));
            this.formacaoVisitante = (__runInitializers(this, _formacaoCasa_extraInitializers), __runInitializers(this, _formacaoVisitante_initializers, void 0));
            this.jogadores = (__runInitializers(this, _formacaoVisitante_extraInitializers), __runInitializers(this, _jogadores_initializers, void 0));
            __runInitializers(this, _jogadores_extraInitializers);
        }
        return AtualizarEscalacaoInput_1;
    }());
    __setFunctionName(_classThis, "AtualizarEscalacaoInput");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _partidaId_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _formacaoCasa_decorators = [(0, graphql_1.Field)(function () { return String; }, { nullable: true })];
        _formacaoVisitante_decorators = [(0, graphql_1.Field)(function () { return String; }, { nullable: true })];
        _jogadores_decorators = [(0, graphql_1.Field)(function () { return [AtualizarEscalacaoJogadorInput]; })];
        __esDecorate(null, null, _partidaId_decorators, { kind: "field", name: "partidaId", static: false, private: false, access: { has: function (obj) { return "partidaId" in obj; }, get: function (obj) { return obj.partidaId; }, set: function (obj, value) { obj.partidaId = value; } }, metadata: _metadata }, _partidaId_initializers, _partidaId_extraInitializers);
        __esDecorate(null, null, _formacaoCasa_decorators, { kind: "field", name: "formacaoCasa", static: false, private: false, access: { has: function (obj) { return "formacaoCasa" in obj; }, get: function (obj) { return obj.formacaoCasa; }, set: function (obj, value) { obj.formacaoCasa = value; } }, metadata: _metadata }, _formacaoCasa_initializers, _formacaoCasa_extraInitializers);
        __esDecorate(null, null, _formacaoVisitante_decorators, { kind: "field", name: "formacaoVisitante", static: false, private: false, access: { has: function (obj) { return "formacaoVisitante" in obj; }, get: function (obj) { return obj.formacaoVisitante; }, set: function (obj, value) { obj.formacaoVisitante = value; } }, metadata: _metadata }, _formacaoVisitante_initializers, _formacaoVisitante_extraInitializers);
        __esDecorate(null, null, _jogadores_decorators, { kind: "field", name: "jogadores", static: false, private: false, access: { has: function (obj) { return "jogadores" in obj; }, get: function (obj) { return obj.jogadores; }, set: function (obj, value) { obj.jogadores = value; } }, metadata: _metadata }, _jogadores_initializers, _jogadores_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AtualizarEscalacaoInput = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AtualizarEscalacaoInput = _classThis;
}();
exports.AtualizarEscalacaoInput = AtualizarEscalacaoInput;
