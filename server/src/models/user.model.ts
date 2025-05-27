import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

interface IUser extends Document {
    _id: Types.ObjectId;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    date_of_birth: Date;
    preference: string[];
}

const userSchema: Schema = new Schema(
    {
        first_name: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        last_name: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        date_of_birth: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        preference: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);
const userModel = mongoose.model<IUser>("user", userSchema);

export default userModel;
export { IUser };
