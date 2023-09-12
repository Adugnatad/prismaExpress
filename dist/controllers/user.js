"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const hash_1 = require("../config.ts/hash");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../util/secrets");
const express_validator_1 = require("express-validator");
const prisma = new client_1.PrismaClient();
const generateToken = (username) => {
    const payload = {
        username: username,
    };
    const token = jsonwebtoken_1.default.sign(payload, secrets_1.secret_key, { expiresIn: "1h" });
    return token;
};
const signup = async (req, res) => {
    const { username, password, Full_Name, gender, location, website } = req.body;
    await (0, express_validator_1.check)("gender", "gender can be either MALE or FEMALE")
        .isIn(["MALE", "FEMALE"])
        .run(req);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(403).send(errors);
    }
    const hashedPassword = await (0, hash_1.hash)(password);
    if (hashedPassword) {
        const u = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });
        if (u) {
            res.status(403).send("Username already exists");
        }
        else {
            const user = await prisma.user
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
                    res.status(500).send(err);
                }
            });
        }
    }
    else {
        res.status(500).send("password hash failed");
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
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
};
exports.login = login;
//# sourceMappingURL=user.js.map