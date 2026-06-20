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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JogadoresService = void 0;
var common_1 = require("@nestjs/common");
// Motor de higienização de posições do Football Manager
function normalizarPosicaoFM(posicaoBruta) {
    if (!posicaoBruta)
        return 'Desconhecida';
    var pos = posicaoBruta.toUpperCase().trim();
    // 1. Goleiros e Zagueiros
    if (pos.includes('GR') || pos === 'GOLEIRO')
        return 'Goleiro';
    if (pos.includes('D (C)') || pos.includes('DC') || pos === 'ZAGUEIRO')
        return 'Zagueiro';
    // 2. Laterais (Com os "monstrinhos" de versatilidade incluídos)
    if (pos.includes('D (D)') ||
        pos.includes('DA (D)') ||
        pos.includes('D/DA (D)') ||
        pos.includes('D (DE)') ||
        pos === 'DD' ||
        pos === 'LATERAL DIREITO')
        return 'Lateral Direito';
    if (pos.includes('D (E)') ||
        pos.includes('DA (E)') ||
        pos.includes('D/DA (E)') ||
        pos.includes('D/DA/M (E)') ||
        pos.includes('D/DA/M/MO (E)') ||
        pos === 'DE' ||
        pos === 'LATERAL ESQUERDO')
        return 'Lateral Esquerdo';
    // 3. Volantes e Meias Centrais
    // ✅ O "MD" isolado garante que o Volante seja detectado corretamente sem conflitar com alas.
    if (pos.includes('MDC') || pos === 'MD' || pos === 'VOLANTE')
        return 'Volante';
    if (pos.includes('M (C)') || pos.includes('MC') || pos === 'MEIA CENTRAL')
        return 'Meia Central';
    // 4. Meias Ofensivos e Extremos
    // ⚠️ A ordem dos IFs é vital aqui. As siglas compostas (MO) devem vir antes das simples.
    if (pos.includes('MO (DEC)') ||
        pos.includes('MO (DE)') ||
        pos.includes('MO (C)') ||
        pos === 'MEIA ATACANTE')
        return 'Meia Atacante';
    if (pos.includes('MO (E)') || pos === 'MEIA ESQUERDA')
        return 'Meia Esquerda';
    if (pos.includes('MO (D)') ||
        pos.includes('M/MO (D)') ||
        pos === 'MEIA DIREITA')
        return 'Meia Direita';
    // 5. Pontas e Atacantes
    if (pos.includes('ED') || pos === 'PONTA DIREITA')
        return 'Ponta Direita';
    if (pos.includes('EE') || pos === 'PONTA ESQUERDA')
        return 'Ponta Esquerda';
    if (pos.includes('PL') || pos.includes('A (C)') || pos === 'CENTROAVANTE')
        return 'Centroavante';
    return posicaoBruta; // Fallback: se o FM inventar uma sigla nova, ela passa reta para você ver no painel e nos avisar
}
var JogadoresService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var JogadoresService = _classThis = /** @class */ (function () {
        function JogadoresService_1(prisma) {
            this.prisma = prisma;
        }
        JogadoresService_1.prototype.findAll = function () {
            return this.prisma.jogador.findMany({
                orderBy: { nomePopular: 'asc' },
            });
        };
        JogadoresService_1.prototype.findAtivos = function () {
            return this.prisma.jogador.findMany({
                where: { ativo: true },
                orderBy: { nomePopular: 'asc' },
            });
        };
        JogadoresService_1.prototype.findOne = function (id) {
            return this.prisma.jogador.findUnique({
                where: { id: id },
                include: {
                    perfilFM: true,
                },
            });
        };
        JogadoresService_1.prototype.findPorClube = function (nomeClube) {
            // Separamos o return do método findMany e removemos o .db
            return this.prisma.jogador.findMany({
                where: {
                    ativo: true,
                    equipe: {
                        nome: {
                            contains: nomeClube,
                        },
                    },
                },
                orderBy: { nomePopular: 'asc' },
            });
        };
        JogadoresService_1.prototype.importarJogadorCSV = function (nome, clube, posicao, atributosFM, alturaCm, dataNascimento, peDominante, fotoUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var posicaoNormalizada, equipe, jogadorExistente, dataNascObj, _a, dia, mes, ano, jogador;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            posicaoNormalizada = normalizarPosicaoFM(posicao);
                            return [4 /*yield*/, this.prisma.equipe.upsert({
                                    where: { nome: clube },
                                    update: {},
                                    create: {
                                        nome: clube,
                                        nomeCurto: clube.substring(0, 3).toUpperCase(),
                                    },
                                })];
                        case 1:
                            equipe = _b.sent();
                            return [4 /*yield*/, this.prisma.jogador.findFirst({
                                    where: {
                                        equipeId: equipe.id,
                                        OR: [{ nomeOriginal: nome }, { nomePopular: nome }],
                                    },
                                })];
                        case 2:
                            jogadorExistente = _b.sent();
                            dataNascObj = null;
                            if (dataNascimento) {
                                _a = dataNascimento.split('/'), dia = _a[0], mes = _a[1], ano = _a[2];
                                if (dia && mes && ano) {
                                    dataNascObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
                                }
                            }
                            if (!jogadorExistente) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.jogador.update({
                                    where: { id: jogadorExistente.id },
                                    data: {
                                        posicao: posicaoNormalizada,
                                        nomeOriginal: nome,
                                        alturaCm: alturaCm,
                                        peDominante: peDominante,
                                        dataNascimento: dataNascObj,
                                        fotoUrl: fotoUrl,
                                    },
                                })];
                        case 3:
                            jogador = _b.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.prisma.jogador.create({
                                data: {
                                    nomeCompleto: nome,
                                    nomePopular: nome,
                                    nomeOriginal: nome,
                                    posicao: posicaoNormalizada,
                                    equipeId: equipe.id,
                                    alturaCm: alturaCm,
                                    peDominante: peDominante,
                                    dataNascimento: dataNascObj,
                                    fotoUrl: fotoUrl,
                                },
                            })];
                        case 5:
                            jogador = _b.sent();
                            _b.label = 6;
                        case 6:
                            if (!(atributosFM && Object.keys(atributosFM).length > 0)) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.perfilFM.upsert({
                                    where: {
                                        jogadorId: jogador.id,
                                    },
                                    update: atributosFM,
                                    create: __assign(__assign({}, atributosFM), { jogadorId: jogador.id }),
                                })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8: return [2 /*return*/, jogador];
                    }
                });
            });
        };
        JogadoresService_1.prototype.atualizarJogadorAdmin = function (id, dados) {
            return __awaiter(this, void 0, void 0, function () {
                var dataNascimento, restoDosDados, dataNascimentoProcessada, dataConvertida;
                return __generator(this, function (_a) {
                    dataNascimento = dados.dataNascimento, restoDosDados = __rest(dados, ["dataNascimento"]);
                    dataNascimentoProcessada = undefined;
                    if (dataNascimento === null || dataNascimento === '') {
                        dataNascimentoProcessada = null;
                    }
                    else if (dataNascimento !== undefined) {
                        dataConvertida = new Date(dataNascimento);
                        // Verifica matematicamente se a data gerada é válida
                        if (!isNaN(dataConvertida.getTime())) {
                            dataNascimentoProcessada = dataConvertida;
                        }
                        else {
                            dataNascimentoProcessada = null; // Protege o Prisma de "Invalid Date"
                        }
                    }
                    return [2 /*return*/, this.prisma.jogador.update({
                            where: { id: id },
                            data: __assign(__assign({}, restoDosDados), (dataNascimentoProcessada !== undefined && {
                                dataNascimento: dataNascimentoProcessada,
                            })),
                        })];
                });
            });
        };
        JogadoresService_1.prototype.buscarEquipes = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.equipe.findMany({
                            orderBy: { nome: 'asc' },
                        })];
                });
            });
        };
        return JogadoresService_1;
    }());
    __setFunctionName(_classThis, "JogadoresService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JogadoresService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JogadoresService = _classThis;
}();
exports.JogadoresService = JogadoresService;
