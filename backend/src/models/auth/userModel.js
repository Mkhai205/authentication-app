import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
            default:
                "https://raw.githubusercontent.com/Mkhai205/authentication-app/main/backend/src/public/default-avatar-profile-icon.webp",
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

/**
 * @desc    Hash password before saving
 * @returns {Promise<void>}
 */
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    try {
        // Hash password with cost of 10
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * @desc    Hash password before updating
 * @returns {Promise<void>}
 * @return {Function} next - Callback to proceed with the update
 */
userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();

    // Check if password is being updated
    if (update.password || update.$set?.password) {
        try {
            const saltRounds = 12;
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordToHash = update.password || update.$set.password;
            const hashedPassword = await bcrypt.hash(passwordToHash, salt);

            if (update.password) {
                update.password = hashedPassword;
            } else {
                update.$set.password = hashedPassword;
            }
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

/**
 * @desc    Compare candidate password with hashed password
 * @param   {*} candidatePassword
 * @returns Boolean
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
