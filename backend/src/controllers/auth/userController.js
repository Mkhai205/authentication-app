import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/auth/UserModel.js";
import { generateToken, verifyToken } from "../../helpers/generateToken.js";
import { comparePassword, hashPassword } from "../../helpers/hashPassword.js";

// @desc   Register a new user
// @route  POST /api/v1/register
// @access Public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    // check password length
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Encrypt password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
    });

    if (!user) {
        return res.status(500).json({ message: "User registration failed" });
    }

    // Generate token with user ID
    const token = generateToken({ id: user._id });

    // Set token in cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "strict",
        secure: true, // Set to true if using HTTPS
    });

    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
        bio: user.bio,
        isVerified: user.isVerified,
        token: token,
    });
});

// @desc   Login a user
// @route  POST /api/v1/login
// @access Public
const loginUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token with user ID
    const token = generateToken({ id: user._id });

    // Set token in cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: "strict",
        secure: true, // Set to true if using HTTPS
    });

    res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
        bio: user.bio,
        isVerified: user.isVerified,
        token: token,
    });
});

// @desc   Logout user
// @route  POST /api/v1/logout
// @access Public
const logoutUser = expressAsyncHandler(async (req, res) => {
    res.clearCookie("token");

    return res.status(200).json({ message: "User logged out successfully" });
});

// @desc   Get user information
// @route  GET /api/v1/user
// @access Private
const getUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
        bio: user.bio,
        isVerified: user.isVerified,
    });
});

// @desc   Update user information
// @route  PATCH /api/v1/user
// @access Private
const updateUser = expressAsyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    user.photo = req.body.photo || user.photo;
    user.bio = req.body.bio || user.bio;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    if (!updatedUser) {
        return res.status(500).json({ message: "User update failed" });
    }

    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        photo: updatedUser.photo,
        bio: updatedUser.bio,
        isVerified: updatedUser.isVerified,
    });
});

// @desc   Check user login status
// @route  GET /api/v1/login-status
// @access Public
const userLoginStatus = expressAsyncHandler(async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ isLoggedIn: false });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ isLoggedIn: false });
    } else {
        return res.status(200).json({ isLoggedIn: true });
    }
});

export { registerUser, loginUser, logoutUser, getUser, updateUser, userLoginStatus };
