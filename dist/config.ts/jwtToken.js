import jwt from "jsonwebtoken";
import { secret_key } from "../util/secrets";
export const verifyToken = (req, res, next) => {
    const authToken = req.header("Authorization")?.replace("Bearer ", "");
    if (!authToken) {
        return res.status(401).json({ message: "Token not provided" });
    }
    try {
        const decoded = jwt.verify(authToken, secret_key);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
//# sourceMappingURL=jwtToken.js.map