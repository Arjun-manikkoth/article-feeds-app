import mongoose, { Schema, Document } from "mongoose";
import { Types } from "mongoose";

interface IArticle extends Document {
    _id: Types.ObjectId;
    account_id: Types.ObjectId;
    article_name: string;
    description: string;
    category: string;
    images: string[];
    likes?: Types.ObjectId[];
    dislikes?: Types.ObjectId[];
    blocks?: Types.ObjectId[];
}

const articleSchema: Schema = new Schema(
    {
        article_name: {
            type: String,
            required: [true, "Article name is required"],
            trim: true,
        },
        account_id: { type: Schema.Types.ObjectId },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        category: {
            type: [String],
            required: [true, "Category is required"],
        },
        images: {
            type: [String],
            default: [],
            required: [true, "images are required"],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: [],
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                default: [],
                ref: "user",
            },
        ],
        blocks: [
            {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: [],
            },
        ],
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
const articleModel = mongoose.model<IArticle>("article", articleSchema);

export default articleModel;
export { IArticle };
