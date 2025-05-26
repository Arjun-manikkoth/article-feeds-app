import bcrypt from "bcrypt";

//hash plain password
const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    } catch (error: any) {
        console.log("Error hashing password:", error.message);
        throw new Error("Hashing failed");
    }
};

export { hashPassword };
