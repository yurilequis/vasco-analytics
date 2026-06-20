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
exports.EquipesService = void 0;
var common_1 = require("@nestjs/common");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var EquipesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EquipesService = _classThis = /** @class */ (function () {
        function EquipesService_1(prisma) {
            this.prisma = prisma;
        }
        EquipesService_1.prototype.listarTodas = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.equipe.findMany({
                            orderBy: { nome: 'asc' },
                        })];
                });
            });
        };
        EquipesService_1.prototype.buscarPorId = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.equipe.findUnique({
                            where: { id: id },
                        })];
                });
            });
        };
        // Função blindada e tipada
        EquipesService_1.prototype.atualizarEquipe = function (id, dados) {
            return __awaiter(this, void 0, void 0, function () {
                var dataFundacao;
                return __generator(this, function (_a) {
                    dataFundacao = dados.fundacao;
                    // Se o frontend enviar a fundação como string de data, convertemos para objeto Date
                    if (typeof dataFundacao === 'string') {
                        dataFundacao = new Date(dataFundacao);
                    }
                    return [2 /*return*/, this.prisma.equipe.update({
                            where: { id: id },
                            data: __assign(__assign({}, dados), { fundacao: dataFundacao }),
                        })];
                });
            });
        };
        EquipesService_1.prototype.sincronizarEscudosLocais = function () {
            return __awaiter(this, void 0, void 0, function () {
                var atualizados, logosDir, files, equipes, normalizeName, _loop_1, this_1, _i, equipes_1, equipe;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            atualizados = 0;
                            logosDir = path.join(process.cwd(), '../frontend/public/logos');
                            if (!fs.existsSync(logosDir)) {
                                console.warn("Diret\u00F3rio n\u00E3o encontrado: ".concat(logosDir));
                                return [2 /*return*/, 0];
                            }
                            files = fs.readdirSync(logosDir).filter(function (f) { return f.endsWith('.png'); });
                            return [4 /*yield*/, this.prisma.equipe.findMany()];
                        case 1:
                            equipes = _a.sent();
                            normalizeName = function (name) { return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
                            _loop_1 = function (equipe) {
                                var nomeNorm, eSlug, eSlugCurto, primeiroNome, matchedFile, newUrl;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            nomeNorm = normalizeName(equipe.nome);
                                            eSlug = nomeNorm.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                            eSlugCurto = equipe.nomeCurto ? normalizeName(equipe.nomeCurto).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null;
                                            primeiroNome = eSlug.split('-')[0];
                                            matchedFile = files.find(function (f) {
                                                var fSlug = f.split('.')[0].toLowerCase(); // ex: sao-paulo.football-logos.cc -> sao-paulo
                                                // Tentativas de match seguro:
                                                if (fSlug === eSlug)
                                                    return true; // Match exato (sao-paulo === sao-paulo)
                                                if (f.startsWith("".concat(eSlug, ".")))
                                                    return true; // sao-paulo.png
                                                if (f.startsWith("".concat(eSlug, "-")))
                                                    return true; // america-mg-logo.png
                                                if (eSlugCurto && fSlug === eSlugCurto)
                                                    return true; // FLA, FLU, VAS
                                                // Match relaxado seguro para times com "da", "do", "de" (ex: vasco-da-gama -> vasco)
                                                // Só aceitamos o primeiro nome se ele tiver mais de 4 letras para evitar falsos positivos
                                                if (primeiroNome.length > 4 && f.startsWith("".concat(primeiroNome, ".")))
                                                    return true;
                                                return false;
                                            });
                                            if (!matchedFile) return [3 /*break*/, 2];
                                            newUrl = "/logos/".concat(matchedFile);
                                            if (!(equipe.escudoUrl !== newUrl)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this_1.prisma.equipe.update({ where: { id: equipe.id }, data: { escudoUrl: newUrl } })];
                                        case 1:
                                            _b.sent();
                                            atualizados++;
                                            _b.label = 2;
                                        case 2: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, equipes_1 = equipes;
                            _a.label = 2;
                        case 2:
                            if (!(_i < equipes_1.length)) return [3 /*break*/, 5];
                            equipe = equipes_1[_i];
                            return [5 /*yield**/, _loop_1(equipe)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, atualizados];
                    }
                });
            });
        };
        return EquipesService_1;
    }());
    __setFunctionName(_classThis, "EquipesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EquipesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EquipesService = _classThis;
}();
exports.EquipesService = EquipesService;
