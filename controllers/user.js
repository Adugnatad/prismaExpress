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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../config.ts/hash");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../util/secrets");
const prisma = new client_1.PrismaClient();
const generateToken = (username) => {
    const payload = {
        username: username,
    };
    const token = jsonwebtoken_1.default.sign(payload, secrets_1.secret_key, { expiresIn: "1h" });
    return token;
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, Full_Name, gender, location, website } = req.body;
    const hashedPassword = yield (0, hash_1.hash)(password);
    if (hashedPassword) {
        const u = yield prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (u) {
            res.status(403).send("Username already exists");
        }
        else {
            const user = yield prisma.user
                .create({
                data: {
                    username: username,
                    password: hashedPassword,
                    profile: {
                        create: {
                            name: Full_Name,
                            gender,
                            location,
                            website,
                        },
                    },
                },
            })
                .then((user) => {
                res.json({
                    id: user.id,
                    username: user.username,
                    profile: user.profileId,
                });
            })
                .catch((err) => {
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
            });
        }
    }
    else {
        res.status(500).send("password hash failed");
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (user) {
        const passwordCheck = (0, hash_1.checkHash)(password, user.password);
        if (passwordCheck) {
            const token = generateToken(user.username);
            res.status(200).json({ token });
        }
        else {
            res.status(401).send("Invalid Credentials");
        }
    }
    else {
        res.status(400).send("user not found!");
    }
});
exports.login = login;
