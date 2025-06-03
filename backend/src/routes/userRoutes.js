import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    userLoginStatus,
    verifyEmail,
    verifyUser,
    forgotPassword,
    resetPassword,
    changePassword,
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
router.delete("/admin/users/:userId", protect, adminMiddleware, deleteUser);

// get all users
router.get("/users", protect, creatorMiddleware, getAllUsers);

// login status
router.get("/login-status", userLoginStatus);

// verify user (email verification)
router.post("/verify-email", protect, verifyEmail);

// verify user email
router.get("/verify-user/:verificationToken", verifyUser);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// change password (user must be logged in)
router.patch("/change-password", protect, changePassword);

export default router;
