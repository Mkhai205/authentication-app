import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Generate a JWT token
 * @param {Object} payload 
 * @param {string} expiresIn 
 * @returns {string}
 */
const generateToken = (payload, expiresIn = "24h") => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {Object | null}
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};

export { generateToken, verifyToken };
