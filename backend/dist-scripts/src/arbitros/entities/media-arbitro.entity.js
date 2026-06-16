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
exports.MediaArbitro = void 0;
var graphql_1 = require("@nestjs/graphql");
var MediaArbitro = function () {
    var _classDecorators = [(0, graphql_1.ObjectType)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _partidasApitadas_decorators;
    var _partidasApitadas_initializers = [];
    var _partidasApitadas_extraInitializers = [];
    var _mediaFaltas_decorators;
    var _mediaFaltas_initializers = [];
    var _mediaFaltas_extraInitializers = [];
    var _mediaAmarelos_decorators;
    var _mediaAmarelos_initializers = [];
    var _mediaAmarelos_extraInitializers = [];
    var _mediaVermelhos_decorators;
    var _mediaVermelhos_initializers = [];
    var _mediaVermelhos_extraInitializers = [];
    var _mediaBola_decorators;
    var _mediaBola_initializers = [];
    var _mediaBola_extraInitializers = [];
    var MediaArbitro = _classThis = /** @class */ (function () {
        function MediaArbitro_1() {
            this.partidasApitadas = __runInitializers(this, _partidasApitadas_initializers, void 0);
            this.mediaFaltas = (__runInitializers(this, _partidasApitadas_extraInitializers), __runInitializers(this, _mediaFaltas_initializers, void 0));
            this.mediaAmarelos = (__runInitializers(this, _mediaFaltas_extraInitializers), __runInitializers(this, _mediaAmarelos_initializers, void 0));
            this.mediaVermelhos = (__runInitializers(this, _mediaAmarelos_extraInitializers), __runInitializers(this, _mediaVermelhos_initializers, void 0));
            this.mediaBola = (__runInitializers(this, _mediaVermelhos_extraInitializers), __runInitializers(this, _mediaBola_initializers, void 0));
            __runInitializers(this, _mediaBola_extraInitializers);
        }
        return MediaArbitro_1;
    }());
    __setFunctionName(_classThis, "MediaArbitro");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _partidasApitadas_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Int; })];
        _mediaFaltas_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Float; })];
        _mediaAmarelos_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Float; })];
        _mediaVermelhos_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Float; })];
        _mediaBola_decorators = [(0, graphql_1.Field)(function () { return graphql_1.Float; })];
        __esDecorate(null, null, _partidasApitadas_decorators, { kind: "field", name: "partidasApitadas", static: false, private: false, access: { has: function (obj) { return "partidasApitadas" in obj; }, get: function (obj) { return obj.partidasApitadas; }, set: function (obj, value) { obj.partidasApitadas = value; } }, metadata: _metadata }, _partidasApitadas_initializers, _partidasApitadas_extraInitializers);
        __esDecorate(null, null, _mediaFaltas_decorators, { kind: "field", name: "mediaFaltas", static: false, private: false, access: { has: function (obj) { return "mediaFaltas" in obj; }, get: function (obj) { return obj.mediaFaltas; }, set: function (obj, value) { obj.mediaFaltas = value; } }, metadata: _metadata }, _mediaFaltas_initializers, _mediaFaltas_extraInitializers);
        __esDecorate(null, null, _mediaAmarelos_decorators, { kind: "field", name: "mediaAmarelos", static: false, private: false, access: { has: function (obj) { return "mediaAmarelos" in obj; }, get: function (obj) { return obj.mediaAmarelos; }, set: function (obj, value) { obj.mediaAmarelos = value; } }, metadata: _metadata }, _mediaAmarelos_initializers, _mediaAmarelos_extraInitializers);
        __esDecorate(null, null, _mediaVermelhos_decorators, { kind: "field", name: "mediaVermelhos", static: false, private: false, access: { has: function (obj) { return "mediaVermelhos" in obj; }, get: function (obj) { return obj.mediaVermelhos; }, set: function (obj, value) { obj.mediaVermelhos = value; } }, metadata: _metadata }, _mediaVermelhos_initializers, _mediaVermelhos_extraInitializers);
        __esDecorate(null, null, _mediaBola_decorators, { kind: "field", name: "mediaBola", static: false, private: false, access: { has: function (obj) { return "mediaBola" in obj; }, get: function (obj) { return obj.mediaBola; }, set: function (obj, value) { obj.mediaBola = value; } }, metadata: _metadata }, _mediaBola_initializers, _mediaBola_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MediaArbitro = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MediaArbitro = _classThis;
}();
exports.MediaArbitro = MediaArbitro;
