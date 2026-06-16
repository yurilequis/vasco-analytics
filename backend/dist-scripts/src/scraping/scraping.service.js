"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ScrapingService = void 0;
var common_1 = require("@nestjs/common");
var child_process_1 = require("child_process");
var util_1 = require("util");
var path = __importStar(require("path"));
var execAsync = (0, util_1.promisify)(child_process_1.exec);
var ScrapingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScrapingService = _classThis = /** @class */ (function () {
        // private readonly API_VASCO_URL = 'http://127.0.0.1:8000/api/v1/vasco';
        function ScrapingService_1(prisma, partidasService) {
            this.prisma = prisma;
            this.partidasService = partidasService;
            this.logger = new common_1.Logger(ScrapingService.name);
        }
        ScrapingService_1.prototype.runPythonScraper = function (command, arg) {
            return __awaiter(this, void 0, void 0, function () {
                var venvPath, scriptPath, execCmd, stdout, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            venvPath = path.join(process.cwd(), 'python_venv', 'Scripts', 'python.exe');
                            scriptPath = path.join(process.cwd(), 'src', 'scraping', 'python_scripts', 'sofascore.py');
                            execCmd = "\"".concat(venvPath, "\" \"").concat(scriptPath, "\" ").concat(command);
                            if (arg) {
                                execCmd += " ".concat(arg);
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, execAsync(execCmd)];
                        case 2:
                            stdout = (_a.sent()).stdout;
                            return [2 /*return*/, JSON.parse(stdout)];
                        case 3:
                            error_1 = _a.sent();
                            this.logger.error("Erro ao executar scraper Python para ".concat(command), error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ScrapingService_1.prototype.scrapePartidas = function () {
            return __awaiter(this, void 0, void 0, function () {
                var respostaJogos, jogos, _i, jogos_1, jogo, detalhes, respostaDetalhes, _a, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.log('Iniciando sincronização completa de partidas via Python local...');
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 12, , 13]);
                            return [4 /*yield*/, this.runPythonScraper('jogos')];
                        case 2:
                            respostaJogos = _b.sent();
                            if (respostaJogos.erro) {
                                this.logger.error(respostaJogos.erro);
                                return [2 /*return*/];
                            }
                            jogos = respostaJogos.dados;
                            _i = 0, jogos_1 = jogos;
                            _b.label = 3;
                        case 3:
                            if (!(_i < jogos_1.length)) return [3 /*break*/, 11];
                            jogo = jogos_1[_i];
                            detalhes = null;
                            if (!(jogo.status === 'Encerrada' && jogo.event_id)) return [3 /*break*/, 7];
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, this.runPythonScraper('detalhes', jogo.event_id.toString())];
                        case 5:
                            respostaDetalhes = _b.sent();
                            if (!respostaDetalhes.erro) {
                                detalhes = respostaDetalhes;
                            }
                            else {
                                this.logger.warn("Erro retornado do Python: ".concat(respostaDetalhes.erro));
                            }
                            return [3 /*break*/, 7];
                        case 6:
                            _a = _b.sent();
                            this.logger.warn("Detalhes n\u00E3o dispon\u00EDveis para o jogo ID ".concat(jogo.event_id));
                            return [3 /*break*/, 7];
                        case 7: return [4 /*yield*/, this.partidasService.sincronizarPartidaCompleta(jogo, detalhes)];
                        case 8:
                            _b.sent();
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 3];
                        case 11:
                            this.logger.log('Sincronização de partidas concluída!');
                            return [3 /*break*/, 13];
                        case 12:
                            error_2 = _b.sent();
                            this.logger.error('Erro ao sincronizar partidas', error_2);
                            return [3 /*break*/, 13];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        ScrapingService_1.prototype.scrapeElenco = function () {
            return __awaiter(this, void 0, void 0, function () {
                var equipe, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            this.logger.warn('scrapeElenco via Python ainda não migrado. Precisa do script para Elenco.');
                            return [4 /*yield*/, this.upsertEquipe('Vasco')];
                        case 1:
                            equipe = _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error('Erro ao buscar elenco', error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Métodos que apenas logam (não precisam ser async/await)
        ScrapingService_1.prototype.scrapeTodasEstatisticas = function () {
            this.logger.log('Sincronização de estatísticas delegada para scrapePartidas.');
        };
        ScrapingService_1.prototype.scrapeDetalhesPartidas = function () {
            this.logger.log('Sincronização de detalhes delegada para scrapePartidas.');
        };
        ScrapingService_1.prototype.upsertEquipe = function (nome) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.equipe.upsert({
                            where: { nome: nome },
                            update: {},
                            create: { nome: nome, nomeCurto: nome.substring(0, 3).toUpperCase() },
                        })];
                });
            });
        };
        ScrapingService_1.prototype.rasparClassificacao = function (competicaoId) {
            return __awaiter(this, void 0, void 0, function () {
                var res, linhas, _i, linhas_1, linha, equipe, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 7, , 8]);
                            this.logger.log("Buscando classifica\u00E7\u00E3o para competicaoId=".concat(competicaoId));
                            return [4 /*yield*/, this.runPythonScraper('classificacao 325 87678')];
                        case 1:
                            res = _a.sent();
                            if (!res || !res.dados) {
                                this.logger.error('Nenhum dado de classificação retornado.');
                                return [2 /*return*/];
                            }
                            linhas = res.dados;
                            _i = 0, linhas_1 = linhas;
                            _a.label = 2;
                        case 2:
                            if (!(_i < linhas_1.length)) return [3 /*break*/, 6];
                            linha = linhas_1[_i];
                            return [4 /*yield*/, this.upsertEquipe(linha.equipe_nome)];
                        case 3:
                            equipe = _a.sent();
                            return [4 /*yield*/, this.prisma.classificacaoEquipe.upsert({
                                    where: {
                                        competicaoId_equipeId: {
                                            competicaoId: competicaoId,
                                            equipeId: equipe.id,
                                        },
                                    },
                                    update: {
                                        posicao: linha.posicao,
                                        pontos: linha.pontos,
                                        jogos: linha.jogos,
                                        vitorias: linha.vitorias,
                                        empates: linha.empates,
                                        derrotas: linha.derrotas,
                                        golsPro: linha.gols_pro,
                                        golsContra: linha.gols_contra,
                                        saldoGols: linha.saldo_gols,
                                    },
                                    create: {
                                        competicaoId: competicaoId,
                                        equipeId: equipe.id,
                                        posicao: linha.posicao,
                                        pontos: linha.pontos,
                                        jogos: linha.jogos,
                                        vitorias: linha.vitorias,
                                        empates: linha.empates,
                                        derrotas: linha.derrotas,
                                        golsPro: linha.gols_pro,
                                        golsContra: linha.gols_contra,
                                        saldoGols: linha.saldo_gols,
                                    },
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6:
                            this.logger.log('Classificação atualizada com sucesso.');
                            return [3 /*break*/, 8];
                        case 7:
                            error_4 = _a.sent();
                            this.logger.error('Erro ao raspar classificação', error_4);
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        return ScrapingService_1;
    }());
    __setFunctionName(_classThis, "ScrapingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScrapingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScrapingService = _classThis;
}();
exports.ScrapingService = ScrapingService;
