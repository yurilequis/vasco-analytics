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
exports.PartidasService = void 0;
var common_1 = require("@nestjs/common");
var PartidasService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PartidasService = _classThis = /** @class */ (function () {
        function PartidasService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(PartidasService.name);
            this.ALIAS_EQUIPES = {
                'athletico': 'athletico paranaense',
                'athletico-pr': 'athletico paranaense',
                'atletico mineiro': 'atletico-mg',
                'atletico-pr': 'athletico paranaense',
                'operario': 'operario-pr',
                'operario ferroviario': 'operario-pr',
                'paysandu sc': 'paysandu',
                'sport recife': 'sport',
                'vasco da gama': 'vasco',
            };
        }
        PartidasService_1.prototype.normalizarNomeTime = function (nome) {
            var n = nome
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .replace(/^(sc|fc|se|cr|clube|esporte|sociedade|associacao|gr|gremio)\s+/g, '')
                .replace(/\s+(sc|fc|mg|rj|sp|rs|pr|ba|pa|sc)$/g, '')
                .replace(/-/g, ' ') // replace dashes with spaces to normalize "atletico-mg" to "atletico mg"
                .replace(/\s+/g, ' ')
                .trim();
            // Reverse lookup or direct lookup from ALIAS
            // First, check if the original name or basic normalized name matches an alias
            var basicNorm = n;
            if (this.ALIAS_EQUIPES[basicNorm]) {
                n = this.ALIAS_EQUIPES[basicNorm].replace(/-/g, ' ');
            }
            return n.trim();
        };
        PartidasService_1.prototype.compararNomesInteligente = function (nomeSofascore, jogadorBanco) {
            var limpar = function (n) {
                return n
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase()
                    .trim();
            };
            var sName = limpar(nomeSofascore);
            var bPop = limpar(jogadorBanco.nomePopular);
            var bFull = limpar(jogadorBanco.nomeCompleto);
            // Hardcoded Aliases (Traduções Específicas Sofascore -> Banco de Dados)
            if ((sName === 'j. silva' || sName === 'joao vitor silva') && bPop === 'mutano') {
                return true;
            }
            // 1. Match Exato ou Contém
            if (sName === bPop || sName === bFull || bFull.includes(sName)) {
                return true;
            }
            // 2. Lógica de Abreviação (ex: "L. Freitas" vs "Lucas Freitas")
            if (sName.includes('.')) {
                var partesSofa = sName.split(/\s+/);
                if (partesSofa.length >= 2) {
                    var sobrenomeSofa = partesSofa[partesSofa.length - 1];
                    var inicialSofa = partesSofa[0].replace('.', '');
                    // Tenta match com nome popular
                    var partesPop = bPop.split(/\s+/);
                    var sobrenomePop = partesPop[partesPop.length - 1];
                    var inicialPop = partesPop[0][0];
                    if (sobrenomeSofa === sobrenomePop && inicialSofa === inicialPop) {
                        return true;
                    }
                    // Tenta match com nome completo
                    var partesFull = bFull.split(/\s+/);
                    var sobrenomeFull = partesFull[partesFull.length - 1];
                    var inicialFull = partesFull[0][0];
                    if (sobrenomeSofa === sobrenomeFull && inicialSofa === inicialFull) {
                        return true;
                    }
                }
            }
            // 3. Match de sobrenome único se for muito específico
            if (!sName.includes(' ') &&
                (bPop.startsWith(sName) || bFull.startsWith(sName))) {
                return true;
            }
            return false;
        };
        PartidasService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.partida.findMany({
                                orderBy: { dataHora: 'desc' },
                                include: {
                                    competicao: {
                                        include: {
                                            classificacao: {
                                                include: { equipe: true },
                                                orderBy: { posicao: 'asc' },
                                            },
                                        },
                                    },
                                    equipeCasa: true,
                                    equipeVisitante: true,
                                    estadio: true,
                                    arbitro: true,
                                    treinadorCasa: true,
                                    treinadorVisitante: true,
                                    estatisticasEquipes: true,
                                    eventos: {
                                        orderBy: { minuto: 'asc' },
                                    },
                                    estatisticasJogadores: {
                                        include: { jogador: true },
                                    },
                                },
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        PartidasService_1.prototype.findByEquipe = function (equipeId) {
            return this.prisma.partida.findMany({
                where: {
                    OR: [{ equipeCasaId: equipeId }, { equipeVisitanteId: equipeId }],
                },
                orderBy: { dataHora: 'desc' },
                include: {
                    equipeCasa: true,
                    equipeVisitante: true,
                    estadio: true,
                    arbitro: true,
                    competicao: true,
                },
            });
        };
        PartidasService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.partida.findUnique({
                            where: { id: id },
                            include: {
                                competicao: {
                                    include: {
                                        classificacao: {
                                            include: { equipe: true },
                                            orderBy: { posicao: 'asc' },
                                        },
                                    },
                                },
                                equipeCasa: true,
                                equipeVisitante: true,
                                estadio: true,
                                arbitro: true,
                                treinadorCasa: true,
                                treinadorVisitante: true,
                                estatisticasEquipes: true,
                                eventos: { include: { jogador: true } },
                                estatisticasJogadores: { include: { jogador: true } },
                            },
                        })];
                });
            });
        };
        // --- O MOTOR DE INGESTÃO COM CRUZAMENTO DE DADOS ---
        PartidasService_1.prototype.sincronizarPartidaCompleta = function (jogoBasico, detalhes) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var competicao, buscarOuCriarEquipe, equipeCasa, equipeVisitante, estadioId, nomeEstadio, estadio, arbitroId, nomeArbitro, arbitro, dataHoraObj, partida, mapaSofascoreDb, _i, _a, ev, equipeEventoId, jogadorIdDb, jogadorSecIdDb, _b, mandante, visitante, processarStats;
                            var _this = this;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        this.logger.log("Sincronizando partida: ".concat(jogoBasico.mandante, " x ").concat(jogoBasico.visitante));
                                        return [4 /*yield*/, tx.competicao.upsert({
                                                where: {
                                                    nome_temporada: { nome: jogoBasico.campeonato, temporada: '2026' },
                                                },
                                                update: {},
                                                create: { nome: jogoBasico.campeonato, temporada: '2026' },
                                            })];
                                    case 1:
                                        competicao = _c.sent();
                                        buscarOuCriarEquipe = function (nomeOriginal) { return __awaiter(_this, void 0, void 0, function () {
                                            var nomeNorm, todasEquipes, existe;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        nomeNorm = this.normalizarNomeTime(nomeOriginal);
                                                        return [4 /*yield*/, tx.equipe.findMany()];
                                                    case 1:
                                                        todasEquipes = _a.sent();
                                                        existe = todasEquipes.find(function (e) { return _this.normalizarNomeTime(e.nome) === nomeNorm; });
                                                        if (existe)
                                                            return [2 /*return*/, existe];
                                                        return [2 /*return*/, tx.equipe.create({
                                                                data: {
                                                                    nome: nomeOriginal,
                                                                    nomeCurto: nomeOriginal.substring(0, 3).toUpperCase(),
                                                                },
                                                            })];
                                                }
                                            });
                                        }); };
                                        return [4 /*yield*/, buscarOuCriarEquipe(jogoBasico.mandante)];
                                    case 2:
                                        equipeCasa = _c.sent();
                                        return [4 /*yield*/, buscarOuCriarEquipe(jogoBasico.visitante)];
                                    case 3:
                                        equipeVisitante = _c.sent();
                                        estadioId = null;
                                        if (!(detalhes === null || detalhes === void 0 ? void 0 : detalhes.estadio)) return [3 /*break*/, 7];
                                        nomeEstadio = detalhes.estadio;
                                        return [4 /*yield*/, tx.estadio.findFirst({
                                                where: { nome: nomeEstadio },
                                            })];
                                    case 4:
                                        estadio = _c.sent();
                                        if (!!estadio) return [3 /*break*/, 6];
                                        return [4 /*yield*/, tx.estadio.create({
                                                data: { nome: nomeEstadio, cidade: 'Desconhecida' },
                                            })];
                                    case 5:
                                        estadio = _c.sent();
                                        _c.label = 6;
                                    case 6:
                                        estadioId = estadio.id;
                                        _c.label = 7;
                                    case 7:
                                        arbitroId = null;
                                        if (!(detalhes === null || detalhes === void 0 ? void 0 : detalhes.arbitro)) return [3 /*break*/, 11];
                                        nomeArbitro = detalhes.arbitro;
                                        return [4 /*yield*/, tx.arbitro.findFirst({
                                                where: { nomePopular: nomeArbitro },
                                            })];
                                    case 8:
                                        arbitro = _c.sent();
                                        if (!!arbitro) return [3 /*break*/, 10];
                                        return [4 /*yield*/, tx.arbitro.create({
                                                data: { nomeCompleto: nomeArbitro, nomePopular: nomeArbitro },
                                            })];
                                    case 9:
                                        arbitro = _c.sent();
                                        _c.label = 10;
                                    case 10:
                                        arbitroId = arbitro.id;
                                        _c.label = 11;
                                    case 11:
                                        dataHoraObj = this.parsarData(jogoBasico.data_partida);
                                        return [4 /*yield*/, tx.partida.upsert({
                                                where: {
                                                    equipeCasaId_equipeVisitanteId_dataHora: {
                                                        equipeCasaId: equipeCasa.id,
                                                        equipeVisitanteId: equipeVisitante.id,
                                                        dataHora: dataHoraObj,
                                                    },
                                                },
                                                update: {
                                                    golsCasa: jogoBasico.gols_mandante,
                                                    golsVisitante: jogoBasico.gols_visitante,
                                                    status: jogoBasico.status === 'Encerrada' ? 'encerrada' : 'agendada',
                                                    estadioId: estadioId,
                                                    arbitroId: arbitroId,
                                                },
                                                create: {
                                                    competicaoId: competicao.id,
                                                    equipeCasaId: equipeCasa.id,
                                                    equipeVisitanteId: equipeVisitante.id,
                                                    dataHora: dataHoraObj,
                                                    golsCasa: jogoBasico.gols_mandante,
                                                    golsVisitante: jogoBasico.gols_visitante,
                                                    status: jogoBasico.status === 'Encerrada' ? 'encerrada' : 'agendada',
                                                    eventId: jogoBasico.event_id,
                                                    estadioId: estadioId,
                                                    arbitroId: arbitroId,
                                                },
                                            })];
                                    case 12:
                                        partida = _c.sent();
                                        mapaSofascoreDb = new Map();
                                        if (!(detalhes === null || detalhes === void 0 ? void 0 : detalhes.escalacoes)) return [3 /*break*/, 15];
                                        return [4 /*yield*/, this.processarElenco(tx, partida.id, equipeCasa.id, detalhes.escalacoes.mandante, mapaSofascoreDb, detalhes.linha_do_tempo)];
                                    case 13:
                                        _c.sent();
                                        return [4 /*yield*/, this.processarElenco(tx, partida.id, equipeVisitante.id, detalhes.escalacoes.visitante, mapaSofascoreDb, detalhes.linha_do_tempo)];
                                    case 14:
                                        _c.sent();
                                        _c.label = 15;
                                    case 15:
                                        if (!(detalhes === null || detalhes === void 0 ? void 0 : detalhes.linha_do_tempo)) return [3 /*break*/, 20];
                                        return [4 /*yield*/, tx.eventoPartida.deleteMany({ where: { partidaId: partida.id } })];
                                    case 16:
                                        _c.sent();
                                        _i = 0, _a = detalhes.linha_do_tempo;
                                        _c.label = 17;
                                    case 17:
                                        if (!(_i < _a.length)) return [3 /*break*/, 20];
                                        ev = _a[_i];
                                        equipeEventoId = ev.is_mandante
                                            ? equipeCasa.id
                                            : equipeVisitante.id;
                                        jogadorIdDb = ev.jogador_principal_id
                                            ? mapaSofascoreDb.get(ev.jogador_principal_id) || null
                                            : null;
                                        jogadorSecIdDb = ev.jogador_secundario_id
                                            ? mapaSofascoreDb.get(ev.jogador_secundario_id) || null
                                            : null;
                                        return [4 /*yield*/, tx.eventoPartida.create({
                                                data: {
                                                    partidaId: partida.id,
                                                    equipeId: equipeEventoId,
                                                    minuto: ev.minuto,
                                                    minutoAcrescimo: ev.acrescimo || 0,
                                                    tipoEvento: ev.tipo,
                                                    descricao: ev.descricao,
                                                    jogadorId: jogadorIdDb,
                                                    jogadorSecundarioId: jogadorSecIdDb,
                                                },
                                            })];
                                    case 18:
                                        _c.sent();
                                        _c.label = 19;
                                    case 19:
                                        _i++;
                                        return [3 /*break*/, 17];
                                    case 20:
                                        if (!(detalhes === null || detalhes === void 0 ? void 0 : detalhes.estatisticas_equipes)) return [3 /*break*/, 23];
                                        _b = detalhes.estatisticas_equipes, mandante = _b.mandante, visitante = _b.visitante;
                                        processarStats = function (stats, equipeId) { return __awaiter(_this, void 0, void 0, function () {
                                            var parseStat;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        parseStat = function (val) {
                                                            if (typeof val === 'string' && val.includes('%')) {
                                                                return parseFloat(val.replace('%', ''));
                                                            }
                                                            return parseInt(val) || 0;
                                                        };
                                                        return [4 /*yield*/, tx.estatisticaEquipe.upsert({
                                                                where: { partidaId_equipeId: { partidaId: partida.id, equipeId: equipeId } },
                                                                update: {
                                                                    posseBola: parseStat(stats['Ball possession']),
                                                                    xG: parseFloat(stats['Expected goals']) || 0,
                                                                    grandesChances: parseStat(stats['Big chances']) || (parseStat(stats['Big chances scored']) + parseStat(stats['Big chances missed'])),
                                                                    chutes: parseStat(stats['Total shots']),
                                                                    chutesGol: parseStat(stats['Shots on target']),
                                                                    chutesFora: parseStat(stats['Shots off target']),
                                                                    chutesNaTrave: parseStat(stats['Hit woodwork']),
                                                                    defesasGoleiro: parseStat(stats['Goalkeeper saves']),
                                                                    escanteios: parseStat(stats['Corner kicks']),
                                                                    faltas: parseStat(stats['Fouls']),
                                                                    impedimentos: parseStat(stats['Offsides']),
                                                                    passesTentados: parseStat(stats['Total passes'] || stats['Passes']),
                                                                    passesCompletos: parseStat(stats['Accurate passes']),
                                                                    cartoesAmarelos: parseStat(stats['Yellow cards']),
                                                                    cartoesVermelhos: parseStat(stats['Red cards']),
                                                                },
                                                                create: {
                                                                    partidaId: partida.id,
                                                                    equipeId: equipeId,
                                                                    posseBola: parseStat(stats['Ball possession']),
                                                                    xG: parseFloat(stats['Expected goals']) || 0,
                                                                    grandesChances: parseStat(stats['Big chances']) || (parseStat(stats['Big chances scored']) + parseStat(stats['Big chances missed'])),
                                                                    chutes: parseStat(stats['Total shots']),
                                                                    chutesGol: parseStat(stats['Shots on target']),
                                                                    chutesFora: parseStat(stats['Shots off target']),
                                                                    chutesNaTrave: parseStat(stats['Hit woodwork']),
                                                                    defesasGoleiro: parseStat(stats['Goalkeeper saves']),
                                                                    escanteios: parseStat(stats['Corner kicks']),
                                                                    faltas: parseStat(stats['Fouls']),
                                                                    impedimentos: parseStat(stats['Offsides']),
                                                                    passesTentados: parseStat(stats['Total passes'] || stats['Passes']),
                                                                    passesCompletos: parseStat(stats['Accurate passes']),
                                                                    cartoesAmarelos: parseStat(stats['Yellow cards']),
                                                                    cartoesVermelhos: parseStat(stats['Red cards']),
                                                                },
                                                            })];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                        return [4 /*yield*/, processarStats(mandante, equipeCasa.id)];
                                    case 21:
                                        _c.sent();
                                        return [4 /*yield*/, processarStats(visitante, equipeVisitante.id)];
                                    case 22:
                                        _c.sent();
                                        _c.label = 23;
                                    case 23: return [2 /*return*/, partida];
                                }
                            });
                        }); })];
                });
            });
        };
        PartidasService_1.prototype.processarElenco = function (tx, partidaId, equipeId, escalacao, mapaSofascoreDb, linha_do_tempo) {
            return __awaiter(this, void 0, void 0, function () {
                var jogadoresExistentes, todosJogadores, _loop_1, this_1, _i, escalacao_1, j;
                var _this = this;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            if (!escalacao || escalacao.length === 0)
                                return [2 /*return*/];
                            return [4 /*yield*/, tx.jogador.findMany({
                                    where: { equipeId: equipeId },
                                })];
                        case 1:
                            jogadoresExistentes = _e.sent();
                            return [4 /*yield*/, tx.jogador.findMany()];
                        case 2:
                            todosJogadores = _e.sent();
                            _loop_1 = function (j) {
                                var jogadorLocal, jogadorIdFinal, novoJogador, golsNaTimeline, assistsNaTimeline, cartoesAmarelosTimeline, cartoesVermelhosTimeline, golsFinais, assistsFinais;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            jogadorLocal = jogadoresExistentes.find(function (dbPlayer) {
                                                return _this.compararNomesInteligente(j.nome_popular, {
                                                    nomePopular: dbPlayer.nomePopular,
                                                    nomeCompleto: dbPlayer.nomeCompleto,
                                                });
                                            });
                                            // Fallback forte: se não achar no time atual, busca em todos os times apenas se o nome COMPLETO for exato.
                                            // Isso evita duplicar jogadores que estão emprestados (ex: G. Estrella jogando por outro time)
                                            if (!jogadorLocal && j.nome_completo) {
                                                jogadorLocal = todosJogadores.find(function (dbPlayer) {
                                                    return dbPlayer.nomeCompleto.toLowerCase().trim() === j.nome_completo.toLowerCase().trim();
                                                });
                                                if (jogadorLocal) {
                                                    this_1.logger.log("Encontrado jogador de outra equipe via nome completo exato: ".concat(j.nome_completo, ". Reutilizando ID ").concat(jogadorLocal.id));
                                                }
                                            }
                                            jogadorIdFinal = void 0;
                                            if (!!jogadorLocal) return [3 /*break*/, 2];
                                            this_1.logger.log("Jogador ".concat(j.nome_popular, " n\u00E3o encontrado. Criando registro (Equipe ID: ").concat(equipeId, ")."));
                                            return [4 /*yield*/, tx.jogador.create({
                                                    data: {
                                                        nomePopular: j.nome_popular,
                                                        nomeCompleto: j.nome_completo,
                                                        equipeId: equipeId,
                                                        posicao: j.posicao_geral,
                                                        numeroCamisa: j.numero_camisa,
                                                        origem: 'Scraping',
                                                        ativo: false, // Prevents past players from polluting the active roster
                                                    },
                                                })];
                                        case 1:
                                            novoJogador = _f.sent();
                                            mapaSofascoreDb.set(j.sofascore_id, novoJogador.id);
                                            jogadorIdFinal = novoJogador.id;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            this_1.logger.log("\u2705 Match Inteligente: ".concat(j.nome_popular, " -> ").concat(jogadorLocal.nomePopular));
                                            mapaSofascoreDb.set(j.sofascore_id, jogadorLocal.id);
                                            jogadorIdFinal = jogadorLocal.id;
                                            _f.label = 3;
                                        case 3:
                                            golsNaTimeline = (linha_do_tempo === null || linha_do_tempo === void 0 ? void 0 : linha_do_tempo.filter(function (ev) {
                                                return ev.tipo === 'GOAL' && ev.jogador_principal_id === j.sofascore_id;
                                            }).length) || 0;
                                            assistsNaTimeline = (linha_do_tempo === null || linha_do_tempo === void 0 ? void 0 : linha_do_tempo.filter(function (ev) {
                                                return ev.tipo === 'GOAL' && ev.jogador_secundario_id === j.sofascore_id;
                                            }).length) || 0;
                                            cartoesAmarelosTimeline = (linha_do_tempo === null || linha_do_tempo === void 0 ? void 0 : linha_do_tempo.filter(function (ev) {
                                                var _a, _b;
                                                return ev.tipo === 'CARD' &&
                                                    ev.jogador_principal_id === j.sofascore_id &&
                                                    !(((_a = ev.descricao) === null || _a === void 0 ? void 0 : _a.toUpperCase().includes('RED')) ||
                                                        ((_b = ev.descricao) === null || _b === void 0 ? void 0 : _b.toUpperCase().includes('VERMELHO')));
                                            }).length) || 0;
                                            cartoesVermelhosTimeline = (linha_do_tempo === null || linha_do_tempo === void 0 ? void 0 : linha_do_tempo.filter(function (ev) {
                                                var _a, _b;
                                                return ev.tipo === 'CARD' &&
                                                    ev.jogador_principal_id === j.sofascore_id &&
                                                    (((_a = ev.descricao) === null || _a === void 0 ? void 0 : _a.toUpperCase().includes('RED')) ||
                                                        ((_b = ev.descricao) === null || _b === void 0 ? void 0 : _b.toUpperCase().includes('VERMELHO')));
                                            }).length) || 0;
                                            golsFinais = Math.max(j.gols || 0, golsNaTimeline);
                                            assistsFinais = Math.max(j.assistencias || 0, assistsNaTimeline);
                                            return [4 /*yield*/, tx.estatisticaJogador.upsert({
                                                    where: {
                                                        partidaId_jogadorId: { partidaId: partidaId, jogadorId: jogadorIdFinal },
                                                    },
                                                    update: {
                                                        titular: j.titular,
                                                        minutosJogados: j.minutos_jogados,
                                                        notaDesempenho: j.nota,
                                                        gols: golsFinais,
                                                        assistencias: assistsFinais,
                                                        cartoesAmarelos: cartoesAmarelosTimeline,
                                                        cartoesVermelhos: cartoesVermelhosTimeline,
                                                        chutes: j.chutes,
                                                        chutesGol: j.chutes_gol,
                                                        passesTentados: j.passes_tentados,
                                                        passesCompletos: j.passes_completos,
                                                        driblesTentados: j.dribles_tentados,
                                                        driblesCompletos: j.dribles_completos,
                                                        desarmes: j.desarmes,
                                                        interceptacoes: j.interceptacoes,
                                                        faltasCometidas: j.faltas_cometidas,
                                                        faltasSofridas: j.faltas_sofridas,
                                                        posicaoMediaX: ((_a = j.posicao_media) === null || _a === void 0 ? void 0 : _a.x) || null,
                                                        posicaoMediaY: ((_b = j.posicao_media) === null || _b === void 0 ? void 0 : _b.y) || null,
                                                        heatmapUrl: j.heatmap_url,
                                                        // posicaoPartida is NOT reset on resync — only admin edits should change it
                                                    },
                                                    create: {
                                                        partidaId: partidaId,
                                                        jogadorId: jogadorIdFinal,
                                                        equipeId: equipeId,
                                                        titular: j.titular,
                                                        minutosJogados: j.minutos_jogados,
                                                        notaDesempenho: j.nota,
                                                        gols: golsFinais,
                                                        assistencias: assistsFinais,
                                                        cartoesAmarelos: cartoesAmarelosTimeline,
                                                        cartoesVermelhos: cartoesVermelhosTimeline,
                                                        chutes: j.chutes,
                                                        chutesGol: j.chutes_gol,
                                                        passesTentados: j.passes_tentados,
                                                        passesCompletos: j.passes_completos,
                                                        driblesTentados: j.dribles_tentados,
                                                        driblesCompletos: j.dribles_completos,
                                                        desarmes: j.desarmes,
                                                        interceptacoes: j.interceptacoes,
                                                        faltasCometidas: j.faltas_cometidas,
                                                        faltasSofridas: j.faltas_sofridas,
                                                        posicaoMediaX: ((_c = j.posicao_media) === null || _c === void 0 ? void 0 : _c.x) || null,
                                                        posicaoMediaY: ((_d = j.posicao_media) === null || _d === void 0 ? void 0 : _d.y) || null,
                                                        heatmapUrl: j.heatmap_url,
                                                        posicaoPartida: null, // will be set by admin when editing lineup
                                                    },
                                                })];
                                        case 4:
                                            _f.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, escalacao_1 = escalacao;
                            _e.label = 3;
                        case 3:
                            if (!(_i < escalacao_1.length)) return [3 /*break*/, 6];
                            j = escalacao_1[_i];
                            return [5 /*yield**/, _loop_1(j)];
                        case 4:
                            _e.sent();
                            _e.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        PartidasService_1.prototype.parsarData = function (dataString) {
            if (!dataString || dataString === 'A definir')
                return new Date();
            try {
                var _a = dataString.split(' '), data = _a[0], hora = _a[1];
                var _b = data.split('/'), dia = _b[0], mes = _b[1], ano = _b[2];
                var _c = (hora || '00:00').split(':'), h = _c[0], m = _c[1];
                return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(h), Number(m));
            }
            catch (_d) {
                return new Date();
            }
        };
        PartidasService_1.prototype.atualizarEscalacao = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var partidaId, formacaoCasa, formacaoVisitante, jogadores, updates, partida;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            partidaId = input.partidaId, formacaoCasa = input.formacaoCasa, formacaoVisitante = input.formacaoVisitante, jogadores = input.jogadores;
                            updates = jogadores
                                .filter(function (j) { return j.estatisticaId > 0; })
                                .map(function (j) {
                                return _this.prisma.estatisticaJogador.update({
                                    where: { id: j.estatisticaId },
                                    data: {
                                        titular: j.titular,
                                        posicaoPartida: j.posicaoPartida || null,
                                        numeroCamisa: j.numeroCamisa || null,
                                    },
                                });
                            });
                            return [4 /*yield*/, this.prisma.partida.findUnique({ where: { id: partidaId } })];
                        case 1:
                            partida = _a.sent();
                            if (partida) {
                                if (formacaoCasa !== undefined) {
                                    updates.push(this.prisma.estatisticaEquipe.upsert({
                                        where: { partidaId_equipeId: { partidaId: partidaId, equipeId: partida.equipeCasaId } },
                                        update: { formacao: formacaoCasa },
                                        create: {
                                            partidaId: partidaId,
                                            equipeId: partida.equipeCasaId,
                                            formacao: formacaoCasa
                                        }
                                    }));
                                }
                                if (formacaoVisitante !== undefined) {
                                    updates.push(this.prisma.estatisticaEquipe.upsert({
                                        where: { partidaId_equipeId: { partidaId: partidaId, equipeId: partida.equipeVisitanteId } },
                                        update: { formacao: formacaoVisitante },
                                        create: {
                                            partidaId: partidaId,
                                            equipeId: partida.equipeVisitanteId,
                                            formacao: formacaoVisitante
                                        }
                                    }));
                                }
                            }
                            return [4 /*yield*/, this.prisma.$transaction(updates)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return PartidasService_1;
    }());
    __setFunctionName(_classThis, "PartidasService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PartidasService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PartidasService = _classThis;
}();
exports.PartidasService = PartidasService;
