import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateTokens from "../utils/generateTokens.js";

const registerUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(
      400,
      "Missing form fields. Make sure you submit the form as multipart/form-data"
    );
  }

  // get user data from frontend
  const { fullname, username, email, password } = req.body;

  // all validation - not empty
  if (
    [fullname, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (password.length < 7) {
    throw new ApiError(400, "Password must be at least 7 characters long");
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    throw new ApiError(
      400,
      "Username can only contain letters, numbers and hyphens"
    );
  }

  // check if user already exists - username & email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "Username or email already in exists");
  }

  // check for avatar & coverImage (use optional chaining before indexing to avoid runtime errors)
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    const fileKeys = req.files ? Object.keys(req.files) : [];
    const bodyKeys = req.body ? Object.keys(req.body) : [];
    throw new ApiError(
      400,
      `Avatar file is required. Received file fields: ${JSON.stringify(
        fileKeys
      )}. Body fields: ${JSON.stringify(
        bodyKeys
      )}. NOTE: Make sure you're sending a File object, not a filename string. Field name must be "avatar".`
    );
  }

  // Upload to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  let coverImage = null;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  // remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // return response
  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(
      400,
      "Missing form fields. Make sure you submit the credentials "
    );
  }
  //login data from frontend
  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or email is required");
  }
  //find username in db
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "username or email not found");
  }
  // check for the password
  const isPasswordValid = await user?.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  //generate access token and refresh token
  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = { ...user._doc };
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;
  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("accessToken", accessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse("User logged Out", {}, 200));
});

const resetAccessTokens = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, resetAccessTokens };
