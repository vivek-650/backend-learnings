import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: /.+\@.+\..+/,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 7,
        maxLength: 35,
    },
    dateOfBirth:{
        type: Date,
        required: false,

    },
    gender: {
        type: String,
        enum: ["male","female","other"],
        required: true,
    }

});

export const User = mongoose.model("User", userSchema);