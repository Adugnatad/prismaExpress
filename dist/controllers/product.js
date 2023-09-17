"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProductId = exports.getProductsGraph = exports.getProducts = exports.postProductGraph = exports.postProduct = void 0;
var client_1 = require("@prisma/client");
var express_validator_1 = require("express-validator");
var prisma = new client_1.PrismaClient();
var postProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, price, available_quantity, picture, errors, p, product;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, price = _a.price, available_quantity = _a.available_quantity, picture = _a.picture;
                return [4 /*yield*/, (0, express_validator_1.check)("price", "price must be greater than 0")
                        .isInt({ min: 1 })
                        .run(req)];
            case 1:
                _b.sent();
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(403).send(errors)];
                }
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            name: name,
                        },
                    })];
            case 2:
                p = _b.sent();
                if (p) {
                    return [2 /*return*/, res.status(403).send("product name already exists")];
                }
                return [4 /*yield*/, prisma.product
                        .create({
                        data: {
                            name: name,
                            price: parseInt(price),
                            available_quantity: parseInt(available_quantity),
                            picture: picture,
                        },
                    })
                        .then(function (product) {
                        res.status(200).json({ product: product });
                    })
                        .catch(function (err) {
                        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                            if (err.code === "P2002") {
                                res.status(403).send("Invalid request. Unique Constraint failed");
                            }
                            else {
                                res.status(403).json(err.message);
                            }
                        }
                        else {
                            res.status(500).send();
                        }
                    })];
            case 3:
                product = _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.postProduct = postProduct;
var postProductGraph = function (name, price, available_quantity, picture) { return __awaiter(void 0, void 0, void 0, function () {
    var p, product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.product.findUnique({
                    where: {
                        name: name,
                    },
                })];
            case 1:
                p = _a.sent();
                if (p) {
                    throw new Error("Product with the same name already exists.");
                }
                return [4 /*yield*/, prisma.product
                        .create({
                        data: {
                            name: name,
                            price: price,
                            available_quantity: available_quantity,
                            picture: picture,
                        },
                    })
                        .then(function (product) {
                        console.log(product);
                        return product;
                    })
                        .catch(function (err) {
                        throw new Error("Failed to add product: ".concat(err.message));
                    })];
            case 2:
                product = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.postProductGraph = postProductGraph;
var getProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.product.findMany()];
            case 1:
                products = _a.sent();
                res.status(200).json(products);
                return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
var getProductsGraph = function () { return __awaiter(void 0, void 0, void 0, function () {
    var products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.product.findMany()];
            case 1:
                products = _a.sent();
                return [2 /*return*/, products];
        }
    });
}); };
exports.getProductsGraph = getProductsGraph;
var getProductId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, prisma.product.findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })];
            case 1:
                product = _a.sent();
                res.status(200).json(product);
                return [2 /*return*/];
        }
    });
}); };
exports.getProductId = getProductId;
var deleteProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, prisma.product
                        .findUnique({
                        where: {
                            id: parseInt(id),
                        },
                    })
                        .then(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!product) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prisma.product.delete({
                                            where: {
                                                id: parseInt(id),
                                            },
                                        })];
                                case 1:
                                    _a.sent();
                                    res.status(200).send("Product deleted successfully");
                                    return [3 /*break*/, 3];
                                case 2:
                                    res.status(403).json({ Error: "No product by that id found" });
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map