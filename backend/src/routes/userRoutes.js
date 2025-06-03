import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    userLoginStatus,
    verifyEmail,
} from "../controllers/auth/userController.js";
import { deleteUser } from "../controllers/auth/adminController.js";
import { getAllUsers } from "../controllers/auth/creatorMiddleware.js";
import { adminMiddleware, creatorMiddleware, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin routes
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// get all users
router.get("/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// verify user (email verification)
router.post("/verify-email", protect, verifyEmail);

export default router;
