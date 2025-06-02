import bcrypt from 'bcrypt';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

/**
 * Hash password
 * @param {string} password
 * @returns {Promise<string>} 
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};


export {
    hashPassword,
    comparePassword
}