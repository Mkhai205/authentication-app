import expressAsyncHandler from "express-async-handler";
import UserModel from "../../models/auth/UserModel.js";

// @desc   Delete a user by admin
// @route  DELETE /api/v1/admin/users/:id
// @access Private/Admin
const deleteUser = expressAsyncHandler(async (req, res) => {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is trying to delete themselves
    if (userId === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Delete the user
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
        return res.status(500).json({ message: "User deletion failed" });
    }

    res.status(200).json({ message: "User deleted successfully" });
});

export { deleteUser };
