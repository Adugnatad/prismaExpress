import bcrypt from "bcryptjs";
export const hash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    catch (err) {
        console.log(err);
    }
};
export const checkHash = (password, hash) => {
    try {
        const passwordStatus = bcrypt.compareSync(password, hash);
        return passwordStatus;
    }
    catch (err) {
        console.log(err);
        return false;
    }
};
//# sourceMappingURL=hash.js.map