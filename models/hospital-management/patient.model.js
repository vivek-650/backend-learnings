import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true
    },
    contactInfo: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    medicalHistory: [{
        condition: {
            type: String,
            required: true
        },
        treatment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    bloodGroup : {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    admittedIn:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    }
}, {timestamps: true});

export const Patient = mongoose.model("Patient", patientSchema);