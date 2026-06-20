"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogadoresResolver = void 0;
var graphql_1 = require("@nestjs/graphql");
var jogador_entity_1 = require("./entities/jogador.entity");
var common_1 = require("@nestjs/common");
var gql_auth_guard_1 = require("../auth/gql-auth.guard");
var equipe_entity_1 = require("../equipes/entities/equipe.entity");
var partida_entity_1 = require("../partidas/entities/partida.entity");
var JogadoresResolver = function () {
    var _classDecorators = [(0, graphql_1.Resolver)(function () { return jogador_entity_1.Jogador; })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _equipe_decorators;
    var _estatisticas_decorators;
    var _findAll_decorators;
    var _findAtivos_decorators;
    var _findOne_decorators;
    var _findPorClube_decorators;
    var _buscarTodasEquipes_decorators;
    var _importarMassaFM_decorators;
    var _atualizarJogadorAdmin_decorators;
    var JogadoresResolver = _classThis = /** @class */ (function () {
        function JogadoresResolver_1(jogadoresService, equipesService, prisma) {
            this.jogadoresService = (__runInitializers(this, _instanceExtraInitializers), jogadoresService);
            this.equipesService = equipesService;
            this.prisma = prisma;
        }
        JogadoresResolver_1.prototype.equipe = function (jogador) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!jogador.equipeId)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.equipesService.buscarPorId(jogador.equipeId)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        JogadoresResolver_1.prototype.estatisticas = function (jogador, take) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.estatisticaJogador.findMany({
                                where: { jogadorId: jogador.id },
                                take: take || 10,
                                orderBy: { partida: { dataHora: 'desc' } },
                                include: {
                                    partida: {
                                        include: {
                                            equipeCasa: true,
                                            equipeVisitante: true,
                                        },
                                    },
                                },
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        JogadoresResolver_1.prototype.findAll = function () {
            return this.jogadoresService.findAll();
        };
        JogadoresResolver_1.prototype.findAtivos = function () {
            return this.jogadoresService.findAtivos();
        };
        JogadoresResolver_1.prototype.findOne = function (id) {
            return this.jogadoresService.findOne(id);
        };
        JogadoresResolver_1.prototype.findPorClube = function (clube) {
            return this.jogadoresService.findPorClube(clube);
        };
        JogadoresResolver_1.prototype.buscarTodasEquipes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.jogadoresService.buscarEquipes()];
                });
            });
        };
        JogadoresResolver_1.prototype.importarMassaFM = function (nome, clube, posicao, dadosFM, alturaCm, dataNascimento, peDominante, fotoUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var atributosLimpos;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            atributosLimpos = __assign({}, dadosFM);
                            delete atributosLimpos.jogadorId;
                            return [4 /*yield*/, this.jogadoresService.importarJogadorCSV(nome, clube, posicao, atributosLimpos, alturaCm, dataNascimento, peDominante, fotoUrl)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        JogadoresResolver_1.prototype.atualizarJogadorAdmin = function (id, nomePopular, nomeCompleto, numeroCamisa, posicao, posicaoSecundaria, funcoes, peDominante, categoria, emprestado, tipoContrato, clubeEmprestimo, ativo, fotoUrl, equipeId, biografia, alturaCm, dataNascimento) {
            return __awaiter(this, void 0, void 0, function () {
                var dadosParaAtualizar, jogadorAtual;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dadosParaAtualizar = {};
                            // Construtor seguro: Campos obrigatórios (ignora null vindo do GraphQL para não quebrar o banco)
                            if (nomePopular)
                                dadosParaAtualizar.nomePopular = nomePopular;
                            if (nomeCompleto)
                                dadosParaAtualizar.nomeCompleto = nomeCompleto;
                            if (posicao)
                                dadosParaAtualizar.posicao = posicao;
                            if (categoria)
                                dadosParaAtualizar.categoria = categoria;
                            // Construtor seguro: Campos opcionais (permite enviar null para apagar o dado)
                            if (numeroCamisa !== undefined)
                                dadosParaAtualizar.numeroCamisa = numeroCamisa;
                            if (posicaoSecundaria !== undefined)
                                dadosParaAtualizar.posicaoSecundaria = posicaoSecundaria;
                            if (funcoes !== undefined)
                                dadosParaAtualizar.funcoes = funcoes;
                            if (peDominante !== undefined)
                                dadosParaAtualizar.peDominante = peDominante;
                            if (emprestado !== undefined)
                                dadosParaAtualizar.emprestado = emprestado;
                            if (tipoContrato !== undefined)
                                dadosParaAtualizar.tipoContrato = tipoContrato;
                            if (clubeEmprestimo !== undefined)
                                dadosParaAtualizar.clubeEmprestimo = clubeEmprestimo;
                            if (ativo !== undefined)
                                dadosParaAtualizar.ativo = ativo;
                            if (fotoUrl !== undefined)
                                dadosParaAtualizar.fotoUrl = fotoUrl;
                            if (biografia !== undefined)
                                dadosParaAtualizar.biografia = biografia;
                            if (alturaCm !== undefined)
                                dadosParaAtualizar.alturaCm = alturaCm;
                            if (dataNascimento !== undefined)
                                dadosParaAtualizar.dataNascimento = dataNascimento;
                            if (!(equipeId !== undefined)) return [3 /*break*/, 3];
                            if (!(equipeId === null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.jogadoresService.findOne(id)];
                        case 1:
                            jogadorAtual = _a.sent();
                            if (jogadorAtual && jogadorAtual.equipeId) {
                                dadosParaAtualizar.equipe = { disconnect: true };
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            dadosParaAtualizar.equipe = { connect: { id: equipeId } };
                            _a.label = 3;
                        case 3: return [2 /*return*/, this.jogadoresService.atualizarJogadorAdmin(id, dadosParaAtualizar)];
                    }
                });
            });
        };
        return JogadoresResolver_1;
    }());
    __setFunctionName(_classThis, "JogadoresResolver");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _equipe_decorators = [(0, graphql_1.ResolveField)(function () { return equipe_entity_1.Equipe; }, { nullable: true })];
        _estatisticas_decorators = [(0, graphql_1.ResolveField)(function () { return [partida_entity_1.EstatisticaJogador]; })];
        _findAll_decorators = [(0, graphql_1.Query)(function () { return [jogador_entity_1.Jogador]; }, { name: 'jogadores' })];
        _findAtivos_decorators = [(0, graphql_1.Query)(function () { return [jogador_entity_1.Jogador]; }, { name: 'jogadoresAtivos' })];
        _findOne_decorators = [(0, graphql_1.Query)(function () { return jogador_entity_1.Jogador; }, { name: 'jogador', nullable: true })];
        _findPorClube_decorators = [(0, graphql_1.Query)(function () { return [jogador_entity_1.Jogador]; }, { name: 'jogadoresPorClube' })];
        _buscarTodasEquipes_decorators = [(0, graphql_1.Query)(function () { return [equipe_entity_1.Equipe]; }, { name: 'equipes' })];
        _importarMassaFM_decorators = [(0, graphql_1.Mutation)(function () { return Boolean; })];
        _atualizarJogadorAdmin_decorators = [(0, graphql_1.Mutation)(function () { return jogador_entity_1.Jogador; }), (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard)];
        __esDecorate(_classThis, null, _equipe_decorators, { kind: "method", name: "equipe", static: false, private: false, access: { has: function (obj) { return "equipe" in obj; }, get: function (obj) { return obj.equipe; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _estatisticas_decorators, { kind: "method", name: "estatisticas", static: false, private: false, access: { has: function (obj) { return "estatisticas" in obj; }, get: function (obj) { return obj.estatisticas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAtivos_decorators, { kind: "method", name: "findAtivos", static: false, private: false, access: { has: function (obj) { return "findAtivos" in obj; }, get: function (obj) { return obj.findAtivos; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findPorClube_decorators, { kind: "method", name: "findPorClube", static: false, private: false, access: { has: function (obj) { return "findPorClube" in obj; }, get: function (obj) { return obj.findPorClube; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _buscarTodasEquipes_decorators, { kind: "method", name: "buscarTodasEquipes", static: false, private: false, access: { has: function (obj) { return "buscarTodasEquipes" in obj; }, get: function (obj) { return obj.buscarTodasEquipes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _importarMassaFM_decorators, { kind: "method", name: "importarMassaFM", static: false, private: false, access: { has: function (obj) { return "importarMassaFM" in obj; }, get: function (obj) { return obj.importarMassaFM; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _atualizarJogadorAdmin_decorators, { kind: "method", name: "atualizarJogadorAdmin", static: false, private: false, access: { has: function (obj) { return "atualizarJogadorAdmin" in obj; }, get: function (obj) { return obj.atualizarJogadorAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JogadoresResolver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JogadoresResolver = _classThis;
}();
exports.JogadoresResolver = JogadoresResolver;
