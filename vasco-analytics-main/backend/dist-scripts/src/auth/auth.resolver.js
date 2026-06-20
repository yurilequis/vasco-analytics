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
exports.AuthResolver = exports.AuthPayload = exports.UsuarioSessao = void 0;
var graphql_1 = require("@nestjs/graphql");
// ── TIPAGENS DE RESPOSTA DO GRAPHQL ────────────────────────
var UsuarioSessao = function () {
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
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var UsuarioSessao = _classThis = /** @class */ (function () {
        function UsuarioSessao_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nome = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nome_initializers, void 0));
            this.email = (__runInitializers(this, _nome_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.role = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            __runInitializers(this, _role_extraInitializers);
        }
        return UsuarioSessao_1;
    }());
    __setFunctionName(_classThis, "UsuarioSessao");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _nome_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _email_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _role_decorators = [(0, graphql_1.Field)(function () { return String; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nome_decorators, { kind: "field", name: "nome", static: false, private: false, access: { has: function (obj) { return "nome" in obj; }, get: function (obj) { return obj.nome; }, set: function (obj, value) { obj.nome = value; } }, metadata: _metadata }, _nome_initializers, _nome_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsuarioSessao = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsuarioSessao = _classThis;
}();
exports.UsuarioSessao = UsuarioSessao;
var AuthPayload = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _access_token_decorators;
    var _access_token_initializers = [];
    var _access_token_extraInitializers = [];
    var _usuario_decorators;
    var _usuario_initializers = [];
    var _usuario_extraInitializers = [];
    var AuthPayload = _classThis = /** @class */ (function () {
        function AuthPayload_1() {
            this.access_token = __runInitializers(this, _access_token_initializers, void 0);
            this.usuario = (__runInitializers(this, _access_token_extraInitializers), __runInitializers(this, _usuario_initializers, void 0));
            __runInitializers(this, _usuario_extraInitializers);
        }
        return AuthPayload_1;
    }());
    __setFunctionName(_classThis, "AuthPayload");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _access_token_decorators = [(0, graphql_1.Field)(function () { return String; })];
        _usuario_decorators = [(0, graphql_1.Field)(function () { return UsuarioSessao; })];
        __esDecorate(null, null, _access_token_decorators, { kind: "field", name: "access_token", static: false, private: false, access: { has: function (obj) { return "access_token" in obj; }, get: function (obj) { return obj.access_token; }, set: function (obj, value) { obj.access_token = value; } }, metadata: _metadata }, _access_token_initializers, _access_token_extraInitializers);
        __esDecorate(null, null, _usuario_decorators, { kind: "field", name: "usuario", static: false, private: false, access: { has: function (obj) { return "usuario" in obj; }, get: function (obj) { return obj.usuario; }, set: function (obj, value) { obj.usuario = value; } }, metadata: _metadata }, _usuario_initializers, _usuario_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthPayload = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthPayload = _classThis;
}();
exports.AuthPayload = AuthPayload;
// ── ROTAS (ENDPOINTS) ──────────────────────────────────────
var AuthResolver = function () {
    var _classDecorators = [(0, graphql_1.Resolver)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _login_decorators;
    var _criarPrimeiroAdmin_decorators;
    var _registrar_decorators;
    var _loginComGoogle_decorators;
    var AuthResolver = _classThis = /** @class */ (function () {
        function AuthResolver_1(authService, prisma) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.prisma = prisma;
        }
        AuthResolver_1.prototype.login = function (email, senhaLimpa) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.validarUsuario(email, senhaLimpa)];
                        case 1:
                            usuario = _a.sent();
                            return [2 /*return*/, this.authService.gerarTokenLogin(usuario)];
                    }
                });
            });
        };
        // Mutação de Setup Inicial (Gatilho único)
        AuthResolver_1.prototype.criarPrimeiroAdmin = function (senhaLimpa) {
            return __awaiter(this, void 0, void 0, function () {
                var count, senhaHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.usuario.count()];
                        case 1:
                            count = _a.sent();
                            if (count > 0)
                                return [2 /*return*/, false];
                            return [4 /*yield*/, this.authService.hashSenha(senhaLimpa)];
                        case 2:
                            senhaHash = _a.sent();
                            return [4 /*yield*/, this.prisma.usuario.create({
                                    data: {
                                        nome: 'Yuri Gabriel',
                                        email: 'admin@vascoanalytics.com',
                                        senha: senhaHash,
                                        role: 'ADMIN',
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AuthResolver_1.prototype.registrar = function (nome, email, senhaLimpa) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.registrar(nome, email, senhaLimpa)];
                        case 1:
                            usuario = _a.sent();
                            return [2 /*return*/, this.authService.gerarTokenLogin(usuario)];
                    }
                });
            });
        };
        AuthResolver_1.prototype.loginComGoogle = function (email, nome, googleId) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.loginComGoogle(email, nome, googleId)];
                        case 1:
                            usuario = _a.sent();
                            return [2 /*return*/, this.authService.gerarTokenLogin(usuario)];
                    }
                });
            });
        };
        return AuthResolver_1;
    }());
    __setFunctionName(_classThis, "AuthResolver");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _login_decorators = [(0, graphql_1.Mutation)(function () { return AuthPayload; })];
        _criarPrimeiroAdmin_decorators = [(0, graphql_1.Mutation)(function () { return Boolean; })];
        _registrar_decorators = [(0, graphql_1.Mutation)(function () { return AuthPayload; })];
        _loginComGoogle_decorators = [(0, graphql_1.Mutation)(function () { return AuthPayload; })];
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _criarPrimeiroAdmin_decorators, { kind: "method", name: "criarPrimeiroAdmin", static: false, private: false, access: { has: function (obj) { return "criarPrimeiroAdmin" in obj; }, get: function (obj) { return obj.criarPrimeiroAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registrar_decorators, { kind: "method", name: "registrar", static: false, private: false, access: { has: function (obj) { return "registrar" in obj; }, get: function (obj) { return obj.registrar; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _loginComGoogle_decorators, { kind: "method", name: "loginComGoogle", static: false, private: false, access: { has: function (obj) { return "loginComGoogle" in obj; }, get: function (obj) { return obj.loginComGoogle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthResolver = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthResolver = _classThis;
}();
exports.AuthResolver = AuthResolver;
