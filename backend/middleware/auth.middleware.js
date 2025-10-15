import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        console.log(req.cookies)
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "No token provided");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken)
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized: " + error.message || "Invalid access token");
    }
});