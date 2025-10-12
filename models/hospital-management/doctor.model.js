import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,

    },
    qualification: {
        type: String
    },
    experienceInYears: {
        
    }
}, {timestamps: true});

export const Doctor = mongoose.model("Doctor", doctorSchema)