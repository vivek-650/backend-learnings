import dotenv from "dotenv";
dotenv.config({path: "./.env"});
import mongoose from "mongoose";
console.log(process.env.MONGO_URL);
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("Database connected successfully");
        console.log(connectionInstance.connection.host);
    } catch (error) {
        console.error("Database connection FAILED:", error);
        process.exit(1);
    }
}

export default connectDB;
