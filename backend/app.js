import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import videoRoutes from "./routes/video.route.js";
import commentRoutes from "./routes/comment.route.js";
import subscriptionRoutes from "./routes/subscription.route.js";
import likeRoutes from "./routes/like.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import tweetRoutes from "./routes/tweet.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import healthRoutes from "./routes/health.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/health", healthRoutes);

export { app };
