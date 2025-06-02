import asyncHandler from "express-async-handler";
import UserModel from "../models/auth/UserModel.js";
import "dotenv/config";
import { verifyToken } from "../helpers/generateToken.js";

/**
 * Middleware to protect routes by verifying JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        // Verify the token
        const decoded = verifyToken(token);

        // Get user details from the decoded token (exclude password)
        const user = await UserModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        // Attach user to the request object
        req.user = user;

        // Call the next middleware or route handler
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
});

/**
 * Middleware to check if the user is an admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const adminMiddleware = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next(); // User is an admin, proceed to the next middleware
    } else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
});

/**
 * Middleware to check if the user is a creator or admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const creatorMiddleware = asyncHandler(async (req, res, next) => {
    if (req.user && (req.user.role === "creator" || req.user.role === "admin")) {
        next(); // User is a creator, proceed to the next middleware
    } else {
        res.status(403).json({ message: "Access denied, creator only" });
    }
});

const verifiedMiddleware = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isVerified) {
        next(); // User is verified, proceed to the next middleware
    } else {
        res.status(403).json({ message: "Access denied, user not verified" });
    }
});

export { protect, adminMiddleware, creatorMiddleware, verifiedMiddleware };
