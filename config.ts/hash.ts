import bcrypt from "bcrypt";

export const hash = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.log(err);
  }
};

export const checkHash = (password: string, hash: string): boolean => {
  try {
    const passwordStatus = bcrypt.compareSync(password, hash);
    return passwordStatus;
  } catch (err) {
    console.log(err);
    return false;
  }
};
