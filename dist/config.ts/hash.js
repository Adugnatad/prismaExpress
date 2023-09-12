"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHash = exports.hash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hash = async (password) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hash = await bcryptjs_1.default.hash(password, salt);
        return hash;
    }
    catch (err) {
        console.log(err);
    }
};
exports.hash = hash;
const checkHash = (password, hash) => {
    try {
        const passwordStatus = bcryptjs_1.default.compareSync(password, hash);
        return passwordStatus;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
exports.checkHash = checkHash;
//# sourceMappingURL=hash.js.map