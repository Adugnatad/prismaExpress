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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
var client_1 = require("@prisma/client");
var hash_1 = require("../config.ts/hash");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secrets_1 = require("../util/secrets");
var express_validator_1 = require("express-validator");
var prisma = new client_1.PrismaClient();
var generateToken = function (username) {
    var payload = {
        username: username,
    };
    var token = jsonwebtoken_1.default.sign(payload, secrets_1.secret_key, { expiresIn: "1h" });
    return token;
};
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, Full_Name, gender, location, website, errors, hashedPassword, u, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password, Full_Name = _a.Full_Name, gender = _a.gender, location = _a.location, website = _a.website;
                return [4 /*yield*/, (0, express_validator_1.check)("gender", "gender can be either MALE or FEMALE")
                        .isIn(["MALE", "FEMALE"])
                        .run(req)];
            case 1:
                _b.sent();
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(403).send(errors)];
                }
                return [4 /*yield*/, (0, hash_1.hash)(password)];
            case 2:
                hashedPassword = _b.sent();
                if (!hashedPassword) return [3 /*break*/, 7];
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            username: username,
                        },
                    })];
            case 3:
                u = _b.sent();
                if (!u) return [3 /*break*/, 4];
                res.status(403).send("Username already exists");
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, prisma.user
                    .create({
                    data: {
                        username: username,
                        password: hashedPassword,
                        profile: {
                            create: {
                                name: Full_Name,
                                gender: gender,
                                location: location,
                                website: website,
                            },
                        },
                    },
                })
                    .then(function (user) {
                    res.json({
                        id: user.id,
                        username: user.username,
                        profile: user.profileId,
                    });
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
                        res.status(500).send(err);
                    }
                })];
            case 5:
                user = _b.sent();
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(500).send("password hash failed");
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, passwordCheck, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            username: username,
                        },
                    })];
            case 1:
                user = _b.sent();
                if (user) {
                    passwordCheck = (0, hash_1.checkHash)(password, user.password);
                    if (passwordCheck) {
                        token = generateToken(user.username);
                        res.status(200).json({ token: token });
                    }
                    else {
                        res.status(401).send("Invalid Credentials");
                    }
                }
                else {
                    res.status(400).send("user not found!");
                }
                return [2 /*return*/];
        }
    });
}); };
exports.login = login;
//# sourceMappingURL=user.js.map