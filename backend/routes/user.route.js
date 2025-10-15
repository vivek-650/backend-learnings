import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import { registerUser, loginUser, logoutUser, resetAccessTokens } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, 
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);
router.route("/login").post(loginUser);

// secured routes can be added here using verifyJWT middleware
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(resetAccessTokens);
export default router;
