import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Content is required"],
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);