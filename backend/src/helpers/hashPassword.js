import bcrypt from "bcrypt";

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

/**
 * Hash password
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = (password) => {
    return bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
