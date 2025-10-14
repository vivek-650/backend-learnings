import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Don't configure at import time - configure lazily when first used
let isConfigured = false;

const configureCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Configure cloudinary on first use (after dotenv has loaded)
    configureCloudinary();

    if (!localFilePath) {
      console.log("❌ No file path provided to cloudinary upload");
      return null;
    }

    console.log("☁️ Attempting to upload to Cloudinary:", localFilePath);

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.error("❌ File does not exist at path:", localFilePath);
      return null;
    }

    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfully
    console.log("✅ File uploaded to cloudinary successfully:", response.url);

    // Remove local file after successful upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    console.error("Error details:", error);

    // Remove the locally saved temporary file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("🗑️ Removed temporary file after failed upload");
    }

    return null;
  }
};

export { uploadOnCloudinary };
