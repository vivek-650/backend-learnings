import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile: {
        required: true,
        type: String
    },
    thumbnail: {
        required: true,
        type: String
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);