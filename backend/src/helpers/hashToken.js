import crypto from "node:crypto";

/**
 * Generates a verification token by appending a random string to the user ID.
 * @param {string} id - The user ID to append to the token.
 * @returns {string} - The generated verification token.
 */
const verificationToken = (id) => {
    // Generate a random token and append the user ID
    return crypto.randomBytes(64).toString("hex") + id;
};

/**
 * Hashes a token using SHA-256 algorithm.
 * @param {string} token - The token to be hashed.
 * @returns {string} - The hashed token in hexadecimal format.
 */
const hashToken = (token) => {
    // hash the token using SHA-256
    return crypto.createHash("sha256").update(token).digest("hex");
};

export { hashToken, verificationToken };
