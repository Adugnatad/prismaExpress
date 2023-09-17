"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secrets_1 = require("../util/secrets");
var verifyToken = function (req, res, next) {
    var _a;
    var authToken = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!authToken) {
        return res.status(401).json({ message: "Token not provided" });
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(authToken, secrets_1.secret_key);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwtToken.js.map