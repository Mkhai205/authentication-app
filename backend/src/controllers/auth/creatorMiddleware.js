import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/auth/UserModel.js";

// @desc   Delete a user by admin or creator
// @route  GET /api/v1/users
// @access Private/Admin or Creator
const getAllUsers = expressAsyncHandler(async (req, res) => {
    // Fetch all users from the database
    const users = await UserModel.find().select("-password");

    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Return the list of users
    res.status(200).json(users);
});

export { getAllUsers };
