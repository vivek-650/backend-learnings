import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(cookieParser());

// ✅ Register routes that use multer BEFORE body parsers
app.use("/api/v1/users", userRoutes);

// ✅ Then add the JSON and URL-encoded parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };
