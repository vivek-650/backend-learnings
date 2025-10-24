import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetAccessTokens,
  changeUserPassword,
  getCurrentuser,
  updateUserProfile,
  updateUserCoverImage,
  updateUserAvatar,
  getUserChannelProfile,
  getUserHistory
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// secured routes can be added here using verifyJWT middleware
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(resetAccessTokens);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/me").get(verifyJWT, getCurrentuser);
router.route("/update-profile").patch(verifyJWT, updateUserProfile);
router.route("/coverImage").patch(verifyJWT, updateUserCoverImage);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getUserHistory);

export default router;
