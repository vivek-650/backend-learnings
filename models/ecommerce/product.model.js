import mongoose from "mongoose";

const produtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        required: true,
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    productImage: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export const Product = mongoose.model("Product", productSchema);