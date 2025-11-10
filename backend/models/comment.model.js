import mongoose, {Schema} from "mongoose";
import mongooseAgregatePaginate from "mongoose-aggregate-paginate-v2";

const commetntSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

commetntSchema.plugin(mongooseAgregatePaginate);

export const Comment = mongoose.model("Comment", commetntSchema);