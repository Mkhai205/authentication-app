import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "please provide your name"],
        },
        email: {
            type: String,
            required: [true, "please provide your email"],
            unique: true,
            trim: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "please provide your password"],
            minlength: 6,
        },
        photo: {
            type: String,
            default: "../../public/default-avatar-profile-icon.webp",
        },
        bio: {
            type: String,
            default: "I am using this app",
        },
        role: {
            type: String,
            enum: ["user", "admin", "creator"],
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        minimize: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
